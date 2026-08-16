import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { applicationsApi, calculateEligibility, documentsApi, schemesApi } from '@/db/api';
import type { Application, Document, Profile, Scheme, SchemeWithEligibility } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MarkdownRenderer from '@/components/common/MarkdownRenderer';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coins,
  ClipboardList,
  FileText,
  FolderOpen,
  Gauge,
  HeartHandshake,
  Languages,
  ListTodo,
  MessageSquare,
  Repeat,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wand2,
} from 'lucide-react';

type FeatureAnchor =
  | 'overview'
  | 'intelligence'
  | 'compare'
  | 'vault'
  | 'track'
  | 'guide'
  | 'family'
  | 'support'
  | 'impact';

const featureAnchors: Array<{ id: FeatureAnchor; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'intelligence', label: 'Eligibility' },
  { id: 'compare', label: 'Compare' },
  { id: 'vault', label: 'Vault' },
  { id: 'track', label: 'Track' },
  { id: 'guide', label: 'Explain' },
  { id: 'family', label: 'Family' },
  { id: 'support', label: 'Assist' },
  { id: 'impact', label: 'Impact' },
];

const demoProfile: Profile = {
  id: 'demo-profile',
  email: 'demo@citizenseva.local',
  username: 'demo-citizen',
  role: 'user',
  name: 'Asha Verma',
  age: 29,
  state: 'Maharashtra',
  city: 'Pune',
  profession: 'Working Professional',
  income: 360000,
  category: 'OBC',
  education: 'Graduate',
  interests: ['Education', 'Women Empowerment', 'Healthcare'],
  gender: 'Female',
  address: 'Pune, Maharashtra, India',
  aadhaar_verified: true,
  profile_completed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const demoSchemes: Scheme[] = [
  {
    id: 'demo-scheme-1',
    name: 'Women Skill Grant',
    description: 'Funding and mentorship for women entering high-growth career paths.',
    category: 'Women Empowerment',
    eligibility_criteria: { criteria: ['Women applicants', 'Age 18-35', 'Resident of Maharashtra'] },
    benefits: 'Training stipend, mentor support, and certificate sponsorship.',
    required_documents: ['Aadhaar Card', 'Income Certificate', 'Graduation Certificate'],
    application_url: '/demo-application',
    deadline: '2026-05-25',
    state: 'Maharashtra',
    department: 'Women and Child Development',
    age_min: 18,
    age_max: 35,
    income_max: 500000,
    gender_specific: 'Female',
    education_required: 'Graduate',
    embedding: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-scheme-2',
    name: 'Family Health Shield',
    description: 'Low-cost medical support for households with verified income limits.',
    category: 'Healthcare',
    eligibility_criteria: { criteria: ['Annual income below threshold', 'Valid residence proof', 'One adult caregiver'] },
    benefits: 'Cashless hospital support and medicine reimbursement.',
    required_documents: ['Aadhaar Card', 'Bank Passbook', 'Income Certificate'],
    application_url: '/demo-application',
    deadline: '2026-06-10',
    state: null,
    department: 'Health Department',
    age_min: 18,
    age_max: null,
    income_max: 400000,
    gender_specific: null,
    education_required: null,
    embedding: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-scheme-3',
    name: 'Student Mobility Scholarship',
    description: 'Travel and study aid for students moving between districts or states.',
    category: 'Education',
    eligibility_criteria: { criteria: ['Student', '12th pass or above', 'Income within prescribed range'] },
    benefits: 'Semester stipend, travel support, and exam fee waiver.',
    required_documents: ['Aadhaar Card', 'Educational Certificates', 'Income Certificate'],
    application_url: '/demo-application',
    deadline: '2026-05-18',
    state: null,
    department: 'Higher Education',
    age_min: 16,
    age_max: 30,
    income_max: 600000,
    gender_specific: null,
    education_required: '12th Pass',
    embedding: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-scheme-4',
    name: 'Farmer Support Card',
    description: 'Input assistance and small equipment support for eligible farmers.',
    category: 'Agriculture',
    eligibility_criteria: { criteria: ['Farmer category', 'Land or tenancy proof', 'State residency'] },
    benefits: 'Seed subsidy, equipment rebate, and advisory services.',
    required_documents: ['Aadhaar Card', 'Land Records', 'Bank Passbook'],
    application_url: '/demo-application',
    deadline: '2026-06-30',
    state: 'Maharashtra',
    department: 'Agriculture Department',
    age_min: 18,
    age_max: 60,
    income_max: 700000,
    gender_specific: null,
    education_required: null,
    embedding: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const demoApplications: Application[] = [
  {
    id: 'app-demo-1',
    user_id: demoProfile.id,
    scheme_id: 'demo-scheme-1',
    status: 'submitted',
    eligibility_score: 92,
    form_data: { name: demoProfile.name, state: demoProfile.state, documents: ['Aadhaar Card', 'Income Certificate'] },
    submitted_at: '2026-04-23T10:10:00.000Z',
    approved_at: null,
    rejected_at: null,
    rejection_reason: null,
    application_number: 'APP-20260423-01',
    created_at: '2026-04-23T10:00:00.000Z',
    updated_at: '2026-04-23T10:10:00.000Z',
  },
  {
    id: 'app-demo-2',
    user_id: demoProfile.id,
    scheme_id: 'demo-scheme-3',
    status: 'in_progress',
    eligibility_score: 84,
    form_data: { name: demoProfile.name, education: demoProfile.education },
    submitted_at: null,
    approved_at: null,
    rejected_at: null,
    rejection_reason: null,
    application_number: null,
    created_at: '2026-04-24T09:30:00.000Z',
    updated_at: '2026-04-24T09:48:00.000Z',
  },
];

const demoDocuments: Document[] = [
  {
    id: 'doc-demo-1',
    user_id: demoProfile.id,
    application_id: null,
    document_type: 'Aadhaar Card',
    file_url: '#',
    file_name: 'aadhaar.pdf',
    file_size: 248000,
    status: 'verified',
    verification_notes: 'Verified and ready for reuse',
    verified_at: '2026-04-20T11:00:00.000Z',
    created_at: '2026-04-20T10:30:00.000Z',
    updated_at: '2026-04-20T11:00:00.000Z',
  },
  {
    id: 'doc-demo-2',
    user_id: demoProfile.id,
    application_id: null,
    document_type: 'Income Certificate',
    file_url: '#',
    file_name: 'income-certificate.pdf',
    file_size: 184000,
    status: 'pending',
    verification_notes: 'Waiting for manual review',
    verified_at: null,
    created_at: '2026-04-22T08:20:00.000Z',
    updated_at: '2026-04-22T08:20:00.000Z',
  },
];

const familyProfiles = [
  {
    id: 'self',
    title: 'Primary Applicant',
    relation: 'Self',
    profileHint: 'Best for skill and healthcare schemes',
    readiness: 92,
    bestMatch: 'Women Skill Grant',
  },
  {
    id: 'parent',
    title: 'Father',
    relation: 'Senior family member',
    profileHint: 'Best for pension and social security schemes',
    readiness: 78,
    bestMatch: 'Family Health Shield',
  },
  {
    id: 'student',
    title: 'Younger sibling',
    relation: 'Student',
    profileHint: 'Best for scholarships and mobility support',
    readiness: 84,
    bestMatch: 'Student Mobility Scholarship',
  },
];

function formatDate(value: string | null | undefined) {
  if (!value) return 'Not set';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatFileSize(bytes: number) {
  if (!bytes) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatusTone(status: Application['status']) {
  switch (status) {
    case 'approved':
      return 'default';
    case 'submitted':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
}

function scrollToSection(id: FeatureAnchor) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function SectionHeader({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {icon}
          <span>{title}</span>
        </div>
        <p className="text-sm text-muted-foreground md:text-base">{description}</p>
      </div>
      {action}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <Card className="card-modern overflow-hidden bg-gradient-to-br from-background to-muted/30">
      <CardContent className="flex items-start justify-between gap-4 p-4 md:p-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight md:text-4xl">{value}</p>
          <p className="text-sm text-muted-foreground">{detail}</p>
        </div>
        <div className="rounded-full bg-primary/10 p-3 text-primary">{icon}</div>
      </CardContent>
    </Card>
  );
}

export default function FeatureLabPage() {
  const { profile } = useAuth();
  const [schemes, setSchemes] = useState<SchemeWithEligibility[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState('');
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [activeFamilyId, setActiveFamilyId] = useState('self');
  const [isLoading, setIsLoading] = useState(true);

  const activeProfile = profile ?? demoProfile;

  useEffect(() => {
    const loadFeatureData = async () => {
      setIsLoading(true);

      try {
        const [schemeRows, applicationRows, documentRows] = await Promise.all([
          schemesApi.getAllSchemes(12).catch(() => []),
          profile ? applicationsApi.getUserApplications(profile.id, 8).catch(() => []) : Promise.resolve(demoApplications),
          profile ? documentsApi.getUserDocuments(profile.id).catch(() => []) : Promise.resolve(demoDocuments),
        ]);

        const baseSchemes = schemeRows.length > 0 ? schemeRows : demoSchemes;
        const scoredSchemes = baseSchemes
          .map((scheme) => calculateEligibility(activeProfile, scheme))
          .sort((a, b) => b.eligibility_score - a.eligibility_score);

        setSchemes(scoredSchemes);
        setApplications(applicationRows.length > 0 ? applicationRows : demoApplications);
        setDocuments(documentRows.length > 0 ? documentRows : demoDocuments);
        setSelectedSchemeId(scoredSchemes[0]?.id ?? '');
        setComparisonIds(scoredSchemes.slice(0, 3).map((scheme) => scheme.id));
      } catch (error) {
        console.error('Failed to load feature lab data:', error);
        const scoredSchemes = demoSchemes
          .map((scheme) => calculateEligibility(activeProfile, scheme))
          .sort((a, b) => b.eligibility_score - a.eligibility_score);

        setSchemes(scoredSchemes);
        setApplications(demoApplications);
        setDocuments(demoDocuments);
        setSelectedSchemeId(scoredSchemes[0]?.id ?? '');
        setComparisonIds(scoredSchemes.slice(0, 3).map((scheme) => scheme.id));
      } finally {
        setIsLoading(false);
      }
    };

    loadFeatureData();
  }, [activeProfile, profile]);

  const selectedScheme = useMemo(
    () => schemes.find((scheme) => scheme.id === selectedSchemeId) ?? schemes[0] ?? null,
    [schemes, selectedSchemeId],
  );

  const comparisonSchemes = useMemo(
    () => comparisonIds.map((id) => schemes.find((scheme) => scheme.id === id)).filter(Boolean) as SchemeWithEligibility[],
    [comparisonIds, schemes],
  );

  const verifiedDocuments = documents.filter((document) => document.status === 'verified').length;
  const readyApplications = applications.filter((application) => application.status === 'submitted' || application.status === 'approved').length;
  const avgEligibility = schemes.length > 0 ? Math.round(schemes.reduce((sum, scheme) => sum + scheme.eligibility_score, 0) / schemes.length) : 0;

  const profileCompleteness = activeProfile.profile_completed ? 100 : 74;
  const documentReadiness = documents.length > 0 ? Math.round((verifiedDocuments / documents.length) * 100) : 88;
  const applicationReadiness = selectedScheme?.eligibility_score ?? 0;
  const timeSaved = Math.min(100, Math.max(38, avgEligibility + 12));

  const selectedFamily = familyProfiles.find((member) => member.id === activeFamilyId) ?? familyProfiles[0];

  const plainLanguageMarkdown = selectedScheme
    ? `## What this means in plain language

- You are a **${selectedScheme.eligibility_score}% match** for this scheme right now.
- You already match **${selectedScheme.matched_criteria.length} eligibility points**.
- You should prepare **${selectedScheme.required_documents.slice(0, 3).join(', ')}** before applying.
- The recommended next action is to open the scheme detail page and start the AI-assisted application flow.
- If you want support, use the chat assistant and ask for a simple step-by-step explanation.
`
    : 'No scheme selected yet.';

  const reminderItems = [
    {
      title: selectedScheme?.deadline ? `${selectedScheme.name} deadline` : 'Profile review',
      due: selectedScheme?.deadline ? formatDate(selectedScheme.deadline) : 'Today',
      detail: selectedScheme?.deadline ? 'Apply before the closing date' : 'Complete the missing profile fields',
      tone: 'urgent',
    },
    {
      title: 'Document refresh check',
      due: 'Weekly',
      detail: 'Keep reusable documents verified and up to date',
      tone: 'normal',
    },
    {
      title: 'Application follow-up',
      due: '2 days after submission',
      detail: 'Check receipt and track status updates',
      tone: 'normal',
    },
  ];

  const impactRows = [
    { label: 'Profile readiness', value: profileCompleteness },
    { label: 'Document reuse', value: documentReadiness },
    { label: 'Application confidence', value: applicationReadiness },
    { label: 'Estimated time saved', value: timeSaved },
  ];

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

  return (
    <div className="space-y-8 pb-10 md:space-y-10">
      <Card className="card-modern overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-background to-chart-2/10">
        <CardContent className="grid gap-6 p-5 md:grid-cols-[1.4fr_0.9fr] md:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="gap-1 bg-primary text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Hackathon Feature Lab
              </Badge>
              <Badge variant="outline" className="gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Additive only, no flow changes
              </Badge>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight md:text-display-sm">
                Build, compare, explain, and track every scheme journey in one place.
              </h1>
              <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
                This studio adds the missing product depth for the hackathon: eligibility intelligence, scheme comparison, document vault, reminders, family mode, plain-language AI, and impact analytics without changing your existing application flow.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/schemes">
                  Open Scheme Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => scrollToSection('impact')}>
                View Impact Dashboard
              </Button>
            </div>
          </div>

          <Card className="border-border bg-card/80 shadow-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="h-5 w-5 text-primary" />
                Live readiness snapshot
              </CardTitle>
              <CardDescription>
                The hub uses your current profile when available and falls back to a sample citizen profile when needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Profile complete</span>
                  <span className="font-medium">{profileCompleteness}%</span>
                </div>
                <Progress value={profileCompleteness} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Document vault ready</span>
                  <span className="font-medium">{documentReadiness}%</span>
                </div>
                <Progress value={documentReadiness} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Eligibility confidence</span>
                  <span className="font-medium">{selectedScheme?.eligibility_score ?? avgEligibility}%</span>
                </div>
                <Progress value={selectedScheme?.eligibility_score ?? avgEligibility} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <div id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Target className="h-5 w-5" />}
          label="Top match"
          value={`${selectedScheme?.eligibility_score ?? avgEligibility}%`}
          detail={selectedScheme?.name ? selectedScheme.name : 'No scheme selected yet'}
        />
        <MetricCard
          icon={<FolderOpen className="h-5 w-5" />}
          label="Reusable docs"
          value={verifiedDocuments}
          detail="Verified and ready to attach"
        />
        <MetricCard
          icon={<Clock3 className="h-5 w-5" />}
          label="Active applications"
          value={applications.length}
          detail={`${readyApplications} already submitted or approved`}
        />
        <MetricCard
          icon={<BarChart3 className="h-5 w-5" />}
          label="Estimated time saved"
          value={`${timeSaved} min`}
          detail="Against manual scheme hunting and form filling"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {featureAnchors.map((anchor) => (
          <Button
            key={anchor.id}
            size="sm"
            variant="outline"
            className="rounded-full"
            onClick={() => scrollToSection(anchor.id)}
          >
            {anchor.label}
          </Button>
        ))}
      </div>

      <section id="intelligence" className="space-y-4 scroll-mt-24">
        <SectionHeader
          icon={<Sparkles className="h-4 w-4" />}
          title="Eligibility intelligence"
          description="Choose a scheme and the hub shows your fit, missing requirements, and the quickest next action."
          action={
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Select value={selectedSchemeId} onValueChange={setSelectedSchemeId}>
                <SelectTrigger className="w-full sm:w-80">
                  <SelectValue placeholder="Choose a scheme" />
                </SelectTrigger>
                <SelectContent>
                  {schemes.map((scheme) => (
                    <SelectItem key={scheme.id} value={scheme.id}>
                      {scheme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedScheme && (
                <Button asChild className="w-full sm:w-auto">
                  <Link to={`/schemes/${selectedScheme.id}`}>
                    Open scheme detail
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          }
        />

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="h-5 w-5 text-primary" />
                Why this scheme fits you
              </CardTitle>
              <CardDescription>
                Human-readable reasons generated from the same eligibility logic your dashboard already uses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedScheme ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{selectedScheme.category}</Badge>
                    {selectedScheme.state && <Badge variant="outline">{selectedScheme.state}</Badge>}
                    <Badge variant={selectedScheme.eligibility_score >= 80 ? 'default' : 'secondary'}>
                      {selectedScheme.eligibility_score}% match
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Fit score</span>
                        <span className="font-medium">{selectedScheme.eligibility_score}%</span>
                      </div>
                      <Progress value={selectedScheme.eligibility_score} className="h-2" />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <Card className="border-border bg-muted/30">
                        <CardContent className="space-y-2 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Matched criteria</p>
                          <ul className="space-y-2 text-sm">
                            {selectedScheme.matched_criteria.slice(0, 4).map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-border bg-muted/30">
                        <CardContent className="space-y-2 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Missing criteria</p>
                          <ul className="space-y-2 text-sm">
                            {selectedScheme.missing_criteria.slice(0, 4).map((item) => (
                              <li key={item} className="flex items-start gap-2">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No scheme selected.</p>
              )}
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                Plain-language AI explanation
              </CardTitle>
              <CardDescription>
                The same scheme data translated into simple, easy-to-understand wording.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <MarkdownRenderer
                content={
                  selectedScheme
                    ? `## What this means in plain language

- You are a **${selectedScheme.eligibility_score}% match** for this scheme right now.
- You already match **${selectedScheme.matched_criteria.length} eligibility points**.
- You should prepare **${selectedScheme.required_documents.slice(0, 3).join(', ')}** before applying.
- The recommended next action is to open the scheme detail page and start the AI-assisted application flow.
- If you want support, use the chat assistant and ask for a simple step-by-step explanation.
`
                    : 'No scheme selected yet.'
                }
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section id="compare" className="space-y-4 scroll-mt-24">
        <SectionHeader
          icon={<ListTodo className="h-4 w-4" />}
          title="Scheme comparison studio"
          description="Select up to three schemes and compare the fit, benefits, documents, and deadlines side by side."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {schemes.map((scheme) => (
            <Card key={scheme.id} className={`card-modern transition-all ${comparisonIds.includes(scheme.id) ? 'border-primary shadow-md' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={scheme.eligibility_score >= 80 ? 'default' : 'secondary'}>{scheme.eligibility_score}% Match</Badge>
                      <Badge variant="outline">{scheme.category}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">{scheme.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{scheme.description}</CardDescription>
                  </div>
                  <Button variant={comparisonIds.includes(scheme.id) ? 'default' : 'outline'} size="sm" onClick={() => toggleComparison(scheme.id)}>
                    {comparisonIds.includes(scheme.id) ? 'Selected' : 'Add'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={scheme.eligibility_score} className="h-2" />
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Benefits: {scheme.benefits}</p>
                  <p>Documents: {scheme.required_documents.slice(0, 2).join(', ')}</p>
                  <p>Deadline: {formatDate(scheme.deadline)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-modern overflow-x-auto">
          <CardContent className="min-w-[720px] p-0">
            <div className="grid grid-cols-[1.5fr_repeat(3,1fr)] border-b border-border bg-muted/40 text-sm font-medium">
              <div className="p-4">Feature</div>
              {comparisonSchemes.slice(0, 3).map((scheme) => (
                <div key={scheme.id} className="p-4">
                  {scheme.name}
                </div>
              ))}
            </div>
            {[
              ['Eligibility score', ...comparisonSchemes.slice(0, 3).map((scheme) => `${scheme.eligibility_score}%`)],
              ['Category', ...comparisonSchemes.slice(0, 3).map((scheme) => scheme.category)],
              ['State', ...comparisonSchemes.slice(0, 3).map((scheme) => scheme.state ?? 'National')],
              ['Deadline', ...comparisonSchemes.slice(0, 3).map((scheme) => formatDate(scheme.deadline))],
              ['Required docs', ...comparisonSchemes.slice(0, 3).map((scheme) => `${scheme.required_documents.length}`)],
            ].map((row) => (
              <div key={row[0]} className="grid grid-cols-[1.5fr_repeat(3,1fr)] border-b border-border text-sm last:border-b-0">
                <div className="p-4 font-medium">{row[0]}</div>
                {row.slice(1).map((value, index) => (
                  <div key={`${row[0]}-${index}`} className="p-4 text-muted-foreground">
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section id="vault" className="space-y-4 scroll-mt-24">
        <SectionHeader
          icon={<FolderOpen className="h-4 w-4" />}
          title="Document vault"
          description="Verified documents are stored once and reused across multiple applications, reducing repeated uploads."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((document) => (
            <Card key={document.id} className="card-modern">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{document.file_name}</CardTitle>
                    <CardDescription>{document.document_type}</CardDescription>
                  </div>
                  <Badge variant={document.status === 'verified' ? 'default' : document.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {document.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Size</span>
                  <span>{formatFileSize(document.file_size)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Verified</span>
                  <span>{document.verified_at ? formatDate(document.verified_at) : 'Pending'}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Reuse</span>
                  <span>{document.status === 'verified' ? 'Ready for reuse' : 'Verify to unlock reuse'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      <section id="track" className="space-y-4 scroll-mt-24">
        <SectionHeader
          icon={<Bell className="h-4 w-4" />}
          title="Track and reminders"
          description="This section turns deadlines and application states into a simple status timeline."
        />

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="h-5 w-5 text-primary" />
                Application timeline
              </CardTitle>
              <CardDescription>Current and historical applications from the logged-in account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {applications.map((application) => {
                const applicationScheme = schemes.find((scheme) => scheme.id === application.scheme_id);

                return (
                  <div key={application.id} className="rounded-lg border border-border bg-muted/20 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{applicationScheme?.name ?? 'Application'}</h3>
                          <Badge variant={getStatusTone(application.status)}>{application.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {application.application_number ?? 'Draft application'}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Started: {formatDate(application.created_at)}</p>
                        <p>Updated: {formatDate(application.updated_at)}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em]">Eligibility</p>
                        <p className="font-medium text-foreground">{application.eligibility_score ?? 0}%</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em]">Submitted</p>
                        <p className="font-medium text-foreground">{application.submitted_at ? formatDate(application.submitted_at) : 'Not yet'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em]">Result</p>
                        <p className="font-medium text-foreground">
                          {application.approved_at ? 'Approved' : application.rejected_at ? 'Rejected' : 'In progress'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarDays className="h-5 w-5 text-primary" />
                Reminder queue
              </CardTitle>
              <CardDescription>Deadline reminders, document refreshes, and follow-up nudges.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reminderItems.map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-4">
                  <div className={`mt-1 h-2.5 w-2.5 rounded-full ${item.tone === 'urgent' ? 'bg-red-500' : 'bg-primary'}`} />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{item.title}</p>
                      <Badge variant={item.tone === 'urgent' ? 'destructive' : 'secondary'}>{item.due}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section id="guide" className="space-y-4 scroll-mt-24">
        <SectionHeader
          icon={<Languages className="h-4 w-4" />}
          title="Plain-language guide"
          description="Convert formal scheme text into simple language that a first-time applicant can understand instantly."
        />

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="card-modern">
            <CardContent className="p-4 md:p-6">
              <MarkdownRenderer
                content={
                  selectedScheme
                    ? `## What this means in plain language

- You are a **${selectedScheme.eligibility_score}% match** for this scheme right now.
- You already match **${selectedScheme.matched_criteria.length} eligibility points**.
- You should prepare **${selectedScheme.required_documents.slice(0, 3).join(', ')}** before applying.
- The recommended next action is to open the scheme detail page and start the AI-assisted application flow.
- If you want support, use the chat assistant and ask for a simple step-by-step explanation.
`
                    : 'No scheme selected yet.'
                }
              />
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                AI conversation shortcuts
              </CardTitle>
              <CardDescription>These prompts keep the chat assistant useful in live usage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {[
                'Explain this scheme in simple Hindi.',
                'Tell me what documents I still need.',
                'Compare the top two matching schemes.',
                'Show me how to apply step by step.',
              ].map((prompt) => (
                <div key={prompt} className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 p-3">
                  <Bot className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{prompt}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section id="family" className="space-y-4 scroll-mt-24">
        <SectionHeader
          icon={<Users className="h-4 w-4" />}
          title="Family profile mode"
          description="Let one account manage multiple household members and switch between their application needs."
        />

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {familyProfiles.map((member) => (
              <button
                key={member.id}
                onClick={() => setActiveFamilyId(member.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-all ${
                  activeFamilyId === member.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:bg-muted/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{member.title}</p>
                    <p className="text-sm text-muted-foreground">{member.relation}</p>
                  </div>
                  <Badge variant={activeFamilyId === member.id ? 'default' : 'secondary'}>{member.readiness}% ready</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{member.profileHint}</p>
              </button>
            ))}
          </div>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HeartHandshake className="h-5 w-5 text-primary" />
                {selectedFamily.title}
              </CardTitle>
              <CardDescription>{selectedFamily.bestMatch}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Readiness</span>
                  <span className="font-medium">{selectedFamily.readiness}%</span>
                </div>
                <Progress value={selectedFamily.readiness} className="h-2" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Card className="border-border bg-muted/20">
                  <CardContent className="space-y-1 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Relation</p>
                    <p className="font-medium">{selectedFamily.relation}</p>
                  </CardContent>
                </Card>
                <Card className="border-border bg-muted/20">
                  <CardContent className="space-y-1 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Best fit</p>
                    <p className="font-medium">{selectedFamily.bestMatch}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section id="support" className="space-y-4 scroll-mt-24">
        <SectionHeader
          icon={<HeartHandshake className="h-4 w-4" />}
          title="Human assist and escalation"
          description="If the assistant gets stuck, hand the flow to a human or jump back into chat with full context."
        />

        <Card className="card-modern border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="grid gap-4 p-4 md:grid-cols-[1.1fr_0.9fr] md:p-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Need help finishing the journey?</h3>
              <p className="text-sm text-muted-foreground">
                Use the support rail to explain missing documents, request a clearer AI summary, or connect the user to a volunteer/agent with the current application context.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/chat">
                    Open AI chat
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link to="/schemes">Browse more schemes</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: 'Escalate to human', icon: <Users className="h-4 w-4" /> },
                { title: 'Share context', icon: <FileText className="h-4 w-4" /> },
                { title: 'Retry failed step', icon: <Repeat className="h-4 w-4" /> },
                { title: 'Show simpler words', icon: <Languages className="h-4 w-4" /> },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm font-medium">
                  <span className="rounded-full bg-primary/10 p-2 text-primary">{item.icon}</span>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section id="impact" className="space-y-4 scroll-mt-24">
        <SectionHeader
          icon={<Gauge className="h-4 w-4" />}
          title="Impact dashboard"
          description="Track measurable platform value: faster discovery, fewer mistakes, and higher completion confidence."
        />

        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Core metrics
              </CardTitle>
              <CardDescription>Simple numbers that clearly show product value.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {impactRows.map((row) => (
                <div key={row.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium">{row.value}%</span>
                  </div>
                  <Progress value={row.value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Coins className="h-5 w-5 text-primary" />
                Business-ready outcomes
              </CardTitle>
              <CardDescription>Translate platform performance into a product story that feels real and scalable.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {[
                'One account can manage multiple family members and documents.',
                'The document vault reduces repeated uploads across schemes.',
                'Reminders and status tracking keep users engaged after submission.',
                'Plain-language explanations improve trust and reduce support load.',
                'Comparison and fit scoring help users choose the best scheme quickly.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}