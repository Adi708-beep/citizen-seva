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

    const formData = await req.formData();
    const audioFile = formData.get('file');
    const language = formData.get('language') || 'en';

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: 'No audio file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Forward to Speech-to-Text API
    const sttFormData = new FormData();
    sttFormData.append('file', audioFile);
    sttFormData.append('response_format', 'json');
    sttFormData.append('language', language as string);

    const sttResponse = await fetch(
      'https://app-adfkyk0iayo1-api-DY8MNQoqOnMa.gateway.appmedo.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: sttFormData,
      }
    );

    if (!sttResponse.ok) {
      const errorText = await sttResponse.text();
      console.error('STT API error:', errorText);
      
      if (sttResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'API quota exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (sttResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Insufficient API balance.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Speech-to-text processing failed', details: errorText }),
        { status: sttResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sttData = await sttResponse.json();

    return new Response(
      JSON.stringify({ success: true, text: sttData.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in speech-to-text:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
