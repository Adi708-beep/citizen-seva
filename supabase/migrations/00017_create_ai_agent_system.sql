-- AI Agent System Tables

-- Agent Sessions: Track agent execution state
CREATE TABLE IF NOT EXISTS agent_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'paused', 'completed', 'failed', 'cancelled')),
  current_step TEXT,
  step_number INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  form_data JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Logs: Track all agent actions
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  tool_name TEXT NOT NULL,
  tool_input JSONB,
  tool_output JSONB,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending')),
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Tools: Define available tools
CREATE TABLE IF NOT EXISTS agent_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  parameters JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tools
INSERT INTO agent_tools (name, description, parameters) VALUES
  ('open_application_page', 'Opens the application page for a scheme', '{"url": "string"}'),
  ('extract_form_fields', 'Extracts form fields from the current page', '{}'),
  ('fill_form_field', 'Fills a form field with a value', '{"field_name": "string", "value": "string"}'),
  ('upload_document', 'Uploads a document to a form field', '{"field_name": "string", "file_path": "string"}'),
  ('click_button', 'Clicks a button on the page', '{"button_name": "string"}'),
  ('wait_for_user_input', 'Pauses and waits for user input', '{"prompt": "string", "input_type": "string"}'),
  ('validate_form', 'Validates all form fields are filled correctly', '{}'),
  ('submit_application', 'Submits the application form', '{}')
ON CONFLICT (name) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_sessions_user_id ON agent_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_scheme_id ON agent_sessions(scheme_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_status ON agent_sessions(status);
CREATE INDEX IF NOT EXISTS idx_agent_logs_session_id ON agent_logs(session_id);

-- RLS Policies
ALTER TABLE agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tools ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view own agent sessions"
  ON agent_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own sessions
CREATE POLICY "Users can create own agent sessions"
  ON agent_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "Users can update own agent sessions"
  ON agent_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can view logs for their sessions
CREATE POLICY "Users can view own agent logs"
  ON agent_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agent_sessions
      WHERE agent_sessions.id = agent_logs.session_id
      AND agent_sessions.user_id = auth.uid()
    )
  );

-- Anyone can view enabled tools
CREATE POLICY "Anyone can view enabled tools"
  ON agent_tools FOR SELECT
  USING (enabled = true);