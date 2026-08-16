import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, AlertCircle, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/db/supabase';
import { agentApi } from '@/db/api';
import SubmissionReceipt from './SubmissionReceipt';

interface AgentStep {
  tool: string;
  parameters: any;
  description: string;
}

interface AgentPlan {
  steps: AgentStep[];
}

interface AIAgentModalProps {
  open: boolean;
  onClose: () => void;
  schemeId: string;
  schemeName: string;
  userId: string;
}

export default function AIAgentModal({ open, onClose, schemeId, schemeName, userId }: AIAgentModalProps) {
  const [status, setStatus] = useState<'idle' | 'planning' | 'running' | 'paused' | 'completed' | 'error'>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [plan, setPlan] = useState<AgentPlan | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);
  const [userInput, setUserInput] = useState('');
  const [requiresInput, setRequiresInput] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);

  const callAgentController = async (payload: Record<string, unknown>) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const { data: { session } } = await supabase.auth.getSession();
    const authToken = session?.access_token;

    if (!authToken) {
      throw new Error('Your session has expired. Please log in again.');
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/ai-agent-controller`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const rawError = await response.text();
      try {
        const parsed = JSON.parse(rawError);
        throw new Error(parsed.error || rawError || 'AI agent request failed');
      } catch {
        throw new Error(rawError || 'AI agent request failed');
      }
    }

    return response.json();
  };

  useEffect(() => {
    if (open && status === 'idle') {
      startAgent();
    }
  }, [open]);

  const startAgent = async () => {
    try {
      setStatus('planning');
      setError(null);

      const data = await callAgentController({
        action: 'start',
        schemeId,
      });
      console.log('AI Agent started:', data);
      setSessionId(data.sessionId);
      setPlan(data.plan);
      setStatus('running');

      // Start executing steps
      executeNextStep(data.sessionId);
    } catch (err: any) {
      console.error('AI Agent error:', err);
      setError(err.message);
      setStatus('error');
      toast.error('Failed to start AI agent: ' + err.message);
    }
  };

  const executeNextStep = async (sid: string) => {
    try {
      const data = await callAgentController({
        action: 'execute_step',
        sessionId: sid,
      });

      if (data.status === 'completed') {
        setStatus('completed');

        let nextApplicationNumber = data.result?.data?.applicationNumber || null;

        // Fetch final session data for receipt
        const sessionData = await agentApi.getSession(sid);
        if (sessionData) {
          setSubmissionData(sessionData.form_data || {});
          nextApplicationNumber =
            nextApplicationNumber ||
            sessionData.form_data?.applicationNumber ||
            sessionData.metadata?.submission?.applicationNumber ||
            null;
        }

        setApplicationNumber(nextApplicationNumber || `APP-${sid.slice(0, 8).toUpperCase()}`);
        
        toast.success('Application submitted successfully!');
        return;
      }

      if (data.status === 'paused') {
        setStatus('paused');
        setRequiresInput(true);
        setInputPrompt(data.prompt);
        return;
      }

      // Add log
      setLogs((prev) => [...prev, {
        step: data.step,
        result: data.result,
        timestamp: new Date(),
      }]);

      setCurrentStep(data.nextStep);

      // Continue to next step after a delay
      setTimeout(() => executeNextStep(sid), 1500);
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
      toast.error('Agent execution failed');
    }
  };

  const handleUserInputSubmit = async () => {
    if (!sessionId || !userInput.trim()) return;

    try {
      await callAgentController({
        action: 'resume',
        sessionId,
        userInput,
      });

      setRequiresInput(false);
      setUserInput('');
      setStatus('running');

      // Continue execution
      setTimeout(() => executeNextStep(sessionId), 500);
    } catch (err: any) {
      toast.error('Failed to resume agent');
    }
  };

  const handleCancel = async () => {
    if (!sessionId) {
      onClose();
      return;
    }

    try {
      await callAgentController({
        action: 'cancel',
        sessionId,
      });

      onClose();
    } catch (err) {
      onClose();
    }
  };

  const progress = plan ? (currentStep / plan.steps.length) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={status === 'completed' && applicationNumber ? 'max-w-[95vw] md:max-w-3xl max-h-[90vh] overflow-y-auto' : 'max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto'}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <DialogTitle className="text-base md:text-lg">AI Agent Assistant</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8 md:h-10 md:w-10">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {status !== 'completed' && (
            <DialogDescription className="text-xs md:text-sm">
              Applying for: <span className="font-semibold">{schemeName}</span>
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Show Receipt when completed */}
          {status === 'completed' && applicationNumber && submissionData && sessionId ? (
            <SubmissionReceipt
              applicationNumber={applicationNumber}
              schemeName={schemeName}
              submittedData={submissionData}
              submittedAt={new Date().toISOString()}
              sessionId={sessionId}
            />
          ) : (
            <>
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge variant={
                  status === 'completed' ? 'default' :
                  status === 'error' ? 'destructive' :
                  status === 'paused' ? 'secondary' : 'outline'
                }>
                  {status === 'planning' && 'Planning...'}
                  {status === 'running' && 'Running...'}
                  {status === 'paused' && 'Waiting for Input'}
                  {status === 'completed' && 'Completed'}
                  {status === 'error' && 'Error'}
                </Badge>
                {plan && (
                  <span className="text-sm text-muted-foreground">
                    Step {currentStep} of {plan.steps.length}
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {plan && status !== 'error' && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive bg-destructive/10 p-4">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <div className="flex-1">
                    <p className="font-semibold text-destructive">Error</p>
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                </div>
              )}

              {/* User Input Required */}
              {requiresInput && (
                <div className="space-y-4 rounded-lg border border-primary bg-primary/10 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">User Input Required</p>
                      <p className="text-sm text-muted-foreground">{inputPrompt}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-input">Your Response</Label>
                    <div className="flex gap-2">
                      <Input
                        id="user-input"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter your response..."
                        onKeyDown={(e) => e.key === 'Enter' && handleUserInputSubmit()}
                      />
                      <Button onClick={handleUserInputSubmit} disabled={!userInput.trim()}>
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Log */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Activity Log</h4>
                <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border bg-muted/50 p-4">
                  {logs.length === 0 && status === 'planning' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Analyzing application requirements...</span>
                    </div>
                  )}
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      {log.result.success ? (
                        <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{log.step.description}</p>
                        <p className="text-xs text-muted-foreground">{log.result.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  {status === 'running' && logs.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing next step...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {status === 'completed' && (
                  <Button onClick={onClose} className="flex-1">
                    Done
                  </Button>
                )}
                {(status === 'running' || status === 'paused') && (
                  <Button onClick={handleCancel} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                )}
                {status === 'error' && (
                  <>
                    <Button onClick={startAgent} variant="outline" className="flex-1">
                      Retry
                    </Button>
                    <Button onClick={onClose} className="flex-1">
                      Close
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
