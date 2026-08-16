import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { schemesApi, calculateEligibility, documentsApi } from '@/db/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import AIAgentModal from '@/components/common/AIAgentModal';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Building2, 
  MapPin, 
  Users, 
  Coins,
  GraduationCap,
  FileText,
  ExternalLink,
  Sparkles,
  Bot
} from 'lucide-react';
import type { Document, SchemeWithEligibility } from '@/types';

export default function SchemeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState<SchemeWithEligibility | null>(null);
  const [userDocuments, setUserDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAgentModal, setShowAgentModal] = useState(false);

  useEffect(() => {
    loadScheme();
  }, [id, profile]);

  const loadScheme = async () => {
    if (!id || !profile) return;

    try {
      const schemeData = await schemesApi.getSchemeById(id);
      if (!schemeData) {
        navigate('/schemes');
        return;
      }

      const docs = user ? await documentsApi.getUserDocuments(user.id) : [];

      const withEligibility = calculateEligibility(profile, schemeData);
      setScheme(withEligibility);
      setUserDocuments(docs);
    } catch (error) {
      console.error('Failed to load scheme:', error);
      navigate('/schemes');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 bg-muted" />
        <Card className="neumorphic">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 bg-muted" />
            <Skeleton className="h-4 w-1/2 bg-muted" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full bg-muted" />
            <Skeleton className="h-32 w-full bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>Scheme not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const normalizedDocs = userDocuments.map((doc) => doc.document_type.toLowerCase().trim());

  const requiredDocStatus = scheme.required_documents.map((required) => {
    const exactMatch = userDocuments.find(
      (doc) => doc.document_type.toLowerCase().trim() === required.toLowerCase().trim(),
    );

    const fuzzyMatch = exactMatch
      ? exactMatch
      : userDocuments.find((doc) => {
          const current = doc.document_type.toLowerCase().trim();
          const target = required.toLowerCase().trim();
          return current.includes(target) || target.includes(current);
        });

    return {
      name: required,
      status: fuzzyMatch ? fuzzyMatch.status : 'missing',
    };
  });

  const readyDocuments = requiredDocStatus.filter((entry) => entry.status === 'verified').length;
  const readinessPercent = scheme.required_documents.length > 0
    ? Math.round((readyDocuments / scheme.required_documents.length) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Header Card */}
      <Card className="card-modern">
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-start md:justify-between">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant={scheme.eligibility_score >= 80 ? 'default' : 'secondary'} className="text-sm md:text-base">
                  {scheme.eligibility_score}% Match
                </Badge>
                <Badge variant="outline" className="text-sm md:text-base">
                  {scheme.category}
                </Badge>
                {scheme.state && (
                  <Badge variant="secondary" className="bg-accent/20 text-accent-foreground text-sm md:text-base">
                    📍 {scheme.state}
                  </Badge>
                )}
              </div>
              <CardTitle className="mb-2 text-xl md:text-3xl">{scheme.name}</CardTitle>
              <CardDescription className="text-sm md:text-base">{scheme.description}</CardDescription>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs md:text-sm">
              <span className="font-medium text-muted-foreground">Your Eligibility Score</span>
              <span className="text-base md:text-lg font-bold">{scheme.eligibility_score}%</span>
            </div>
            <Progress value={scheme.eligibility_score} className="h-2 md:h-3" />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-4 md:space-y-6 lg:col-span-2">
          {/* Benefits */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-muted-foreground">{scheme.benefits}</p>
            </CardContent>
          </Card>

          {/* Eligibility Criteria */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Eligibility Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheme.matched_criteria.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✓ You Match:</h4>
                  <ul className="space-y-2">
                    {scheme.matched_criteria.map((criteria, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                        <span className="text-sm">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {scheme.missing_criteria.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-600 dark:text-orange-400">⚠ Missing Requirements:</h4>
                  <ul className="space-y-2">
                    {scheme.missing_criteria.map((criteria, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {typeof scheme.eligibility_criteria === 'object' && scheme.eligibility_criteria.criteria && (
                <div className="space-y-2">
                  <h4 className="font-semibold">General Criteria:</h4>
                  <ul className="space-y-2">
                    {(scheme.eligibility_criteria.criteria as string[]).map((criteria, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-sm text-muted-foreground">• {criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {requiredDocStatus.map((doc, i) => (
                  <li key={i} className="flex items-start justify-between gap-2 rounded-md border border-border bg-muted/20 px-3 py-2">
                    <div className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <Badge
                      variant={
                        doc.status === 'verified'
                          ? 'default'
                          : doc.status === 'pending'
                          ? 'secondary'
                          : doc.status === 'rejected'
                          ? 'destructive'
                          : 'outline'
                      }
                      className="text-[10px]"
                    >
                      {doc.status === 'missing' ? 'missing' : doc.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Document Readiness */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Document Readiness Checker
              </CardTitle>
              <CardDescription>
                Reuses your uploaded documents and shows what is ready before you apply.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Readiness</span>
                  <span className="font-semibold">{readinessPercent}%</span>
                </div>
                <Progress value={readinessPercent} className="h-2" />
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="rounded-md border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Required</p>
                  <p className="text-xl font-semibold">{scheme.required_documents.length}</p>
                </div>
                <div className="rounded-md border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Verified</p>
                  <p className="text-xl font-semibold">{readyDocuments}</p>
                </div>
                <div className="rounded-md border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">Missing/Pending</p>
                  <p className="text-xl font-semibold">{scheme.required_documents.length - readyDocuments}</p>
                </div>
              </div>
              {normalizedDocs.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No documents found in your vault yet. Upload documents from profile to improve auto-apply success.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg">Quick Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheme.department && (
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Department</p>
                    <p className="text-sm text-muted-foreground">{scheme.department}</p>
                  </div>
                </div>
              )}

              {scheme.state && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">State</p>
                    <p className="text-sm text-muted-foreground">{scheme.state}</p>
                  </div>
                </div>
              )}

              {(scheme.age_min !== null || scheme.age_max !== null) && (
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Age Requirement</p>
                    <p className="text-sm text-muted-foreground">
                      {scheme.age_min !== null && scheme.age_max !== null
                        ? `${scheme.age_min} - ${scheme.age_max} years`
                        : scheme.age_min !== null
                        ? `${scheme.age_min}+ years`
                        : `Up to ${scheme.age_max} years`}
                    </p>
                  </div>
                </div>
              )}

              {scheme.income_max !== null && (
                <div className="flex items-start gap-3">
                  <Coins className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Income Limit</p>
                    <p className="text-sm text-muted-foreground">₹{scheme.income_max.toLocaleString()}/year</p>
                  </div>
                </div>
              )}

              {scheme.education_required && (
                <div className="flex items-start gap-3">
                  <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Education</p>
                    <p className="text-sm text-muted-foreground">{scheme.education_required}</p>
                  </div>
                </div>
              )}

              {scheme.deadline && (
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Deadline</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(scheme.deadline).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="card-modern">
            <CardContent className="space-y-3 p-4 md:p-6">
              {/* AI Agent Button */}
              <Button 
                className="w-full gradient-neon text-white min-h-[44px]"
                onClick={() => setShowAgentModal(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Apply with AI Agent
              </Button>

              {scheme.application_url ? (
                <Button asChild variant="outline" className="w-full min-h-[44px]">
                  <a href={scheme.application_url} target="_blank" rel="noopener noreferrer">
                    Apply Manually
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full min-h-[44px]">
                  <Link to="/demo-application">
                    Try Guided Application
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}

              <Button asChild variant="outline" className="w-full min-h-[44px]">
                <Link 
                  to="/chat" 
                  state={{ 
                    schemeContext: {
                      id: scheme.id,
                      name: scheme.name,
                      description: scheme.description,
                      benefits: scheme.benefits,
                      eligibility_criteria: scheme.eligibility_criteria,
                      required_documents: scheme.required_documents,
                      category: scheme.category,
                      state: scheme.state,
                      department: scheme.department,
                      application_url: scheme.application_url,
                      eligibility_score: scheme.eligibility_score,
                      matched_criteria: scheme.matched_criteria,
                      missing_criteria: scheme.missing_criteria,
                    }
                  }}
                >
                  Ask AI Assistant
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Agent Modal */}
      {user && scheme && (
        <AIAgentModal
          open={showAgentModal}
          onClose={() => setShowAgentModal(false)}
          schemeId={scheme.id}
          schemeName={scheme.name}
          userId={user.id}
        />
      )}
    </div>
  );
}
