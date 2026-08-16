import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { usePlan } from '@/contexts/PlanContext';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Database, Users, FileText, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function LandingPage() {
  const { plans, activePlan, simulatePlanPurchase } = usePlan();

  const stats = [
    { label: 'Government Schemes', value: '1000+', sublabel: 'Central & State Programs' },
    { label: 'Citizens Helped', value: '50K+', sublabel: 'Successful Applications' },
    { label: 'Success Rate', value: '95%', sublabel: 'Application Approval' },
  ];

  const features = [
    {
      icon: Database,
      title: 'Comprehensive Scheme Database',
      description: 'Access 1000+ government schemes across all states and categories. Our AI-powered system matches you with the most relevant programs based on your profile.',
    },
    {
      icon: Users,
      title: 'Personalized Eligibility Matching',
      description: 'Get instant eligibility scores for each scheme. Our intelligent algorithm analyzes your profile against scheme criteria to show you exactly where you qualify.',
    },
    {
      icon: FileText,
      title: 'AI Agent Auto-Apply System',
      description: 'Revolutionary AI agent that automatically fills forms, uploads documents, and submits applications on your behalf with your confirmation.',
    },
  ];

  const handlePlanClick = (planId: 'free' | 'monthly' | 'half_yearly' | 'yearly') => {
    simulatePlanPurchase(planId);
    if (planId === 'free') {
      toast.success('Free plan activated. Sign in to continue.');
      return;
    }

    toast.success('Plan purchased successfully. Premium access activated.');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">Citizen Seva</span>
            </div>
            <div className="hidden items-center gap-8 md:flex">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                How It Works
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Pricing
              </a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                About
              </a>
              <Link to="/admin-login">
                <Button asChild variant="outline" size="sm" className="text-sm font-medium">
                  <span>Admin</span>
                </Button>
              </Link>
              <Link to="/login">
                <Button asChild variant="default" size="sm" className="text-sm font-medium">
                  <span>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Hero Text */}
            <div className="flex flex-col justify-center space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display leading-tight">
                  Your AI Assistant for
                  <br />
                  <span className="font-normal">Government Benefits.</span>
                </h1>
                
                <div className="space-y-4 md:space-y-6 text-sm md:text-base text-muted-foreground">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-base md:text-lg font-semibold text-primary">1000+</span>
                    </div>
                    <p className="pt-2">
                      Access comprehensive database of government schemes from central and state governments. Our AI matches you with programs you're eligible for based on your profile.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-lg bg-chart-2/10">
                      <span className="text-base md:text-lg font-semibold text-chart-2">AI</span>
                    </div>
                    <p className="pt-2">
                      Revolutionary AI Agent automatically fills application forms, uploads documents, and submits on your behalf. Just confirm and let AI handle the rest.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-lg bg-chart-3/10">
                      <span className="text-base md:text-lg font-semibold text-chart-3">24/7</span>
                    </div>
                    <p className="pt-2">
                      Voice-enabled multilingual support in English, Hindi, and Bengali. Get instant answers to your questions about schemes and eligibility.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Visualization Bars */}
              <div className="space-y-2 md:space-y-3">
                <div className="h-1 md:h-1.5 w-3/4 rounded-full bg-chart-4"></div>
                <div className="h-1 md:h-1.5 w-full rounded-full bg-primary"></div>
                <div className="h-1 md:h-1.5 w-1/2 rounded-full bg-muted"></div>
                <div className="h-1 md:h-1.5 w-5/6 rounded-full bg-muted"></div>
                <div className="h-1 md:h-1.5 w-2/3 rounded-full bg-chart-3"></div>
                <div className="h-1 md:h-1.5 w-4/5 rounded-full bg-muted"></div>
                <div className="h-1 md:h-1.5 w-3/5 rounded-full bg-chart-2"></div>
              </div>
            </div>

            {/* Right Column - Stats Cards */}
            <div className="flex flex-col justify-center space-y-4 md:space-y-6">
              {stats.map((stat, index) => (
                <div key={index} className="card-modern p-4 md:p-6">
                  <div className="mb-2 text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">{stat.value}</div>
                  <div className="mb-1 text-xs md:text-sm font-semibold">{stat.label}</div>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.sublabel}</p>
                  <Link to="/schemes" className="link-arrow mt-3 md:mt-4">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border bg-muted/30 py-12 md:py-16" id="features">
        <div className="container-custom">
          <div className="grid gap-8 md:gap-12 md:grid-cols-3">
            <div>
              <div className="mb-2 text-xs md:text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Smart Matching
              </div>
              <div className="text-2xl md:text-stat-sm mb-2">AI-Powered</div>
              <div className="text-sm font-medium">Eligibility Detection</div>
              <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                Our intelligent algorithm analyzes your profile against scheme criteria to calculate precise eligibility scores and recommend the best matches.
              </p>
            </div>

            <div>
              <div className="mb-2 text-xs md:text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Auto-Apply
              </div>
              <div className="text-2xl md:text-stat-sm mb-2">AI Agent</div>
              <div className="text-sm font-medium">Automated Applications</div>
              <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                Revolutionary AI agent that fills forms, uploads documents, and submits applications automatically. You just confirm and track progress.
              </p>
            </div>

            <div>
              <div className="mb-2 text-xs md:text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Voice Support
              </div>
              <div className="text-2xl md:text-stat-sm mb-2">Multilingual</div>
              <div className="text-sm font-medium">3 Languages</div>
              <p className="mt-2 text-xs md:text-sm text-muted-foreground">
                Interact with our AI assistant using voice commands in English, Hindi, or Bengali. Get instant answers and guidance in your preferred language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding" id="how-it-works">
        <div className="container-custom">
          <div className="mb-12 md:mb-16 text-center px-4">
            <h2 className="text-2xl md:text-3xl lg:text-display-sm mb-3 md:mb-4">How Citizen Seva Works</h2>
            <p className="mx-auto max-w-2xl text-sm md:text-base lg:text-lg text-muted-foreground">
              Our AI-powered platform simplifies access to government schemes through intelligent matching, conversational assistance, and automated application processing.
            </p>
          </div>

          <div className="grid gap-6 md:gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="card-modern p-4 md:p-6">
                <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <h3 className="mb-2 md:mb-3 text-base md:text-lg lg:text-xl font-semibold">{feature.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="border-t border-border bg-muted/20 py-16 md:py-20" id="pricing">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-display-sm mb-3">Simple Plans for Every Team</h2>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-muted-foreground">
              Start with a free plan and upgrade as your usage grows.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => {
              const isActive = activePlan.id === plan.id;
              const isPaid = plan.id !== 'free';

              return (
                <div
                  key={plan.id}
                  className={`card-modern p-5 md:p-6 flex flex-col gap-4 ${plan.isPopular ? 'border-primary shadow-lg' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <div className="flex items-center gap-2">
                      {plan.isPopular && <Badge>Best Value</Badge>}
                      {isActive && <Badge variant="secondary">Active</Badge>}
                    </div>
                  </div>

                  <div>
                    <p className="text-2xl md:text-3xl font-semibold">{plan.priceLabel}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {plan.id === 'yearly' ? 'Maximum yearly price capped at Rs 399' : 'Instant activation available'}
                    </p>
                  </div>

                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      {plan.chatLimit === null
                        ? 'High chatbot capacity'
                        : `${plan.chatLimit} chatbot requests`}
                    </li>
                    <li>
                      {plan.schemeVisibilityLimit === null
                        ? 'Full scheme visibility'
                        : `${plan.schemeVisibilityLimit} scheme previews`}
                    </li>
                    <li>{isPaid ? 'Best for growing usage' : 'Good for first-time users'}</li>
                  </ul>

                  <Button
                    type="button"
                    onClick={() => handlePlanClick(plan.id)}
                    variant={plan.id === 'free' ? 'outline' : 'default'}
                  >
                    {plan.id === 'free' ? 'Start Free' : 'Buy Plan'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-foreground py-16 md:py-24 text-background" id="about">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center px-4">
            <h2 className="text-2xl md:text-3xl lg:text-display-sm mb-4 md:mb-6">
              Ready to Access Government Benefits? Start Your Journey Today.
            </h2>
            <p className="mb-6 md:mb-8 text-sm md:text-base lg:text-lg text-background/80">
              Join thousands of citizens who have successfully accessed government schemes with AI assistance. Create your profile and discover benefits you're eligible for.
            </p>
            <div className="flex flex-col items-center gap-3 md:gap-4 sm:flex-row sm:justify-center">
              <Link to="/login">
                <Button asChild size="lg" variant="secondary" className="min-w-[180px] md:min-w-[200px] min-h-[48px]">
                  <span>
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </Link>
              <Link to="/schemes">
                <Button asChild size="lg" variant="outline" className="min-w-[180px] md:min-w-[200px] min-h-[48px] border-background/20 bg-transparent text-background hover:bg-background/10">
                  <span>Browse Schemes</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8 md:py-12">
        <div className="container-custom">
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-3 md:mb-4 text-base md:text-lg font-semibold">Citizen Seva</div>
              <p className="text-xs md:text-sm text-muted-foreground">
                AI-powered public service copilot helping Indian citizens discover and apply for government schemes through intelligent matching and automated assistance.
              </p>
            </div>
            <div>
              <div className="mb-3 md:mb-4 text-xs md:text-sm font-semibold uppercase tracking-wider">Quick Links</div>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Home</Link></li>
                <li><Link to="/schemes" className="hover:text-foreground">Browse Schemes</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                <li><Link to="/chat" className="hover:text-foreground">AI Assistant</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Login</Link></li>
              </ul>
            </div>
            <div>
              <div className="mb-3 md:mb-4 text-xs md:text-sm font-semibold uppercase tracking-wider">Features</div>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Smart Matching</a></li>
                <li><a href="#features" className="hover:text-foreground">AI Agent Auto-Apply</a></li>
                <li><a href="#features" className="hover:text-foreground">Voice Assistant</a></li>
                <li><a href="#features" className="hover:text-foreground">Document Verification</a></li>
                <li><a href="#features" className="hover:text-foreground">Multilingual Support</a></li>
              </ul>
            </div>
            <div>
              <div className="mb-3 md:mb-4 text-xs md:text-sm font-semibold uppercase tracking-wider">Contact</div>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li><a href="mailto:support@citizenseva.in" className="hover:text-foreground">support@citizenseva.in</a></li>
                <li><a href="mailto:help@citizenseva.in" className="hover:text-foreground">help@citizenseva.in</a></li>
                <li className="pt-2">
                  <div className="text-xs">
                    © 2026 Citizen Seva. All rights reserved.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
