import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env');
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : process.env;

function parseEnv(text) {
  const out = {};
  if (typeof text !== 'string') return out;
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([^=#]+)=?(.*)$/);
    if (!m) continue;
    const k = m[1].trim();
    let v = m[2] || '';
    v = v.trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[k] = v;
  }
  return out;
}

const parsed = typeof env === 'string' ? parseEnv(env) : env;
const SUPABASE_URL = parsed.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = parsed.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(async () => {
  try {
    const email = `e2e+${Date.now()}@miaoda.com`;
    const password = 'Testpass123!';
    console.log('Signing up test user:', email);
    const { data: signData, error: signError } = await supabase.auth.signUp({ email, password });
    if (signError) {
      console.error('Sign up error:', signError.message || signError);
    }

    // Try sign in to get session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      console.error('Sign in error:', signInError.message || signInError);
      process.exit(1);
    }

    const session = signInData?.session;
    const user = session?.user;
    if (!user || !session) {
      console.error('No session/user returned');
      process.exit(1);
    }

    console.log('Signed in user id:', user.id);

    // Set session on client so subsequent requests include Authorization header for RLS
    await supabase.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });

    // Upsert profile
    const profile = {
      id: user.id,
      email,
      name: 'E2E Tester',
      state: 'Delhi',
      city: 'New Delhi',
      profession: 'Working',
      age: 30,
      profile_completed: true,
    };

    console.log('Upserting profile...');
    const { data: profileData, error: profileError } = await supabase.from('profiles').upsert(profile, { onConflict: 'id' }).select().single();
    if (profileError) {
      console.error('Profile upsert error:', profileError.message || profileError);
      process.exit(1);
    }

    console.log('Profile upserted. Now invoking scheme-suggestions function...');

    const invokeBody = {
      query: '',
      profile: profileData,
      limit: 20,
    };

    const { data: funcData, error: funcError } = await supabase.functions.invoke('scheme-suggestions', {
      body: invokeBody,
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (funcError) {
      console.error('Function invoke error:', funcError.message || funcError);
      process.exit(1);
    }

    const schemes = Array.isArray(funcData?.schemes) ? funcData.schemes : [];
    console.log('Schemes returned:', schemes.length);
    for (let i = 0; i < Math.min(10, schemes.length); i++) {
      const s = schemes[i];
      console.log(`${i + 1}. ${s.name} — eligibility: ${s.eligibility_score} — state: ${s.state}`);
    }

    // Also fetch all schemes as fallback
    const { data: allSchemes, error: allErr } = await supabase.from('schemes').select('*').limit(10);
    if (allErr) {
      console.error('Failed to fetch all schemes:', allErr.message || allErr);
    } else {
      console.log('Total schemes in DB (sample 10):', Array.isArray(allSchemes) ? allSchemes.length : 0);
    }

    console.log('E2E test finished.');
    process.exit(0);
  } catch (e) {
    console.error('Unexpected error:', e);
    process.exit(1);
  }
})();
