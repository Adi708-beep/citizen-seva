# AI Agent Auto-Apply System

## Overview
The AI Agent Auto-Apply System is an intelligent automation feature that helps users apply for government schemes by automatically filling forms, uploading documents, and submitting applications.

## Architecture

### 1. Database Schema

#### agent_sessions
Tracks the state of each agent execution:
- `id`: Unique session identifier
- `user_id`: User who initiated the agent
- `scheme_id`: Scheme being applied for
- `status`: Current status (pending, running, paused, completed, failed, cancelled)
- `current_step`: Description of current step
- `step_number`: Current step index
- `total_steps`: Total number of steps in plan
- `form_data`: JSON object storing filled form data
- `metadata`: Additional metadata including the execution plan
- `error_message`: Error details if failed
- `started_at`, `completed_at`, `created_at`, `updated_at`: Timestamps

#### agent_logs
Logs every action performed by the agent:
- `id`: Unique log identifier
- `session_id`: Reference to agent session
- `step_number`: Step index
- `tool_name`: Name of tool executed
- `tool_input`: Input parameters for the tool
- `tool_output`: Result from tool execution
- `status`: Execution status (success, error, pending)
- `error_message`: Error details if failed
- `execution_time_ms`: Time taken to execute
- `created_at`: Timestamp

#### agent_tools
Defines available tools:
- `id`: Unique tool identifier
- `name`: Tool name
- `description`: Tool description
- `parameters`: JSON schema of parameters
- `enabled`: Whether tool is active

### 2. Edge Function: ai-agent-controller

Located at: `/supabase/functions/ai-agent-controller/index.ts`

#### Actions

**start**
- Creates new agent session
- Fetches user profile and scheme details
- Calls LLM to generate execution plan
- Returns session ID and plan

**execute_step**
- Executes the current step in the plan
- Logs the action
- Handles user input requirements
- Moves to next step or completes

**resume**
- Resumes from paused state
- Stores user input
- Continues execution

**cancel**
- Cancels the agent session
- Updates status to cancelled

#### Tool System

**Available Tools:**
1. `open_application_page`: Opens the application URL
2. `extract_form_fields`: Analyzes form fields
3. `fill_form_field`: Fills a specific form field
4. `upload_document`: Uploads a document
5. `wait_for_user_input`: Pauses for user input (OTP, confirmation)
6. `validate_form`: Validates all form fields
7. `submit_application`: Submits the application

Each tool returns:
```typescript
{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  execution_time_ms: number;
}
```

### 3. Frontend Components

#### AIAgentModal
Located at: `/src/components/common/AIAgentModal.tsx`

Features:
- Real-time progress tracking
- Live activity log
- User input prompts
- Status badges
- Cancel functionality
- Retry on error

Props:
```typescript
{
  open: boolean;
  onClose: () => void;
  schemeId: string;
  schemeName: string;
  userId: string;
}
```

#### DemoApplicationPage
Located at: `/src/pages/DemoApplicationPage.tsx`

A simulated government application form with:
- Personal information fields
- Address information
- Economic information
- Document upload
- Form validation
- Success confirmation

### 4. Integration Points

#### SchemeDetailPage
- "Apply with AI Agent" button
- Opens AIAgentModal on click
- Passes scheme details to agent

#### DashboardPage
- AI Agent feature showcase card
- Info banner explaining the feature
- Links to schemes page

#### ChatPage
- Voice command detection
- Triggers: "apply for this scheme", "apply with ai", "start application"
- Shows toast notification with instructions

### 5. API Integration

#### agentApi (in /src/db/api.ts)

Methods:
- `createSession(userId, schemeId)`: Create new agent session
- `getSession(sessionId)`: Get session details
- `updateSession(sessionId, updates)`: Update session
- `getUserSessions(userId, limit)`: Get user's sessions
- `getSessionLogs(sessionId)`: Get session logs
- `addLog(sessionId, log)`: Add log entry
- `getTools()`: Get available tools

## Usage Flow

### User Journey

1. **Discovery**
   - User sees "AI Agent" feature on dashboard
   - Navigates to scheme detail page

2. **Initiation**
   - Clicks "Apply with AI Agent" button
   - AIAgentModal opens

3. **Planning**
   - Agent analyzes scheme requirements
   - LLM generates step-by-step plan
   - Shows total steps and progress

4. **Execution**
   - Agent executes each step sequentially
   - Shows live updates in activity log
   - Fills form fields with user profile data
   - Uploads required documents

5. **User Interaction**
   - Agent pauses for OTP/CAPTCHA
   - User provides input
   - Agent resumes execution

6. **Confirmation**
   - Agent shows form preview
   - Asks for final confirmation
   - User approves submission

7. **Completion**
   - Agent submits application
   - Shows success message with application number
   - User can close modal

### Voice Commands

Supported phrases:
- "Apply for this scheme"
- "Apply this scheme"
- "Apply with AI"
- "Start application"
- "Fill the form"
- "Auto apply"

## LLM Integration

The agent uses Gemini 2.5 Flash for intelligent planning:

**System Prompt:**
```
You are an AI agent that helps users apply for government schemes.
Your task is to create a step-by-step plan to fill out an application form.

Available tools:
- open_application_page
- extract_form_fields
- fill_form_field
- upload_document
- wait_for_user_input
- validate_form
- submit_application

User Profile: {...}
Scheme Details: {...}

Create a JSON plan with steps array.
```

**Response Format:**
```json
{
  "steps": [
    {
      "tool": "open_application_page",
      "parameters": { "url": "..." },
      "description": "Opening application page"
    },
    ...
  ]
}
```

## Safety & Transparency

### Safety Features
1. **User Confirmation**: Always asks before final submission
2. **Pause Points**: Stops at OTP/CAPTCHA
3. **Cancel Anytime**: User can cancel at any step
4. **Error Handling**: Graceful error handling with retry
5. **Logging**: All actions are logged

### Transparency
1. **Live Updates**: Shows each step in real-time
2. **Activity Log**: Complete history of actions
3. **Progress Tracking**: Visual progress bar
4. **Status Badges**: Clear status indicators

## Demo Mode

The system includes a demo application page at `/demo-application` that:
- Mimics real government forms
- Works without external dependencies
- Demonstrates full agent capabilities
- Provides realistic user experience

## Error Handling

### Common Errors
1. **Session Not Found**: Invalid session ID
2. **Tool Execution Failed**: Tool returned error
3. **LLM Planning Failed**: Fallback to default plan
4. **Network Error**: Retry with exponential backoff

### Recovery Strategies
1. **Automatic Retry**: For transient errors
2. **Fallback Plan**: Default plan if LLM fails
3. **User Notification**: Clear error messages
4. **Manual Intervention**: User can retry or cancel

## Performance Optimization

1. **Async Execution**: Non-blocking operations
2. **Streaming Updates**: Real-time progress
3. **Efficient Logging**: Batch log writes
4. **Session Caching**: Reduce database queries

## Future Enhancements

1. **Multi-Site Support**: Support multiple application portals
2. **API Integration**: Direct API submissions
3. **Document OCR**: Extract data from documents
4. **Smart Retry**: Intelligent retry logic
5. **Mobile Support**: Mobile app integration
6. **Batch Applications**: Apply to multiple schemes
7. **Schedule Applications**: Schedule for later
8. **Application Tracking**: Track application status

## Security Considerations

1. **RLS Policies**: Row-level security on all tables
2. **Authentication**: Required for all operations
3. **Input Validation**: Validate all user inputs
4. **Rate Limiting**: Prevent abuse
5. **Audit Trail**: Complete action history
6. **Data Encryption**: Sensitive data encrypted

## Testing

### Manual Testing
1. Navigate to any scheme detail page
2. Click "Apply with AI Agent"
3. Observe agent execution
4. Provide input when prompted
5. Confirm submission
6. Verify success message

### Voice Testing
1. Go to chat page
2. Click microphone icon
3. Say "Apply for this scheme"
4. Verify toast notification

### Demo Testing
1. Navigate to `/demo-application`
2. Fill form manually
3. Submit and verify success

## Troubleshooting

### Agent Not Starting
- Check user authentication
- Verify scheme ID is valid
- Check Edge Function logs

### Agent Stuck
- Check session status in database
- Review agent logs
- Cancel and retry

### Form Not Filling
- Verify user profile is complete
- Check form field mapping
- Review tool execution logs

## API Reference

### Start Agent
```typescript
POST /functions/v1/ai-agent-controller
{
  "action": "start",
  "schemeId": "uuid"
}
```

### Execute Step
```typescript
POST /functions/v1/ai-agent-controller
{
  "action": "execute_step",
  "sessionId": "uuid"
}
```

### Resume Agent
```typescript
POST /functions/v1/ai-agent-controller
{
  "action": "resume",
  "sessionId": "uuid",
  "userInput": "string"
}
```

### Cancel Agent
```typescript
POST /functions/v1/ai-agent-controller
{
  "action": "cancel",
  "sessionId": "uuid"
}
```

## Conclusion

The AI Agent Auto-Apply System is a production-ready, intelligent automation feature that significantly improves the user experience for applying to government schemes. It combines LLM reasoning, tool execution, and human-in-the-loop control to provide a safe, transparent, and efficient application process.
