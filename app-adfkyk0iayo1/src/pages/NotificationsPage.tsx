import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { applicationsApi, documentsApi, notificationsApi, schemesApi } from '@/db/api';
import type { Application, Document, Notification, Scheme } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, CalendarDays, CheckCircle2, Clock3, FileText, RefreshCcw } from 'lucide-react';

type Reminder = {
  id: string;
  title: string;
  detail: string;
  due: string;
  tone: 'urgent' | 'normal';
  link?: string;
};

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

function daysUntil(dateString: string | null | undefined) {
  if (!dateString) return null;

  const target = new Date(dateString);
  if (Number.isNaN(target.getTime())) return null;

  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPageData = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        const [notificationRows, applicationRows, documentRows, schemeRows] = await Promise.all([
          notificationsApi.getUserNotifications(user.id, 40),
          applicationsApi.getUserApplications(user.id, 20),
          documentsApi.getUserDocuments(user.id),
          schemesApi.getAllSchemes(100),
        ]);

        setNotifications(notificationRows);
        setApplications(applicationRows);
        setDocuments(documentRows);
        setSchemes(schemeRows);
      } catch (error) {
        console.error('Failed to load notifications data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, [user]);

  const reminders = useMemo<Reminder[]>(() => {
    const schemeById = new Map(schemes.map((scheme) => [scheme.id, scheme]));

    const deadlineReminders = applications
      .filter((application) => application.status === 'draft' || application.status === 'in_progress')
      .map((application) => {
        const scheme = schemeById.get(application.scheme_id);
        const dueDays = daysUntil(scheme?.deadline ?? null);

        return {
          id: `deadline-${application.id}`,
          title: scheme ? `${scheme.name} deadline` : 'Application deadline',
          detail:
            dueDays === null
              ? 'Complete this application soon to avoid delays.'
              : dueDays <= 3
              ? 'Deadline is near. Submit this application as soon as possible.'
              : 'You still have time. Keep progressing this application.',
          due: scheme?.deadline ? formatDate(scheme.deadline) : 'No deadline available',
          tone: dueDays !== null && dueDays <= 3 ? 'urgent' : 'normal',
          link: scheme ? `/schemes/${scheme.id}` : '/schemes',
        };
      });

    const pendingDocuments = documents
      .filter((document) => document.status !== 'verified')
      .slice(0, 3)
      .map((document) => ({
        id: `doc-${document.id}`,
        title: `${document.document_type} verification pending`,
        detail: 'Verify this document to improve auto-application success rate.',
        due: formatDate(document.created_at),
        tone: 'normal' as const,
        link: '/profile',
      }));

    return [...deadlineReminders, ...pendingDocuments].slice(0, 8);
  }, [applications, documents, schemes]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      await notificationsApi.markAllAsRead(user.id);
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full bg-muted" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 bg-muted" />
          <Skeleton className="h-80 bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="card-modern border-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="flex flex-col gap-4 p-4 md:p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2.5">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold md:text-2xl">Notifications and Tracking</h1>
              <p className="text-sm text-muted-foreground">
                Stay on top of deadlines, document readiness, and application progress.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Badge variant={unreadCount > 0 ? 'default' : 'secondary'} className="justify-center px-3 py-1.5">
              {unreadCount} unread
            </Badge>
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock3 className="h-5 w-5 text-primary" />
              Activity feed
            </CardTitle>
            <CardDescription>Live alerts from your notifications table.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 && (
              <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                No notifications yet. Actions like applications and updates will appear here.
              </div>
            )}

            {notifications.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{item.title}</p>
                  <Badge variant={item.read ? 'outline' : 'default'}>{item.read ? 'Read' : 'New'}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.message}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(item.created_at)}</span>
                  {item.link ? (
                    <Link to={item.link} className="underline underline-offset-4 hover:text-foreground">
                      Open
                    </Link>
                  ) : (
                    <span>{item.type}</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
              Reminders
            </CardTitle>
            <CardDescription>Generated from application states, deadlines, and documents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.length === 0 && (
              <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                No reminders yet. Start an application to see timeline reminders here.
              </div>
            )}

            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <div className={`mt-1 h-2.5 w-2.5 rounded-full ${reminder.tone === 'urgent' ? 'bg-red-500' : 'bg-primary'}`} />
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{reminder.title}</p>
                    <Badge variant={reminder.tone === 'urgent' ? 'destructive' : 'secondary'}>{reminder.due}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{reminder.detail}</p>
                  {reminder.link && (
                    <Link to={reminder.link} className="inline-flex text-xs underline underline-offset-4 hover:text-foreground">
                      Open details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-modern">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCcw className="h-4 w-4" />
              Active Applications
            </div>
            <p className="mt-2 text-3xl font-semibold">{applications.length}</p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              Documents Pending
            </div>
            <p className="mt-2 text-3xl font-semibold">{documents.filter((doc) => doc.status !== 'verified').length}</p>
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              Submitted Applications
            </div>
            <p className="mt-2 text-3xl font-semibold">
              {applications.filter((app) => app.status === 'submitted' || app.status === 'approved').length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}