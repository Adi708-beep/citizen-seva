import { supabase } from './supabase';
import type {
  Profile,
  Scheme,
  Application,
  Document,
  ChatMessage,
  Notification,
  SchemeWithEligibility,
} from '@/types';

// Profile API
export const profileApi = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create or update a profile record (useful immediately after signup)
  async upsertProfile(userId: string, values: Partial<Profile>): Promise<Profile> {
    const payload = { id: userId, ...values } as any;
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },
};

// Schemes API
export const schemesApi = {
  async getAllSchemes(limit = 50, offset = 0): Promise<Scheme[]> {
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getSchemeById(id: string): Promise<Scheme | null> {
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getSchemesByCategory(category: string, limit = 20): Promise<Scheme[]> {
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getSchemesByState(state: string, limit = 20): Promise<Scheme[]> {
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .or(`state.eq.${state},state.is.null`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async searchSchemes(query: string, limit = 20): Promise<Scheme[]> {
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createScheme(scheme: Omit<Scheme, 'id' | 'created_at' | 'updated_at'>): Promise<Scheme> {
    const { data, error } = await supabase
      .from('schemes')
      .insert(scheme)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateScheme(id: string, updates: Partial<Scheme>): Promise<Scheme> {
    const { data, error } = await supabase
      .from('schemes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteScheme(id: string): Promise<void> {
    const { error } = await supabase
      .from('schemes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Applications API
export const applicationsApi = {
  async getUserApplications(userId: string, limit = 50): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*, scheme:schemes(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getApplicationById(id: string): Promise<Application | null> {
    const { data, error } = await supabase
      .from('applications')
      .select('*, scheme:schemes(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createApplication(application: Omit<Application, 'id' | 'created_at' | 'updated_at'>): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .insert(application)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllApplications(limit = 100, offset = 0): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*, scheme:schemes(*)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },
};

// Documents API
export const documentsApi = {
  async getUserDocuments(userId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getApplicationDocuments(applicationId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .insert(document)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Chat History API
export const chatApi = {
  async getUserChatHistory(userId: string, limit = 50): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async saveChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('chat_history')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async clearChatHistory(userId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  },
};

// Notifications API
export const notificationsApi = {
  async getUserNotifications(userId: string, limit = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) throw error;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  },

  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Eligibility calculation helper
export function calculateEligibility(profile: Profile, scheme: Scheme): SchemeWithEligibility {
  let score = 0;
  const matched: string[] = [];
  const missing: string[] = [];

  // Age check
  if (scheme.age_min !== null && scheme.age_max !== null) {
    if (profile.age && profile.age >= scheme.age_min && profile.age <= scheme.age_max) {
      score += 20;
      matched.push('Age requirement met');
    } else {
      missing.push(`Age must be between ${scheme.age_min} and ${scheme.age_max}`);
    }
  } else {
    score += 20;
  }

  // Income check
  if (scheme.income_max !== null) {
    if (profile.income && profile.income <= scheme.income_max) {
      score += 20;
      matched.push('Income requirement met');
    } else {
      missing.push(`Income must be below ${scheme.income_max}`);
    }
  } else {
    score += 20;
  }

  // Gender check
  if (scheme.gender_specific) {
    if (profile.gender && profile.gender.toLowerCase() === scheme.gender_specific.toLowerCase()) {
      score += 20;
      matched.push('Gender requirement met');
    } else {
      missing.push(`Scheme is for ${scheme.gender_specific} only`);
    }
  } else {
    score += 20;
  }

  // State check
  if (scheme.state) {
    if (profile.state && profile.state === scheme.state) {
      score += 20;
      matched.push('State requirement met');
    } else {
      missing.push(`Must be resident of ${scheme.state}`);
    }
  } else {
    score += 20;
  }

  // Education check
  if (scheme.education_required) {
    if (profile.education) {
      score += 20;
      matched.push('Education requirement met');
    } else {
      missing.push(`Education: ${scheme.education_required} required`);
    }
  } else {
    score += 20;
  }

  return {
    ...scheme,
    eligibility_score: score,
    matched_criteria: matched,
    missing_criteria: missing,
  };
}

// AI Agent API
export const agentApi = {
  async createSession(userId: string, schemeId: string): Promise<any> {
    const { data, error } = await supabase
      .from('agent_sessions')
      .insert({
        user_id: userId,
        scheme_id: schemeId,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSession(sessionId: string): Promise<any> {
    const { data, error } = await supabase
      .from('agent_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateSession(sessionId: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('agent_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserSessions(userId: string, limit = 10): Promise<any[]> {
    const { data, error } = await supabase
      .from('agent_sessions')
      .select('*, schemes(name, category)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getSessionLogs(sessionId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('agent_logs')
      .select('*')
      .eq('session_id', sessionId)
      .order('step_number', { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async addLog(sessionId: string, log: any): Promise<any> {
    const { data, error } = await supabase
      .from('agent_logs')
      .insert({
        session_id: sessionId,
        ...log,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTools(): Promise<any[]> {
    const { data, error } = await supabase
      .from('agent_tools')
      .select('*')
      .eq('enabled', true)
      .order('name');

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },
};

// AI recommendation and retrieval API
export const aiApi = {
  async getSchemeSuggestions(options: {
    query?: string;
    profile?: Profile | null;
    limit?: number;
  }): Promise<SchemeWithEligibility[]> {
    // Ensure we pass the user's access token to the function so it can verify the user
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const invokeOptions: any = {
      body: {
        query: options.query ?? '',
        profile: options.profile ?? null,
        limit: options.limit ?? 6,
      },
    };

    if (token) {
      invokeOptions.headers = { Authorization: `Bearer ${token}` };
    }

    const { data, error } = await supabase.functions.invoke('scheme-suggestions', invokeOptions as any);

    if (error) throw error;
    return Array.isArray(data?.schemes) ? (data.schemes as SchemeWithEligibility[]) : [];
  },
};
