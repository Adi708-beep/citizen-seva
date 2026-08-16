import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = await req.json();

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: text and targetLanguage' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Language code mapping for Google Translate API
    const languageMap: Record<string, string> = {
      'en': 'en',
      'hi': 'hi',
      'bn': 'bn',
      'ta': 'ta',
      'mr': 'mr',
      'te': 'te',
    };

    const targetLangCode = languageMap[targetLanguage] || targetLanguage;
    const sourceLangCode = languageMap[sourceLanguage] || sourceLanguage;

    // Get API key from environment
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      throw new Error('INTEGRATIONS_API_KEY not configured');
    }

    // Call Google Cloud Translation API
    const translationResponse = await fetch(
      'https://app-adfkyk0iayo1-api-GaDwZ8DX7jPY.gateway.appmedo.com/language/translate/v2',
      {
        method: 'POST',
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLangCode,
          source: sourceLangCode,
          format: 'text',
        }),
      }
    );

    if (!translationResponse.ok) {
      const errorText = await translationResponse.text();
      console.error('Translation API error:', errorText);
      
      // Check for quota/balance errors
      if (translationResponse.status === 429) {
        throw new Error('Translation quota exceeded. Please try again later.');
      }
      if (translationResponse.status === 402) {
        throw new Error('Insufficient balance for translation service.');
      }
      
      throw new Error(`Translation failed: ${errorText}`);
    }

    const translationData = await translationResponse.json();
    const translatedText = translationData?.data?.translations?.[0]?.translatedText;

    if (!translatedText) {
      throw new Error('No translation returned from API');
    }

    return new Response(
      JSON.stringify({ 
        translatedText,
        detectedSourceLanguage: translationData?.data?.translations?.[0]?.detectedSourceLanguage 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Translation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
