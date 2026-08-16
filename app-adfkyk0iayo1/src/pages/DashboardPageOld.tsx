import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { schemesApi, calculateEligibility } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, TrendingUp, FileText, Bell, Bot } from 'lucide-react';
import type { SchemeWithEligibility } from '@/types';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [schemes, setSchemes] = useState<SchemeWithEligibility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSchemes();
  }, [profile]);

  const loadSchemes = async () => {
    if (!profile) return;

    try {
      const allSchemes = await schemesApi.getAllSchemes(20);
      const withEligibility = allSchemes.map((scheme) => calculateEligibility(profile, scheme));
      
      // Prioritize schemes: state-specific first, then national schemes
      const sorted = withEligibility.sort((a, b) => {
        // First sort by state match
        const aStateMatch = a.state === profile.state || a.state === null;
        const bStateMatch = b.state === profile.state || b.state === null;
        
        if (aStateMatch && !bStateMatch) return -1;
        if (!aStateMatch && bStateMatch) return 1;
        
        // Then by eligibility score
        return b.eligibility_score - a.eligibility_score;
      });
      
      setSchemes(sorted);
    } catch (error) {
      console.error('Failed to load schemes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const topSchemes = schemes.slice(0, 6);
  const highEligibility = schemes.filter((s) => s.eligibility_score >= 80);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="neumorphic glass rounded-2xl p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">
              Welcome back, <span className="gradient-text">{profile?.name || 'User'}</span>!
            </h1>
            <p className="text-muted-foreground">
              You have {highEligibility.length} schemes with high eligibility
            </p>
          </div>
          <Button asChild className="gradient-neon text-white">
            <Link to="/chat">
              <Bot className="mr-2 h-4 w-4" />
              Ask AI
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Sparkles className="h-5 w-5 text-primary" />}
          title="Eligible Schemes"
          value={highEligibility.length}
          description="High match score"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-secondary" />}
          title="Applications"
          value={0}
          description="In progress"
        />
        <StatCard
          icon={<FileText className="h-5 w-5 text-accent" />}
          title="Documents"
          value={profile?.aadhaar_verified ? 1 : 0}
          description="Verified"
        />
        <StatCard
          icon={<Bell className="h-5 w-5 text-primary" />}
          title="Notifications"
          value={0}
          description="Unread"
        />
      </div>

      {/* Recommended Schemes */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Recommended for You</h2>
            <p className="text-muted-foreground">Based on your profile and eligibility</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/schemes">View All</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="neumorphic">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, description }: { icon: React.ReactNode; title: string; value: number; description: string }) {
  return (
    <Card className="neumorphic glass">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SchemeCard({ scheme }: { scheme: SchemeWithEligibility }) {
  return (
    <Card className="neumorphic glass group transition-all hover:scale-105">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant={scheme.eligibility_score >= 80 ? 'default' : 'secondary'}>
              {scheme.eligibility_score}% Match
            </Badge>
            <Badge variant="outline">{scheme.category}</Badge>
            {scheme.state && (
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                📍 {scheme.state}
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="line-clamp-2">{scheme.name}</CardTitle>
        <CardDescription className="line-clamp-2">{scheme.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Eligibility Score</span>
            <span className="font-semibold">{scheme.eligibility_score}%</span>
          </div>
          <Progress value={scheme.eligibility_score} className="h-2" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Benefits:</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">{scheme.benefits}</p>
        </div>

        <Button asChild className="w-full gradient-neon-cyan text-white">
          <Link to={`/schemes/${scheme.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
