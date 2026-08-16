import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      throw new Error('INTEGRATIONS_API_KEY not configured');
    }

    const { text, targetLanguage, sourceLanguage = null } = await req.json();

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Text and target language are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map language codes
    const languageMap: Record<string, string> = {
      'en': 'en',
      'hi': 'hi',
      'bn': 'bn',
      'english': 'en',
      'hindi': 'hi',
      'bengali': 'bn',
    };

    const targetLang = languageMap[targetLanguage.toLowerCase()] || targetLanguage;
    const sourceLang = sourceLanguage ? (languageMap[sourceLanguage.toLowerCase()] || sourceLanguage) : null;

    // Call Translation API
    const translateResponse = await fetch(
      'https://app-adfkyk0iayo1-api-GaDwZ8DX7jPY.gateway.appmedo.com/language/translate/v2',
      {
        method: 'POST',
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          ...(sourceLang && { source: sourceLang }),
          format: 'text',
        }),
      }
    );

    if (!translateResponse.ok) {
      const errorText = await translateResponse.text();
      console.error('Translation API error:', errorText);
      
      if (translateResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'API quota exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (translateResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Insufficient API balance.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Translation failed', details: errorText }),
        { status: translateResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const translateData = await translateResponse.json();
    const translatedText = translateData.data?.translations?.[0]?.translatedText || text;
    const detectedLanguage = translateData.data?.translations?.[0]?.detectedSourceLanguage;

    return new Response(
      JSON.stringify({ 
        success: true, 
        translatedText,
        detectedSourceLanguage: detectedLanguage 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in translate:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
