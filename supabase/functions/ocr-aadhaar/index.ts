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
    const imageFile = formData.get('image');

    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: 'No image file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Forward to OCR API
    const ocrFormData = new FormData();
    ocrFormData.append('file', imageFile);
    ocrFormData.append('language', 'eng');
    ocrFormData.append('isTable', 'false');
    ocrFormData.append('OCREngine', '2');

    const ocrResponse = await fetch(
      'https://app-adfkyk0iayo1-api-W9z3M6eONl3L.gateway.appmedo.com/parse/image',
      {
        method: 'POST',
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
        },
        body: ocrFormData,
      }
    );

    if (!ocrResponse.ok) {
      const errorText = await ocrResponse.text();
      console.error('OCR API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'OCR processing failed', details: errorText }),
        { status: ocrResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ocrData = await ocrResponse.json();

    // Extract Aadhaar information from OCR text
    const parsedText = ocrData.ParsedResults?.[0]?.ParsedText || '';
    
    // Parse Aadhaar details using regex patterns
    const extractedData = {
      name: extractName(parsedText),
      dob: extractDOB(parsedText),
      age: null as number | null,
      gender: extractGender(parsedText),
      address: extractAddress(parsedText),
      state: null as string | null,
      city: null as string | null,
      aadhaarNumber: extractAadhaarNumber(parsedText),
      rawText: parsedText,
    };

    // Calculate age from DOB
    if (extractedData.dob) {
      const birthDate = new Date(extractedData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      extractedData.age = age;
    }

    // Extract state and city from address
    if (extractedData.address) {
      const addressParts = extractedData.address.split(',').map(s => s.trim());
      if (addressParts.length >= 2) {
        extractedData.city = addressParts[addressParts.length - 2];
        extractedData.state = addressParts[addressParts.length - 1];
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ocr-aadhaar:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractName(text: string): string | null {
  // Look for name patterns (usually after "Name" or before DOB)
  const namePatterns = [
    /(?:Name|NAME)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/m,
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}

function extractDOB(text: string): string | null {
  // Look for DOB patterns (DD/MM/YYYY, DD-MM-YYYY, etc.)
  const dobPatterns = [
    /(?:DOB|Date of Birth|Birth)[\s:]+(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
    /(\d{2}[\/\-]\d{2}[\/\-]\d{4})/,
  ];
  
  for (const pattern of dobPatterns) {
    const match = text.match(pattern);
    if (match) {
      const dobStr = match[1];
      const parts = dobStr.split(/[\/\-]/);
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
      }
    }
  }
  return null;
}

function extractGender(text: string): string | null {
  const genderPatterns = [
    /(?:Gender|Sex)[\s:]+(\w+)/i,
    /\b(Male|Female|MALE|FEMALE)\b/,
  ];
  
  for (const pattern of genderPatterns) {
    const match = text.match(pattern);
    if (match) {
      const gender = match[1].toLowerCase();
      return gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : null;
    }
  }
  return null;
}

function extractAddress(text: string): string | null {
  // Look for address patterns (usually multi-line after "Address")
  const addressPattern = /(?:Address|ADDRESS)[\s:]+([^\n]+(?:\n[^\n]+)*?)(?=\n\n|\n[A-Z]+:|\d{6}|$)/i;
  const match = text.match(addressPattern);
  if (match) {
    return match[1].replace(/\n/g, ', ').trim();
  }
  
  // Fallback: look for PIN code and extract preceding lines
  const pinPattern = /([^\n]+(?:\n[^\n]+)*?)\s*(\d{6})/;
  const pinMatch = text.match(pinPattern);
  if (pinMatch) {
    return pinMatch[1].replace(/\n/g, ', ').trim();
  }
  
  return null;
}

function extractAadhaarNumber(text: string): string | null {
  // Look for 12-digit Aadhaar number (with or without spaces)
  const aadhaarPattern = /\b(\d{4}\s?\d{4}\s?\d{4})\b/;
  const match = text.match(aadhaarPattern);
  return match ? match[1].replace(/\s/g, '') : null;
}
