# Citizen Seva – AI Public Service Copilot Requirements Document

## 1. Application Overview

### 1.1 Application Name
Citizen Seva – AI Public Service Copilot

### 1.2 Application Description
A production-grade full-stack GenAI web platform that helps Indian citizens discover and apply for government schemes through intelligent matching, conversational AI assistance, and automated application processing.

## 2. Core Features

### 2.1 Intelligent Authentication System
**Login Modes:**
- Aadhaar Upload (image-based OCR)
- Manual Entry Form

**Manual Entry Form Fields:**
- Real Name
- Age
- City
- State
- Profession (mandatory field: Student, Working, House Wife, etc.)

**AI OCR Pipeline:**
- Upload Aadhaar image
- Extract: Name, DOB (convert to Age), Address (extract State + City), Gender
- Post-processing: Convert raw OCR to clean JSON profile, validate fields
- Prompt user to select Profession after OCR extraction

**Scheme Segregation:**
- Filter and display schemes based on user's State and City information provided during login
- Apply location-based filtering to scheme recommendations

### 2.2 User Profile Engine
**Structured Profile Fields:**
- Name
- Age
- State
- City
- Profession (mandatory: Student, Working, House Wife, etc.)
- Income
- Category
- Education
- Interests

**Dynamic Enrichment:**
- Ask follow-up questions via chatbot
- Store user preferences

**Profile Screen:**
- Dedicated profile page accessible via Profile button
- Display all user profile information
- Allow users to view and edit profile details
- Show complete profile summary including mandatory Profession field

### 2.3 Scheme Knowledge Base (RAG System)
**Data Sources:**
- MyScheme portal data
- State government portals
- Government APIs

**Storage:**
- JSON structured dataset
- Vector embeddings

**RAG Pipeline:**
- User query to embedding
- User profile metadata filtering (including State, City, and Profession)
- Retrieve top matching schemes
- LLM generates explanation

### 2.4 GenAI Chat + Voice Assistant
**Conversational UI Capabilities:**
- ChatGPT-like interface
- Multilingual support: Hinglish, Hindi, English

**Voice System:**
- Input: Speech-to-text (Hindi + English)
- Output: Text-to-speech AI response

### 2.5 AI Agent (Auto-Apply System)
**Feature Name:** Auto-Apply AI Agent

**User Interaction:**
- Click button: ⚡ Apply with AI
- Voice command: Apply for this scheme

**Agent Architecture:**

**1. Agent Controller Layer**
- Accept user intent (text or voice)
- Break down tasks into steps
- Call tools/functions dynamically
- Implement comprehensive error handling and recovery mechanisms
- Add validation checks before each step execution
- Include timeout handling for long-running operations

**2. Tool System**
Implement callable functions with enhanced error handling:
- open_application_page(url) - with retry logic and page load verification
- extract_form_fields() - with fallback parsing strategies
- fill_form_field(field_name, value) - with field existence validation
- upload_document(file_path) - with file format and size verification
- click_button(button_name) - with element visibility checks
- wait_for_user_input(prompt) - with timeout configuration
- validate_form() - with comprehensive field validation
- submit_application() - with submission confirmation checks

Each tool must:
- Return structured responses with success/failure status
- Handle errors gracefully with detailed error messages
- Implement retry mechanisms for transient failures
- Log all actions and errors for debugging
- Validate inputs before execution
- Provide fallback options when primary method fails

**3. LLM Integration**
- Use LLM (Gemini/OpenAI/Mistral) as reasoning engine
- System prompt: You are an AI agent that helps users apply for government schemes by controlling a browser and filling forms. You must use available tools, fill forms using user profile data, ask for confirmation before submission, and stop when OTP or CAPTCHA is encountered
- Implement error recovery prompts for LLM to handle unexpected situations
- Add context preservation across agent steps

**4. Browser Automation Layer**
- Use Playwright (preferred)
- Open real or demo application pages
- Identify form fields dynamically
- Fill inputs
- Click buttons
- Upload files
- Use dynamic selectors with fallback to predefined mappings
- Implement robust element waiting strategies
- Add page state verification before actions
- Handle navigation errors and page timeouts
- Include screenshot capture on errors for debugging

**5. User Profile Mapping Engine**
- Map user profile JSON to form fields intelligently
- Example mappings: Full Name → user.name, Age → user.age, State → user.state
- Use fuzzy matching for field detection
- Implement validation for mapped data
- Handle missing profile fields gracefully

**6. Human-in-the-Loop Control**
At critical steps (OTP input, CAPTCHA, Final submission):
- Pause execution
- Show UI prompt
- Resume after user input
- Implement timeout for user responses
- Allow user to cancel or retry operations

**7. Voice Integration**
- Allow voice-triggered agent execution
- Speech-to-text for commands (Hindi + English)
- Detect intent like Apply for this scheme
- Trigger agent automatically
- Handle voice recognition errors

**8. UI Components**
- Apply Button: ⚡ Apply with AI
- Agent Activity Panel: Shows live steps (Opening page, Filling form, Uploading documents) with real-time status updates
- Confirmation Modal: Do you want to submit?
- OTP Input Modal: User enters OTP
- Error Display Panel: Shows clear error messages and suggested actions
- Retry Button: Allows users to retry failed operations

**9. Safety & Transparency**
- Show all actions before execution
- Allow user to cancel anytime
- Log all actions
- Display clear error messages to users
- Provide actionable recovery suggestions

**10. Error Handling**
Handle:
- Missing fields - prompt user or use default values
- Page load failure - retry with exponential backoff
- Invalid selectors - use alternative selector strategies
- Upload errors - validate file before upload, provide clear error messages
- Network timeouts - implement retry logic
- Browser crashes - restart browser session
- LLM API failures - use fallback responses or retry
- Form validation errors - display errors and allow corrections

Agent should:
- Retry intelligently with configurable retry limits
- Ask user if needed with clear context
- Log detailed error information for debugging
- Provide user-friendly error messages
- Offer manual fallback options when automation fails
- Maintain agent state across errors for recovery

**11. Demo Mode**
Include simulated application page that:
- Mimics real government forms
- Has: Name field, Address, Upload section, Submit button
- Ensures agent always works in demo
- Includes test scenarios for error handling

**12. Backend Architecture**
Create APIs:
- POST /agent/start - with input validation and error responses
- POST /agent/step - with step state management
- POST /agent/submit - with submission verification
- GET /agent/status - for checking agent execution status
- POST /agent/cancel - for canceling ongoing operations
- GET /agent/logs - for retrieving execution logs

Maintain:
- Agent state with persistence
- Step tracking with rollback capability
- Logs with detailed error information
- Session management with timeout handling

**13. State Management**
Track:
- Current step with step history
- Completed actions with timestamps
- Pending user input with timeout tracking
- Error states and recovery attempts
- Use session-based tracking with database persistence
- Implement state recovery mechanisms

**14. Document Handling**
- Allow document upload
- Store securely
- Agent should auto-select required files
- Validate document formats and sizes
- Handle upload failures with retry logic

**15. Performance Optimization**
- Async execution for agent steps
- Loading indicators with progress tracking
- Step-by-step streaming updates
- Implement caching for repeated operations
- Optimize browser automation performance

**16. Future-Ready Design**
Structure code to support:
- Multiple websites
- API-based applications
- Mobile integration
- Enhanced error recovery strategies

**Agent Workflow:**
- User initiates: Apply this scheme for me
- Agent validates user profile completeness
- Agent fetches scheme details
- Extracts required form fields
- Maps user profile to form fields with validation
- Auto-fills form with error checking
- Attaches documents with upload verification
- Pauses at OTP/CAPTCHA
- Requests user confirmation
- Submits application (semi-automated) with submission verification
- Handles any errors during the process with appropriate recovery actions

**Final Output Requirement:**
The AI Agent must successfully demonstrate:
- Opening a form with page load verification
- Filling user data with field validation
- Uploading documents with format verification
- Asking for OTP with timeout handling
- Completing submission with confirmation
- Graceful error handling and recovery at each step
- Clear error messages and user guidance when issues occur

### 2.6 Personalized Dashboard
**Dashboard Sections:**
- Eligible Schemes (filtered by State and City)
- Recommended Schemes (filtered by State, City, and Profession - only schemes applicable to user's current profile and profession)
- Eligibility Score
- Required Documents
- Apply with AI button

**Recommendation Logic:**
- Recommended schemes must match user's complete profile including mandatory Profession field
- Only display schemes that are applicable to the user's current profession (Student, Working, House Wife, etc.)
- Apply comprehensive filtering based on State, City, and Profession

### 2.7 Document Intelligence System
**Capabilities:**
- Upload documents
- AI verification for missing or incorrect format documents
- Suggestions for required documents

### 2.8 Notification Engine
**Notification Types:**
- New scheme alerts
- Deadline reminders
- Application status updates

### 2.9 Multilingual + Accessibility
**Supported Languages:**
- English
- Hindi
- Bengali

**Accessibility:**
- Voice-first UI option

### 2.10 Scheme Detail View with Contextual AI Chat
**View Details Page:**
- Display comprehensive scheme information
- Include Ask AI button

**Ask AI Button Functionality:**
- On click, automatically initialize chatbot with current scheme context
- Chatbot receives scheme-specific information as context
- Chatbot provides answers and information specifically about the opened scheme
- User can ask questions related to eligibility, application process, required documents, deadlines, and other scheme-specific queries
- Chatbot maintains focus on the current scheme throughout the conversation

## 3. UI/UX Design

### 3.1 Design Theme
- Dark mode default
- Glassmorphism effects
- Neon gradients
- Smooth animations

### 3.2 Landing Page
**Sections:**
- Hero: Your AI Assistant for Government Benefits with voice demo animation
- Features showcase: AI Matching, Auto Apply Agent, Voice Assistant
- Demo Chat Window
- CTA: Check Eligibility Now

### 3.3 Dashboard UI
- Card layout
- Progress bars for eligibility percentage
- AI recommendations display
- Profile button for accessing dedicated profile screen

### 3.4 Profile Screen
- Accessible via Profile button from dashboard
- Display complete user profile information
- Show all profile fields including Name, Age, State, City, Profession, Income, Category, Education, Interests
- Allow profile editing functionality
- Highlight mandatory Profession field

## 4. Advanced Features

### 4.1 Scheme Eligibility Score
Calculate and display eligibility percentage for each scheme based on user profile

### 4.2 Auto Form Fill AI Agent
Intelligent automation for application form completion with robust error handling

### 4.3 Voice-first UX
Complete voice interaction capability for accessibility

### 4.4 Real-time Scheme Alerts
Proactive notifications for new matching schemes

### 4.5 Fraud Detection Alerts
Security monitoring for suspicious activities

## 5. System Architecture

### 5.1 Core Flow
```
User Input (Text/Voice)
        ↓
Speech-to-Text (if voice)
        ↓
LLM + RAG Engine
        ↓
Vector DB (Schemes)
        ↓
Response + Dashboard
```

### 5.2 AI Agent Layer
```
User Command → Agent → Browser Automation → Form Fill → User Confirm → Submit
                ↓ (Error Detection)
         Error Handler → Retry/Recovery → User Notification
```

## 6. Reference Files
1. Government Schemes Dataset: Government Schemes Compiled Document

## 7. Technical Requirements

### 7.1 Core Components
- Aadhaar OCR system with data extraction
- RAG-based scheme matching engine
- Vector search with metadata filtering (including State, City, and Profession)
- Conversational AI chatbot
- Contextual chatbot initialization for scheme-specific queries
- Speech-to-text and text-to-speech integration
- Browser automation for form filling (Playwright preferred) with comprehensive error handling
- Document verification system
- Notification system
- Profile management system with dedicated profile screen
- Advanced AI Agent system with modular architecture and robust error recovery
- Tool system with callable functions and validation
- LLM integration for agent reasoning with error handling
- Human-in-the-loop control mechanisms
- Agent state management and logging with persistence
- Error tracking and recovery system
- Retry mechanisms with exponential backoff
- User-friendly error messaging system

### 7.2 Data Management
- Structured database of Indian government schemes
- Vector embeddings for semantic search
- User profile storage with mandatory Profession field
- Document storage
- Location-based and profession-based scheme filtering
- Scheme context management for AI chat
- Agent state and step tracking with error logs
- Action logs with detailed error information

### 7.3 API Design
- Modular API architecture
- Scalable backend design
- Clean separation of concerns
- Profile management endpoints
- Agent control endpoints: POST /agent/start, POST /agent/step, POST /agent/submit, GET /agent/status, POST /agent/cancel, GET /agent/logs
- Comprehensive error response handling
- Input validation and sanitization

### 7.4 Deployment
- Production-ready configuration
- Complete deployable web application
- Not a demo or prototype
- Include monitoring and logging infrastructure
- Implement health checks and status endpoints