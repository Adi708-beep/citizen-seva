import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePlan } from '@/contexts/PlanContext';
import { aiApi, schemesApi, calculateEligibility } from '@/db/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Sparkles, Bot, Zap } from 'lucide-react';
import type { SchemeWithEligibility } from '@/types';

export default function DashboardPage() {
  const { profile } = useAuth();
  const { activePlan, remainingChatRequests } = usePlan();
  const [schemes, setSchemes] = useState<SchemeWithEligibility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSchemes();
  }, [profile]);

  const loadSchemes = async () => {
    if (!profile) return;

    try {
      const suggestionQuery = [profile.profession, profile.state, profile.category, 'recommended schemes']
        .filter(Boolean)
        .join(' ');

      const suggestedSchemes = await aiApi.getSchemeSuggestions({
        query: suggestionQuery,
        profile,
        limit: 6,
      });

      if (suggestedSchemes.length > 0) {
        setSchemes(suggestedSchemes);
        return;
      }

      const allSchemes = await schemesApi.getAllSchemes(50);
      setSchemes(allSchemes.map((scheme) => calculateEligibility(profile, scheme)).sort((a, b) => b.eligibility_score - a.eligibility_score));
    } catch (error) {
      console.error('Failed to load schemes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const topSchemes = schemes.slice(0, 6);
  const highEligibility = schemes.filter((s) => s.eligibility_score >= 80);
  const totalSchemes = schemes.length;
  const avgEligibility = schemes.length > 0 
    ? Math.round(schemes.reduce((sum, s) => sum + s.eligibility_score, 0) / schemes.length) 
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-32 w-full bg-muted" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-48 bg-muted" />
          <Skeleton className="h-48 bg-muted" />
          <Skeleton className="h-48 bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hero Section */}
      <div className="space-y-3 md:space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight md:text-display-sm">
          Welcome, <span className="font-normal">{profile?.name || 'User'}</span>.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          You have {highEligibility.length} schemes with high eligibility scores. Explore personalized recommendations below.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        {/* AI Agent Feature Card */}
        <Card className="card-modern border-primary/50 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <Badge variant="default" className="text-xs">NEW</Badge>
            </div>
            <CardTitle className="text-base font-semibold">AI Agent Assistant</CardTitle>
            <p className="text-sm text-muted-foreground">
              Let AI automatically fill and submit applications for you
            </p>
          </CardHeader>
          <CardContent>
            <Link to="/schemes" className="link-arrow">
              Try AI Agent
              <Zap className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader>
            <div className="text-4xl md:text-6xl font-light tracking-tight">{totalSchemes}</div>
            <CardTitle className="text-base font-semibold">Available Schemes</CardTitle>
            <p className="text-sm text-muted-foreground">Total programs you can explore</p>
          </CardHeader>
          <CardContent>
            <Link to="/schemes" className="link-arrow">
              View All Schemes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader>
            <div className="text-4xl md:text-6xl font-light tracking-tight">{highEligibility.length}</div>
            <CardTitle className="text-base font-semibold">High Match Schemes</CardTitle>
            <p className="text-sm text-muted-foreground">Programs with 80%+ eligibility</p>
          </CardHeader>
          <CardContent>
            <Link to="/schemes" className="link-arrow">
              Explore Matches
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="card-modern border-primary/40 bg-primary/5">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-sm md:text-base font-semibold">Your Plan: {activePlan.name}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {remainingChatRequests === null
                  ? 'High-volume chatbot access is enabled for your plan.'
                  : `${remainingChatRequests} chatbot requests remaining in your current cycle.`}
              </p>
            </div>
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link to="/#pricing">Manage Plan</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Agent Info Banner */}
      <Card className="card-modern border-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="flex flex-col gap-4 p-4 md:p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="rounded-full bg-primary/10 p-2 md:p-3">
              <Bot className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm md:text-base font-semibold">Introducing AI Agent Auto-Apply</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Our intelligent AI agent can automatically fill forms, upload documents, and submit applications on your behalf. 
                Just click "Apply with AI Agent" on any scheme detail page!
              </p>
            </div>
          </div>
          <Button asChild variant="default" className="shrink-0 w-full md:w-auto">
            <Link to="/schemes">
              <Sparkles className="mr-2 h-4 w-4" />
              Get Started
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Feature Lab Banner */}
      <Card className="card-modern border-border bg-gradient-to-r from-chart-2/10 via-background to-primary/5">
        <CardContent className="flex flex-col gap-4 p-4 md:p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="rounded-full bg-chart-2/10 p-2 md:p-3">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-chart-2" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm md:text-base font-semibold">Hackathon Feature Lab</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Explore eligibility intelligence, scheme comparison, document vault, reminders, family mode, and impact analytics in one polished place.
              </p>
            </div>
          </div>
          <Button asChild variant="default" className="shrink-0 w-full md:w-auto">
            <Link to="/feature-lab">
              Open Feature Lab
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recommended Schemes */}
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Recommended for You</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Top schemes based on your profile and location
            </p>
          </div>
          <Button asChild variant="outline" className="w-full md:w-auto">
            <Link to="/schemes">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SchemeCard({ scheme }: { scheme: SchemeWithEligibility }) {
  return (
    <Card className="card-modern group">
      <CardHeader>
        <div className="mb-3 flex flex-wrap items-start gap-2">
          <Badge 
            variant={scheme.eligibility_score >= 80 ? 'default' : 'secondary'}
            className="text-xs"
          >
            {scheme.eligibility_score}% Match
          </Badge>
          <Badge variant="outline" className="text-xs">
            {scheme.category}
          </Badge>
          {scheme.state && (
            <Badge variant="secondary" className="bg-accent/20 text-xs">
              📍 {scheme.state}
            </Badge>
          )}
        </div>
        <CardTitle className="line-clamp-2 text-lg">{scheme.name}</CardTitle>
        <p className="line-clamp-2 text-sm text-muted-foreground">{scheme.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Eligibility Score</span>
            <span className="font-semibold">{scheme.eligibility_score}%</span>
          </div>
          <Progress value={scheme.eligibility_score} className="h-2" />
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link to={`/schemes/${scheme.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
