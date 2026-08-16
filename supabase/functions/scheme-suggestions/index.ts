import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { rankSchemes } from '../_shared/scheme-retrieval.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { query = '', profile = null, limit = 6 } = await req.json();

    const { data: schemes, error } = await supabase
      .from('schemes')
      .select('*');

    if (error) {
      throw error;
    }

    const rankedSchemes = rankSchemes({
      schemes: Array.isArray(schemes) ? schemes : [],
      profile,
      query,
      limit: Math.max(1, Math.min(Number(limit) || 6, 20)),
    });

    return new Response(
      JSON.stringify({
        schemes: rankedSchemes,
        query,
        total: Array.isArray(schemes) ? schemes.length : 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in scheme-suggestions:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});