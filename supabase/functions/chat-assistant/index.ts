import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { mergeUniqueSchemes, rankSchemes } from '../_shared/scheme-retrieval.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      throw new Error('INTEGRATIONS_API_KEY not configured');
    }

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

    const { message, history = [], userProfile = null, schemes = [], language = 'en' } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'No message provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Language instruction mapping
    const languageInstructions: Record<string, string> = {
      'en': 'Respond in English.',
      'hi': 'Respond in Hindi (हिन्दी). Use Devanagari script.',
      'bn': 'Respond in Bengali (বাংলা). Use Bengali script.',
      'ta': 'Respond in Tamil (தமிழ்). Use Tamil script.',
      'mr': 'Respond in Marathi (मराठी). Use Devanagari script.',
      'te': 'Respond in Telugu (తెలుగు). Use Telugu script.',
    };

    const languageInstruction = languageInstructions[language] || languageInstructions['en'];

    // Build context for the AI
    let systemPrompt = `You are Citizen Seva AI Assistant, a helpful and knowledgeable assistant for Indian government schemes and services. 
Your role is to:
1. Help citizens discover government schemes they are eligible for
2. Explain scheme benefits, eligibility criteria, and application processes
3. Answer questions about documents required
4. Guide users through the application process
5. Provide information in a clear, friendly, and accessible manner

${languageInstruction}

Always be respectful, accurate, and helpful. If you don't know something, admit it rather than making up information.`;

    if (userProfile) {
      systemPrompt += `\n\nUser Profile:
- Name: ${userProfile.name || 'Not provided'}
- Age: ${userProfile.age || 'Not provided'}
- State: ${userProfile.state || 'Not provided'}
- City: ${userProfile.city || 'Not provided'}
- Profession: ${userProfile.profession || 'Not provided'}
- Income: ${userProfile.income || 'Not provided'}
- Category: ${userProfile.category || 'Not provided'}
- Education: ${userProfile.education || 'Not provided'}
- Gender: ${userProfile.gender || 'Not provided'}`;
    }

    const { data: storedSchemes, error: storedSchemesError } = await supabase
      .from('schemes')
      .select('*');

    const retrievedSchemes = rankSchemes({
      schemes: Array.isArray(storedSchemes) ? storedSchemes : [],
      profile: userProfile,
      query: message,
      limit: 6,
    });

    const contextualSchemes = mergeUniqueSchemes(retrievedSchemes, Array.isArray(schemes) ? schemes : []);

    if (storedSchemesError) {
      console.warn('Scheme retrieval failed, using client supplied schemes only:', storedSchemesError);
    }

    if (contextualSchemes.length > 0) {
      systemPrompt += `\n\nRelevant Government Schemes:\n`;
      contextualSchemes.forEach((scheme: any, index: number) => {
        systemPrompt += `\n${index + 1}. ${scheme.name}
   - Category: ${scheme.category}
   - Description: ${scheme.description}
   - Benefits: ${scheme.benefits}
   - Required Documents: ${scheme.required_documents?.join(', ')}
   - Eligibility: ${JSON.stringify(scheme.eligibility_criteria)}
   - Relevance: ${(scheme.relevance_reasons || []).join('; ') || 'Matched through retrieval'}`;
      });
    }

    // Build conversation history
    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I am Citizen Seva AI Assistant, ready to help you with government schemes and services.' }]
      }
    ];

    // Add conversation history
    history.forEach((msg: any) => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call LLM API
    const llmResponse = await fetch(
      'https://app-adfkyk0iayo1-api-VaOwP8E7dJqa.gateway.appmedo.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse',
      {
        method: 'POST',
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents }),
      }
    );

    if (!llmResponse.ok) {
      const errorText = await llmResponse.text();
      console.error('LLM API error:', errorText);
      
      if (llmResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'API quota exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (llmResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Insufficient API balance.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Chat processing failed', details: errorText }),
        { status: llmResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Stream the response
    return new Response(llmResponse.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    });
  } catch (error) {
    console.error('Error in chat-assistant:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
