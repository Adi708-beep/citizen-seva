import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Agent Controller called');
    
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      console.error('INTEGRATIONS_API_KEY not configured');
      throw new Error('INTEGRATIONS_API_KEY not configured');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
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
      console.error('User not authenticated');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    const { action, sessionId, schemeId, userInput } = await req.json();
    console.log('Action:', action, 'SchemeId:', schemeId, 'SessionId:', sessionId);

    if (action === 'start') {
      console.log('Starting agent for scheme:', schemeId);
      
      // Create new agent session
      const { data: session, error: sessionError } = await supabase
        .from('agent_sessions')
        .insert({
          user_id: user.id,
          scheme_id: schemeId,
          status: 'running',
          current_step: 'Initializing agent',
          step_number: 0,
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        throw sessionError;
      }

      console.log('Session created:', session.id);

      // Get user profile and scheme details
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      const { data: scheme, error: schemeError } = await supabase
        .from('schemes')
        .select('*')
        .eq('id', schemeId)
        .single();

      if (schemeError) {
        console.error('Scheme fetch error:', schemeError);
        throw new Error('Failed to fetch scheme details');
      }

      console.log('Profile and scheme fetched, generating plan...');

      // Start agent reasoning
      const agentPlan = await planAgentSteps(apiKey, profile, scheme);

      console.log('Plan generated:', agentPlan);

      // Update session with plan
      await supabase
        .from('agent_sessions')
        .update({
          total_steps: agentPlan.steps.length,
          metadata: { plan: agentPlan },
        })
        .eq('id', session.id);

      return new Response(
        JSON.stringify({
          sessionId: session.id,
          plan: agentPlan,
          status: 'started',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'execute_step') {
      // Get session
      const { data: session } = await supabase
        .from('agent_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (!session) {
        throw new Error('Session not found');
      }

      const plan = session.metadata?.plan;
      const currentStepIndex = session.step_number;

      if (currentStepIndex >= plan.steps.length) {
        const { data: finalSession } = await supabase
          .from('agent_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        const applicationNumber =
          finalSession?.metadata?.submission?.applicationNumber ||
          finalSession?.form_data?.applicationNumber ||
          null;

        // All steps completed
        await supabase
          .from('agent_sessions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', sessionId);

        return new Response(
          JSON.stringify({
            status: 'completed',
            message: 'All steps completed',
            result: {
              success: true,
              message: 'Application workflow completed',
              data: { applicationNumber },
            },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const step = plan.steps[currentStepIndex];

      // Execute the tool
      const toolResult = await executeTool(step.tool, step.parameters, session, supabase);

      // Log the action
      await supabase.from('agent_logs').insert({
        session_id: sessionId,
        step_number: currentStepIndex + 1,
        tool_name: step.tool,
        tool_input: step.parameters,
        tool_output: toolResult,
        status: toolResult.success ? 'success' : 'error',
        error_message: toolResult.error,
      });

      // Check if step requires user input
      if (step.tool === 'wait_for_user_input') {
        await supabase
          .from('agent_sessions')
          .update({
            status: 'paused',
            current_step: step.description,
          })
          .eq('id', sessionId);

        return new Response(
          JSON.stringify({
            status: 'paused',
            step: step,
            requiresInput: true,
            prompt: step.parameters.prompt,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Move to next step
      await supabase
        .from('agent_sessions')
        .update({
          step_number: currentStepIndex + 1,
          current_step: step.description,
        })
        .eq('id', sessionId);

      return new Response(
        JSON.stringify({
          status: 'running',
          step: step,
          result: toolResult,
          nextStep: currentStepIndex + 1,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'resume') {
      // Resume from paused state with user input
      const { data: session } = await supabase
        .from('agent_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (!session) {
        throw new Error('Session not found');
      }

      // Store user input in form_data
      const formData = session.form_data || {};
      formData.userInput = userInput;

      await supabase
        .from('agent_sessions')
        .update({
          status: 'running',
          form_data: formData,
          step_number: session.step_number + 1,
        })
        .eq('id', sessionId);

      return new Response(
        JSON.stringify({ status: 'resumed', message: 'Agent resumed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'cancel') {
      await supabase
        .from('agent_sessions')
        .update({
          status: 'cancelled',
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      return new Response(
        JSON.stringify({ status: 'cancelled', message: 'Agent cancelled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');
  } catch (error: any) {
    console.error('Error in ai-agent-controller:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function planAgentSteps(apiKey: string, profile: any, scheme: any) {
  console.log('Planning agent steps...');
  
  try {
    const systemPrompt = `You are an AI agent that helps users apply for government schemes. 
Your task is to create a step-by-step plan to fill out an application form.

Available tools:
- open_application_page: Opens the application page
- extract_form_fields: Extracts form fields from the page
- fill_form_field: Fills a form field with a value
- upload_document: Uploads a document
- wait_for_user_input: Pauses for user input (OTP, CAPTCHA, confirmation)
- validate_form: Validates the form
- submit_application: Submits the application

User Profile:
${JSON.stringify(profile, null, 2)}

Scheme Details:
${JSON.stringify(scheme, null, 2)}

Create a JSON plan with steps array. Each step should have:
- tool: tool name
- parameters: tool parameters
- description: human-readable description

Return ONLY valid JSON, no other text.`;

    const llmResponse = await fetch(
      'https://app-adfkyk0iayo1-api-VaOwP8E7dJqa.gateway.appmedo.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse',
      {
        method: 'POST',
        headers: {
          'X-Gateway-Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }],
            },
          ],
        }),
      }
    );

    if (!llmResponse.ok) {
      console.error('LLM response not OK, using fallback plan');
      return getFallbackPlan(profile, scheme);
    }

    const reader = llmResponse.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.slice(6));
              const text = jsonData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                fullResponse += text;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    }

    // Extract JSON from response
    const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const plan = JSON.parse(jsonMatch[0]);
        console.log('LLM plan generated successfully');
        return plan;
      } catch (e) {
        console.error('Failed to parse LLM response, using fallback');
        return getFallbackPlan(profile, scheme);
      }
    }

    console.log('No JSON found in LLM response, using fallback');
    return getFallbackPlan(profile, scheme);
  } catch (error: any) {
    console.error('Error in planAgentSteps:', error);
    return getFallbackPlan(profile, scheme);
  }
}

function getFallbackPlan(profile: any, scheme: any) {
  console.log('Using fallback plan');
  return {
    steps: [
      {
        tool: 'open_application_page',
        parameters: { url: scheme.application_url || '/demo-application' },
        description: 'Opening application page',
      },
      {
        tool: 'extract_form_fields',
        parameters: {},
        description: 'Analyzing form fields',
      },
      {
        tool: 'fill_form_field',
        parameters: { field_name: 'name', value: profile.name || 'Not provided' },
        description: 'Filling name field',
      },
      {
        tool: 'fill_form_field',
        parameters: { field_name: 'age', value: profile.age?.toString() || 'Not provided' },
        description: 'Filling age field',
      },
      {
        tool: 'fill_form_field',
        parameters: { field_name: 'state', value: profile.state || 'Not provided' },
        description: 'Filling state field',
      },
      {
        tool: 'fill_form_field',
        parameters: { field_name: 'city', value: profile.city || 'Not provided' },
        description: 'Filling city field',
      },
      {
        tool: 'validate_form',
        parameters: {},
        description: 'Validating form data',
      },
      {
        tool: 'wait_for_user_input',
        parameters: { prompt: 'Please confirm submission', input_type: 'confirmation' },
        description: 'Waiting for user confirmation',
      },
      {
        tool: 'submit_application',
        parameters: {},
        description: 'Submitting application',
      },
    ],
  };
}

async function executeTool(toolName: string, parameters: any, session: any, supabase: any) {
  const startTime = Date.now();

  try {
    switch (toolName) {
      case 'open_application_page':
        return {
          success: true,
          message: `Opened page: ${parameters.url}`,
          data: { url: parameters.url },
          execution_time_ms: Date.now() - startTime,
        };

      case 'extract_form_fields':
        return {
          success: true,
          message: 'Form fields extracted',
          data: {
            fields: ['name', 'age', 'state', 'city', 'income', 'category'],
          },
          execution_time_ms: Date.now() - startTime,
        };

      case 'fill_form_field':
        // Update session form_data
        const formData = session.form_data || {};
        formData[parameters.field_name] = parameters.value;

        await supabase
          .from('agent_sessions')
          .update({ form_data: formData })
          .eq('id', session.id);

        return {
          success: true,
          message: `Filled field: ${parameters.field_name}`,
          data: { field: parameters.field_name, value: parameters.value },
          execution_time_ms: Date.now() - startTime,
        };

      case 'upload_document':
        // Store document upload info in form_data
        const currentFormData = session.form_data || {};
        if (!currentFormData.documents) {
          currentFormData.documents = {};
        }
        currentFormData.documents[parameters.field_name || 'document'] = 'Uploaded';

        await supabase
          .from('agent_sessions')
          .update({ form_data: currentFormData })
          .eq('id', session.id);

        return {
          success: true,
          message: `Document uploaded: ${parameters.field_name || 'document'}`,
          data: { field: parameters.field_name },
          execution_time_ms: Date.now() - startTime,
        };

      case 'wait_for_user_input':
        return {
          success: true,
          message: 'Waiting for user input',
          data: { prompt: parameters.prompt },
          execution_time_ms: Date.now() - startTime,
        };

      case 'validate_form':
        const data = session.form_data || {};
        const missingFields = [];

        if (!data.name) missingFields.push('name');
        if (!data.age) missingFields.push('age');
        if (!data.state) missingFields.push('state');

        return {
          success: missingFields.length === 0,
          message: missingFields.length === 0 ? 'Form validated' : 'Missing fields',
          data: { missingFields },
          execution_time_ms: Date.now() - startTime,
        };

      case 'submit_application':
        const applicationNumber = `APP-${Date.now()}`;
        const updatedFormData = session.form_data || {};
        updatedFormData.applicationNumber = applicationNumber;

        await supabase
          .from('agent_sessions')
          .update({
            form_data: updatedFormData,
            metadata: {
              ...(session.metadata || {}),
              submission: {
                applicationNumber,
                submittedAt: new Date().toISOString(),
              },
            },
          })
          .eq('id', session.id);

        return {
          success: true,
          message: 'Application submitted successfully',
          data: { applicationNumber },
          execution_time_ms: Date.now() - startTime,
        };

      default:
        return {
          success: false,
          error: `Unknown tool: ${toolName}`,
          execution_time_ms: Date.now() - startTime,
        };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unknown error',
      execution_time_ms: Date.now() - startTime,
    };
  }
}
