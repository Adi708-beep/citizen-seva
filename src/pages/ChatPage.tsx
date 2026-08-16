import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlan } from '@/contexts/PlanContext';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/db/supabase';
import { aiApi, chatApi, schemesApi } from '@/db/api';
import { Bot, Send, Mic, Volume2, Pause, Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ChatMessage } from '@/types';
import { LANGUAGES } from '@/types';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';

export default function ChatPage() {
  const { user, profile } = useAuth();
  const { activePlan, remainingChatRequests, canSendChatRequest, recordChatRequest } = usePlan();
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'bn' | 'ta' | 'mr' | 'te'>('en');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scheme context from navigation state
  useEffect(() => {
    if (!hasInitialized && location.state?.schemeContext && user && profile && messages.length === 0) {
      const schemeContext = location.state.schemeContext;
      setHasInitialized(true);
      
      // Auto-start conversation about the scheme
      setTimeout(() => {
        handleSchemeContextChat(schemeContext);
      }, 500);
    }
  }, [location.state, user, profile, messages.length, hasInitialized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const streamAssistantResponse = async (
    response: Response,
    onToken: (nextText: string) => void
  ): Promise<string> => {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let assistantResponse = '';

    const parseEventChunk = (eventChunk: string) => {
      const dataLines = eventChunk
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trim())
        .filter(Boolean);

      if (!dataLines.length) {
        return;
      }

      const payload = dataLines.join('');
      if (payload === '[DONE]') {
        return;
      }

      try {
        const jsonData = JSON.parse(payload);
        const text = jsonData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          assistantResponse += text;
          onToken(assistantResponse);
        }
      } catch {
        // Ignore non-JSON or partial chunks that do not contain model text.
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const eventChunk of events) {
        parseEventChunk(eventChunk);
      }
    }

    if (buffer.trim()) {
      parseEventChunk(buffer);
    }

    return assistantResponse;
  };

  const loadChatHistory = async () => {
    if (!user) return;
    try {
      const history = await chatApi.getUserChatHistory(user.id, 50);
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSchemeContextChat = async (schemeContext: any) => {
    if (!user || !profile) return;

    if (!canSendChatRequest()) {
      toast.error('Free plan chat limit reached. Upgrade from the landing page to continue.');
      return;
    }

    const tracked = recordChatRequest();
    if (!tracked) {
      toast.error('Unable to track this request. Please try again.');
      return;
    }

    const contextMessage = `I'm interested in the "${schemeContext.name}" scheme. Can you tell me more about it and help me understand if I'm eligible?`;
    
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      user_id: user.id,
      role: 'user',
      content: contextMessage,
      language,
      created_at: new Date().toISOString(),
    };
    setMessages([userMsg]);
    
    // Save user message
    await chatApi.saveChatMessage({
      user_id: user.id,
      role: 'user',
      content: contextMessage,
      language,
    });

    setIsLoading(true);

    try {
      const suggestionSchemes = await aiApi.getSchemeSuggestions({
        query: schemeContext.name,
        profile,
        limit: 5,
      }).catch(() => [schemeContext]);

      // Get Supabase credentials
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      if (!authToken) {
        throw new Error('Your session has expired. Please log in again.');
      }

      // Create enhanced context message for the AI
      const enhancedMessage = `User is asking about the scheme: "${schemeContext.name}".

Scheme Details:
- Name: ${schemeContext.name}
- Category: ${schemeContext.category}
- State: ${schemeContext.state || 'National'}
- Department: ${schemeContext.department || 'N/A'}
- Description: ${schemeContext.description}
- Benefits: ${schemeContext.benefits}
- User's Eligibility Score: ${schemeContext.eligibility_score}%

User's Matched Criteria:
${schemeContext.matched_criteria?.map((c: string) => `- ${c}`).join('\n') || 'None'}

User's Missing Criteria:
${schemeContext.missing_criteria?.map((c: string) => `- ${c}`).join('\n') || 'None'}

Required Documents:
${schemeContext.required_documents?.map((d: string) => `- ${d}`).join('\n') || 'None'}

User's Question: ${contextMessage}

Please provide detailed, helpful information about this scheme, explain the eligibility requirements, benefits, and guide the user on how to apply. Be conversational and supportive.`;

      // Call chat assistant
      const response = await fetch(`${supabaseUrl}/functions/v1/chat-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: enhancedMessage,
          history: [],
          userProfile: profile,
          schemes: suggestionSchemes,
          language,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to get response from AI');
      }

      // Create a temporary assistant message that we'll update
      const tempAssistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        user_id: user.id,
        role: 'assistant',
        content: '',
        language,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempAssistantMsg]);

      let assistantResponse = await streamAssistantResponse(response, (nextText) => {
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.id === tempAssistantMsg.id) {
            lastMsg.content = nextText;
          }
          return updated;
        });
      });

      // If no response was generated, show error
      if (!assistantResponse) {
        assistantResponse = 'I apologize, but I could not generate a response. Please try again.';
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.id === tempAssistantMsg.id) {
            lastMsg.content = assistantResponse;
          }
          return updated;
        });
      }

      // Save assistant message
      await chatApi.saveChatMessage({
        user_id: user.id,
        role: 'assistant',
        content: assistantResponse,
        language,
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    if (!canSendChatRequest()) {
      toast.error('Chat limit reached for your plan. Buy a paid plan to continue.');
      return;
    }

    const tracked = recordChatRequest();
    if (!tracked) {
      toast.error('Unable to track this request. Please try again.');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to UI
    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      user_id: user.id,
      role: 'user',
      content: userMessage,
      language,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      // Save user message
      await chatApi.saveChatMessage({
        user_id: user.id,
        role: 'user',
        content: userMessage,
        language,
      });

      // Get relevant schemes for context using the retrieval layer, with a local fallback
      const schemes = await aiApi.getSchemeSuggestions({
        query: userMessage,
        profile,
        limit: 6,
      }).catch(async () => {
        const fallbackSchemes = await schemesApi.getAllSchemes(10);
        return fallbackSchemes.slice(0, 5).map((scheme) => ({
          ...scheme,
          eligibility_score: 0,
          matched_criteria: [],
          missing_criteria: [],
        }));
      });

      // Get Supabase credentials
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      if (!authToken) {
        throw new Error('Your session has expired. Please log in again.');
      }

      // Call chat assistant - note: this returns a streaming response
      const response = await fetch(`${supabaseUrl}/functions/v1/chat-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
          userProfile: profile,
          schemes,
          language,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to get response from AI');
      }

      // Create a temporary assistant message that we'll update
      const tempAssistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        user_id: user.id,
        role: 'assistant',
        content: '',
        language,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempAssistantMsg]);

      let assistantResponse = await streamAssistantResponse(response, (nextText) => {
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.id === tempAssistantMsg.id) {
            lastMsg.content = nextText;
          }
          return updated;
        });
      });

      // If no response was generated, show error
      if (!assistantResponse) {
        assistantResponse = 'I apologize, but I could not generate a response. Please try again.';
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.id === tempAssistantMsg.id) {
            lastMsg.content = assistantResponse;
          }
          return updated;
        });
      }

      // Save assistant message
      await chatApi.saveChatMessage({
        user_id: user.id,
        role: 'assistant',
        content: assistantResponse,
        language,
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Get speech code from LANGUAGES array
    const selectedLang = LANGUAGES.find(l => l.code === language);
    recognition.lang = selectedLang?.speechCode || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);

      // Check for AI agent trigger phrases
      const lowerTranscript = transcript.toLowerCase();
      const agentTriggers = [
        'apply for this scheme',
        'apply this scheme',
        'apply with ai',
        'start application',
        'fill the form',
        'auto apply',
      ];

      const isAgentTrigger = agentTriggers.some(trigger => lowerTranscript.includes(trigger));
      
      if (isAgentTrigger) {
        toast.info('AI Agent command detected! Please select a scheme from the schemes page to use the AI Agent.');
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      toast.error('Voice recognition failed');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleTextToSpeech = async (text: string, messageId: string) => {
    try {
      // If already playing this message, pause it
      if (playingMessageId === messageId && audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
        return;
      }

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setIsPlaying(true);
      setPlayingMessageId(messageId);

      // Translate text to selected language if not English
      let textToSpeak = text;
      if (language !== 'en') {
        const { data: translationData, error: translationError } = await supabase.functions.invoke('translate-text', {
          body: { 
            text, 
            targetLanguage: language,
            sourceLanguage: 'en'
          },
        });

        if (!translationError && translationData?.translatedText) {
          textToSpeak = translationData.translatedText;
        }
      }

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text: textToSpeak, voice: 'heart', format: 'mp3', language },
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        throw new Error(errorMsg || error.message);
      }

      const audioBlob = new Blob([data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        setPlayingMessageId(null);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setPlayingMessageId(null);
        audioRef.current = null;
        toast.error('Failed to play audio');
      };

      audioRef.current = audio;
      await audio.play();
    } catch (error: any) {
      setIsPlaying(false);
      setPlayingMessageId(null);
      toast.error('Failed to play audio');
    }
  };

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="mb-3 md:mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            <span className="gradient-text">AI Assistant</span>
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">Ask me anything about government schemes</p>
        </div>
        <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
          <SelectTrigger className="w-full md:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.nativeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Alert>
        <AlertDescription className="flex flex-col gap-1 text-xs md:text-sm md:flex-row md:items-center md:justify-between">
          <span>
            Active Plan: {activePlan.name}
            {remainingChatRequests !== null ? ` | Remaining chat requests: ${remainingChatRequests}` : ' | High-volume access enabled'}
          </span>
          <span className="text-muted-foreground">Need more capacity? Upgrade your plan from the pricing section.</span>
        </AlertDescription>
      </Alert>

      <Card className="card-modern flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-3 md:space-y-4 overflow-y-auto p-3 md:p-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-center px-4">
              <div>
                <Bot className="mx-auto mb-4 h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
                <h3 className="mb-2 text-base md:text-lg font-semibold">Start a conversation</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Ask me about schemes, eligibility, or application process
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 py-2 md:px-4 md:py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'neumorphic-inset bg-card text-card-foreground'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 text-xs md:text-sm">
                    {message.role === 'assistant' ? (
                      <MarkdownRenderer content={message.content} />
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  {message.role === 'assistant' && (
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleTextToSpeech(message.content, message.id)}
                        title={playingMessageId === message.id && isPlaying ? "Pause" : "Play"}
                      >
                        {playingMessageId === message.id && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="neumorphic-inset rounded-2xl bg-card px-4 py-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-3 md:p-4">
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={handleVoiceInput}
              disabled={isRecording || isLoading}
              className={`shrink-0 min-h-[44px] min-w-[44px] ${isRecording ? 'animate-pulse bg-destructive' : ''}`}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 min-h-[44px]"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="gradient-neon text-white shrink-0 min-h-[44px] min-w-[44px]">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
