import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlan } from '@/contexts/PlanContext';
import { schemesApi, calculateEligibility } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, ListTodo, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SchemeWithEligibility } from '@/types';
import { SCHEME_CATEGORIES } from '@/types';

export default function SchemesPage() {
  const { profile } = useAuth();
  const { activePlan, isSchemeLockedByIndex } = usePlan();
  const [schemes, setSchemes] = useState<SchemeWithEligibility[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<SchemeWithEligibility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);

  useEffect(() => {
    loadSchemes();
  }, [profile]);

  useEffect(() => {
    filterSchemes();
  }, [schemes, searchQuery, categoryFilter]);

  const loadSchemes = async () => {
    if (!profile) return;

    try {
      const allSchemes = await schemesApi.getAllSchemes(100);
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

  const filterSchemes = () => {
    let filtered = schemes;

    if (searchQuery) {
      filtered = filtered.filter(
        (scheme) =>
          scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((scheme) => scheme.category === categoryFilter);
    }

    setFilteredSchemes(filtered);
  };

  const toggleComparison = (schemeId: string) => {
    setComparisonIds((current) => {
      if (current.includes(schemeId)) {
        return current.filter((id) => id !== schemeId);
      }

      if (current.length >= 3) {
        return [...current.slice(1), schemeId];
      }

      return [...current, schemeId];
    });
  };

  const comparedSchemes = comparisonIds
    .map((id) => schemes.find((scheme) => scheme.id === id))
    .filter(Boolean) as SchemeWithEligibility[];

  const visibleCount = filteredSchemes.filter((_, index) => !isSchemeLockedByIndex(index)).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-2xl md:text-3xl font-bold">
          Government <span className="gradient-text">Schemes</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">Discover schemes you're eligible for</p>
      </div>

      {/* Filters */}
      <Card className="card-modern">
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col gap-3 md:gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {SCHEME_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-modern border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm font-medium">Current Plan: {activePlan.name}</p>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            {activePlan.schemeVisibilityLimit === null
              ? 'You can view all schemes and details.'
              : `You can view details for ${activePlan.schemeVisibilityLimit} schemes on Free plan. Locked items are shown for upgrade visibility.`}
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <p className="mb-4 text-xs md:text-sm text-muted-foreground">
          Showing {visibleCount} accessible scheme{visibleCount !== 1 ? 's' : ''}
          {activePlan.schemeVisibilityLimit !== null ? ` out of ${filteredSchemes.length}` : ''}
        </p>

        {isLoading ? (
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        ) : filteredSchemes.length === 0 ? (
          <Card className="card-modern">
            <CardContent className="flex min-h-[200px] items-center justify-center p-6 md:p-8 text-center">
              <div>
                <p className="mb-2 text-base md:text-lg font-semibold">No schemes found</p>
                <p className="text-xs md:text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchemes.map((scheme, index) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                isLocked={isSchemeLockedByIndex(index)}
                isCompared={comparisonIds.includes(scheme.id)}
                onToggleCompare={toggleComparison}
              />
            ))}
          </div>
        )}
      </div>

      {comparedSchemes.length > 0 && (
        <Card className="card-modern overflow-x-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListTodo className="h-5 w-5 text-primary" />
              Scheme Compare Mode
            </CardTitle>
            <CardDescription>Compare up to 3 selected schemes side by side.</CardDescription>
          </CardHeader>
          <CardContent className="min-w-[760px] p-0">
            <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] border-b border-border bg-muted/40 text-sm font-medium">
              <div className="p-4">Attribute</div>
              {comparedSchemes.map((scheme) => (
                <div key={scheme.id} className="p-4">
                  {scheme.name}
                </div>
              ))}
              {Array.from({ length: Math.max(0, 3 - comparedSchemes.length) }).map((_, index) => (
                <div key={`empty-col-${index}`} className="p-4 text-muted-foreground">Select a scheme</div>
              ))}
            </div>

            {[
              ['Eligibility', ...comparedSchemes.map((scheme) => `${scheme.eligibility_score}%`)],
              ['Category', ...comparedSchemes.map((scheme) => scheme.category)],
              ['State', ...comparedSchemes.map((scheme) => scheme.state ?? 'National')],
              ['Deadline', ...comparedSchemes.map((scheme) => (scheme.deadline ? new Date(scheme.deadline).toLocaleDateString('en-IN') : 'Not specified'))],
              ['Required docs', ...comparedSchemes.map((scheme) => `${scheme.required_documents.length}`)],
            ].map((row) => (
              <div key={row[0]} className="grid grid-cols-[1.4fr_repeat(3,1fr)] border-b border-border text-sm last:border-b-0">
                <div className="p-4 font-medium">{row[0]}</div>
                {row.slice(1).map((value, index) => (
                  <div key={`${row[0]}-${index}`} className="p-4 text-muted-foreground">
                    {value}
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 3 - comparedSchemes.length) }).map((_, index) => (
                  <div key={`${row[0]}-empty-${index}`} className="p-4 text-muted-foreground">-</div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SchemeCard({
  scheme,
  isLocked,
  isCompared,
  onToggleCompare,
}: {
  scheme: SchemeWithEligibility;
  isLocked: boolean;
  isCompared: boolean;
  onToggleCompare: (schemeId: string) => void;
}) {
  return (
    <Card className={`card-modern group transition-all hover:scale-105 ${isLocked ? 'opacity-80' : ''}`}>
      <CardHeader>
        <div className="mb-2 flex flex-wrap items-start gap-2">
          <Badge variant={scheme.eligibility_score >= 80 ? 'default' : 'secondary'} className="shrink-0">
            {scheme.eligibility_score}% Match
          </Badge>
          <Badge variant="outline">
            {scheme.category}
          </Badge>
          {scheme.state && (
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
              📍 {scheme.state}
            </Badge>
          )}
          {isLocked && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Locked in Free Plan
            </Badge>
          )}
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

        {scheme.matched_criteria.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">✓ Matched:</p>
            <ul className="space-y-1">
              {scheme.matched_criteria.slice(0, 2).map((criteria, i) => (
                <li key={i} className="text-xs text-muted-foreground">
                  • {criteria}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link to={isLocked ? '/#pricing' : `/schemes/${scheme.id}`}>
              {isLocked ? 'Upgrade to Unlock' : 'View Details'}
            </Link>
          </Button>
          <Button
            variant={isCompared ? 'default' : 'secondary'}
            className="w-full"
            onClick={() => onToggleCompare(scheme.id)}
            disabled={isLocked}
          >
            {isCompared ? 'Selected for Compare' : 'Add to Compare'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
