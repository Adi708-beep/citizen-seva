import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot, Zap, Shield, MessageSquare, FileCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-pulse-glow">
              <Sparkles className="h-4 w-4" />
              AI-Powered Government Services
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Your AI Assistant for{' '}
              <span className="gradient-text">Government Benefits</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Discover schemes you're eligible for, get instant AI assistance, and apply with automated form filling.
              All in one intelligent platform.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gradient-neon text-white hover:opacity-90">
                <Link to="/login">
                  <Zap className="mr-2 h-5 w-5" />
                  Check Eligibility Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="neumorphic">
                <Link to="/chat">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Try AI Assistant
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Powerful Features for <span className="gradient-text-cyan">Every Citizen</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Leveraging cutting-edge AI to make government services accessible to everyone
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Bot className="h-8 w-8 text-primary" />}
              title="AI Scheme Matching"
              description="Our intelligent system analyzes your profile and matches you with schemes you're eligible for, with detailed eligibility scores."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-secondary" />}
              title="Auto-Apply Agent"
              description="Let our AI agent automatically fill application forms for you. Just review and submit with one click."
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-accent" />}
              title="Voice Assistant"
              description="Talk to our AI in English, Hindi, or Bengali. Get instant answers about schemes, eligibility, and documents."
            />
            <FeatureCard
              icon={<FileCheck className="h-8 w-8 text-primary" />}
              title="Document Intelligence"
              description="Upload your Aadhaar for instant profile creation. AI verifies your documents and suggests missing ones."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-secondary" />}
              title="Secure & Private"
              description="Your data is encrypted and secure. We follow government security standards to protect your information."
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-accent" />}
              title="Real-time Alerts"
              description="Get notified about new schemes, application deadlines, and status updates instantly."
            />
          </div>
        </div>
      </section>

      {/* Demo Chat Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                See It In <span className="gradient-text">Action</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Experience the power of AI-assisted government services
              </p>
            </div>

            <div className="glass neumorphic rounded-2xl p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Citizen Seva AI</h3>
                  <p className="text-sm text-muted-foreground">Your Government Services Assistant</p>
                </div>
              </div>

              <div className="space-y-4">
                <ChatBubble
                  role="user"
                  message="I'm a 25-year-old woman from Maharashtra. What schemes am I eligible for?"
                />
                <ChatBubble
                  role="assistant"
                  message="Based on your profile, you're eligible for several schemes! Here are the top matches:

1. **Beti Bachao Beti Padhao** (95% match) - Women empowerment scheme with education support
2. **Pradhan Mantri Awas Yojana** (85% match) - Housing assistance for first-time home buyers
3. **Stand Up India Scheme** (80% match) - Loans for women entrepreneurs

Would you like me to help you apply for any of these?"
                />
                <ChatBubble
                  role="user"
                  message="Yes, help me apply for the housing scheme"
                />
                <ChatBubble
                  role="assistant"
                  message="Great choice! I'll help you with Pradhan Mantri Awas Yojana. 

Required documents:
✓ Aadhaar Card (Already uploaded)
✓ Income Certificate (Need to upload)
✓ Property Documents (Need to upload)
✓ Bank Account Details (Need to add)

I can auto-fill the application form with your profile data. Shall we proceed?"
                />
              </div>

              <div className="mt-6 text-center">
                <Button asChild className="gradient-neon-cyan text-white">
                  <Link to="/login">
                    Start Your Journey
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to Access Your <span className="gradient-text-cyan">Benefits?</span>
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of citizens who are already using AI to discover and apply for government schemes
            </p>
            <Button asChild size="lg" className="gradient-neon-purple text-white hover:opacity-90">
              <Link to="/login">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Citizen Seva. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="neumorphic glass group rounded-xl p-6 transition-all hover:scale-105">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function ChatBubble({ role, message }: { role: 'user' | 'assistant'; message: string }) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'neumorphic-inset bg-card text-card-foreground'
        }`}
      >
        <p className="whitespace-pre-line text-sm">{message}</p>
      </div>
    </div>
  );
}
