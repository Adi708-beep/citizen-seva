import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import type { UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, FileText, MessageSquare, Files, FolderKanban, RefreshCw, Shield, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import {
  CartesianGrid,
  Cell,
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface AdminProfileRow {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  role: UserRole;
  state: string | null;
  city: string | null;
  profession: string | null;
  aadhaar_verified: boolean;
  profile_completed: boolean;
  created_at: string;
}

interface MetricCards {
  totalUsers: number;
  totalAdmins: number;
  totalSchemes: number;
  totalApplications: number;
  totalDocuments: number;
  totalChats: number;
}

interface ActivityPoint {
  date: string;
  users: number;
  applications: number;
  chats: number;
}

interface StatusPoint {
  name: string;
  value: number;
}

interface StatePoint {
  state: string;
  users: number;
}

const STATUS_COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'];

function toDateKey(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function formatDayLabel(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function buildLastNDays(days: number) {
  const items: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const point = new Date(now);
    point.setDate(now.getDate() - i);
    items.push(toDateKey(point.toISOString()));
  }
  return items;
}

export default function AdminDashboardPage() {
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricCards>({
    totalUsers: 0,
    totalAdmins: 0,
    totalSchemes: 0,
    totalApplications: 0,
    totalDocuments: 0,
    totalChats: 0,
  });

  const [activitySeries, setActivitySeries] = useState<ActivityPoint[]>([]);
  const [applicationStatusSeries, setApplicationStatusSeries] = useState<StatusPoint[]>([]);
  const [stateSeries, setStateSeries] = useState<StatePoint[]>([]);
  const [users, setUsers] = useState<AdminProfileRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [actionBusy, setActionBusy] = useState<Record<string, boolean>>({});

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const days = buildLastNDays(14);
      const startDate = `${days[0]}T00:00:00.000Z`;

      const [
        usersCountRes,
        adminsCountRes,
        schemesCountRes,
        applicationsCountRes,
        documentsCountRes,
        chatCountRes,
        usersRowsRes,
        applicationsStatusRes,
        usersTimelineRes,
        applicationsTimelineRes,
        chatsTimelineRes,
        statesRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
        supabase.from('schemes').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('chat_history').select('*', { count: 'exact', head: true }),
        supabase
          .from('profiles')
          .select('id,email,username,name,role,state,city,profession,aadhaar_verified,profile_completed,created_at')
          .order('created_at', { ascending: false })
          .limit(200),
        supabase.from('applications').select('status'),
        supabase.from('profiles').select('created_at').gte('created_at', startDate),
        supabase.from('applications').select('created_at').gte('created_at', startDate),
        supabase.from('chat_history').select('created_at').gte('created_at', startDate),
        supabase.from('profiles').select('state').not('state', 'is', null),
      ]);

      const possibleErrors = [
        usersCountRes.error,
        adminsCountRes.error,
        schemesCountRes.error,
        applicationsCountRes.error,
        documentsCountRes.error,
        chatCountRes.error,
        usersRowsRes.error,
        applicationsStatusRes.error,
        usersTimelineRes.error,
        applicationsTimelineRes.error,
        chatsTimelineRes.error,
        statesRes.error,
      ].filter(Boolean);

      if (possibleErrors.length > 0) {
        throw possibleErrors[0];
      }

      const usersRows = (usersRowsRes.data ?? []) as AdminProfileRow[];
      const statusRows = (applicationsStatusRes.data ?? []) as Array<{ status: string | null }>;
      const usersTimeline = (usersTimelineRes.data ?? []) as Array<{ created_at: string }>;
      const applicationsTimeline = (applicationsTimelineRes.data ?? []) as Array<{ created_at: string }>;
      const chatsTimeline = (chatsTimelineRes.data ?? []) as Array<{ created_at: string }>;
      const statesRows = (statesRes.data ?? []) as Array<{ state: string | null }>;

      setMetrics({
        totalUsers: usersCountRes.count ?? 0,
        totalAdmins: adminsCountRes.count ?? 0,
        totalSchemes: schemesCountRes.count ?? 0,
        totalApplications: applicationsCountRes.count ?? 0,
        totalDocuments: documentsCountRes.count ?? 0,
        totalChats: chatCountRes.count ?? 0,
      });

      setUsers(usersRows);

      const usersMap = new Map(days.map((d) => [d, 0]));
      const applicationsMap = new Map(days.map((d) => [d, 0]));
      const chatsMap = new Map(days.map((d) => [d, 0]));

      usersTimeline.forEach((row) => {
        const key = toDateKey(row.created_at);
        if (usersMap.has(key)) usersMap.set(key, (usersMap.get(key) ?? 0) + 1);
      });
      applicationsTimeline.forEach((row) => {
        const key = toDateKey(row.created_at);
        if (applicationsMap.has(key)) applicationsMap.set(key, (applicationsMap.get(key) ?? 0) + 1);
      });
      chatsTimeline.forEach((row) => {
        const key = toDateKey(row.created_at);
        if (chatsMap.has(key)) chatsMap.set(key, (chatsMap.get(key) ?? 0) + 1);
      });

      const timelineData: ActivityPoint[] = days.map((d) => ({
        date: formatDayLabel(d),
        users: usersMap.get(d) ?? 0,
        applications: applicationsMap.get(d) ?? 0,
        chats: chatsMap.get(d) ?? 0,
      }));
      setActivitySeries(timelineData);

      const statusCounts = new Map<string, number>();
      statusRows.forEach((row) => {
        const key = row.status ?? 'unknown';
        statusCounts.set(key, (statusCounts.get(key) ?? 0) + 1);
      });
      const statusData: StatusPoint[] = Array.from(statusCounts.entries()).map(([name, value]) => ({ name, value }));
      setApplicationStatusSeries(statusData);

      const stateCounts = new Map<string, number>();
      statesRows.forEach((row) => {
        if (!row.state) return;
        stateCounts.set(row.state, (stateCounts.get(row.state) ?? 0) + 1);
      });
      const topStates: StatePoint[] = Array.from(stateCounts.entries())
        .map(([state, usersCount]) => ({ state, users: usersCount }))
        .sort((a, b) => b.users - a.users)
        .slice(0, 8);
      setStateSeries(topStates);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load admin dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadDashboardData();
    }
  }, [profile?.role]);

  const filteredUsers = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();

    return users.filter((userRow) => {
      const roleMatch = roleFilter === 'all' || userRow.role === roleFilter;
      if (!roleMatch) return false;
      if (!normalized) return true;

      return [userRow.name, userRow.username, userRow.email, userRow.state]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(normalized));
    });
  }, [users, roleFilter, searchQuery]);

  const withBusy = async (key: string, fn: () => Promise<void>) => {
    setActionBusy((prev) => ({ ...prev, [key]: true }));
    try {
      await fn();
    } finally {
      setActionBusy((prev) => ({ ...prev, [key]: false }));
    }
  };

  const updateUserRole = async (userId: string, nextRole: UserRole) => {
    await withBusy(`role-${userId}`, async () => {
      const { error } = await supabase.from('profiles').update({ role: nextRole }).eq('id', userId);
      if (error) throw error;

      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u)));
      toast.success('User role updated successfully.');
      loadDashboardData();
    });
  };

  const toggleAadhaarStatus = async (userRow: AdminProfileRow) => {
    await withBusy(`aadhaar-${userRow.id}`, async () => {
      const nextValue = !userRow.aadhaar_verified;
      const { error } = await supabase
        .from('profiles')
        .update({ aadhaar_verified: nextValue })
        .eq('id', userRow.id);
      if (error) throw error;

      setUsers((prev) => prev.map((u) => (u.id === userRow.id ? { ...u, aadhaar_verified: nextValue } : u)));
      toast.success('Aadhaar verification status updated.');
    });
  };

  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const completionRate = metrics.totalUsers > 0
    ? Math.round((users.filter((u) => u.profile_completed).length / metrics.totalUsers) * 100)
    : 0;

  const aadhaarRate = metrics.totalUsers > 0
    ? Math.round((users.filter((u) => u.aadhaar_verified).length / metrics.totalUsers) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Live analytics and user management from the production database.</p>
        </div>
        <Button onClick={loadDashboardData} disabled={loading} className="w-full md:w-auto">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Users" value={metrics.totalUsers} icon={<Users className="h-4 w-4 text-primary" />} />
        <StatCard title="Admin Accounts" value={metrics.totalAdmins} icon={<Shield className="h-4 w-4 text-primary" />} />
        <StatCard title="Schemes" value={metrics.totalSchemes} icon={<FolderKanban className="h-4 w-4 text-primary" />} />
        <StatCard title="Applications" value={metrics.totalApplications} icon={<FileText className="h-4 w-4 text-primary" />} />
        <StatCard title="Documents" value={metrics.totalDocuments} icon={<Files className="h-4 w-4 text-primary" />} />
        <StatCard title="Chat Messages" value={metrics.totalChats} icon={<MessageSquare className="h-4 w-4 text-primary" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Platform Activity (Last 14 Days)</CardTitle>
            <CardDescription>Daily new users, applications, and chat interactions.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activitySeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" name="Users" stroke="#0ea5e9" strokeWidth={2} />
                  <Line type="monotone" dataKey="applications" name="Applications" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="chats" name="Chats" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
            <CardDescription>Current workflow distribution across all applications.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : applicationStatusSeries.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No application records available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={applicationStatusSeries} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
                    {applicationStatusSeries.map((entry, index) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="card-modern lg:col-span-2">
          <CardHeader>
            <CardTitle>Top User States</CardTitle>
            <CardDescription>State-wise distribution of registered users.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" interval={0} angle={-20} textAnchor="end" height={70} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="users" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Data Quality</CardTitle>
            <CardDescription>Profile completion and verification health.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Profile completion rate</p>
              <p className="mt-1 text-2xl font-semibold">{completionRate}%</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Aadhaar verified rate</p>
              <p className="mt-1 text-2xl font-semibold">{aadhaarRate}%</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Active administrators</p>
              <p className="mt-1 text-2xl font-semibold">{metrics.totalAdmins}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-modern">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Search users, assign admin roles, and maintain verification state.</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, username, email, state"
                className="w-full sm:w-72"
              />
              <Select value={roleFilter} onValueChange={(value: 'all' | UserRole) => setRoleFilter(value)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-lg border border-border p-8 text-center text-sm text-muted-foreground">
              No users match the current filters.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[960px] text-sm">
                <thead className="bg-muted/40 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium">User</th>
                    <th className="px-3 py-2 font-medium">Location</th>
                    <th className="px-3 py-2 font-medium">Role</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Joined</th>
                    <th className="px-3 py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((userRow) => {
                    const roleBusy = actionBusy[`role-${userRow.id}`];
                    const aadhaarBusy = actionBusy[`aadhaar-${userRow.id}`];
                    return (
                      <tr key={userRow.id} className="border-t border-border">
                        <td className="px-3 py-3">
                          <div className="font-medium">{userRow.name || userRow.username || 'Unnamed user'}</div>
                          <div className="text-xs text-muted-foreground">{userRow.email ?? 'No email'}</div>
                        </td>
                        <td className="px-3 py-3">
                          <div>{userRow.state ?? 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">{userRow.city ?? 'N/A'}</div>
                        </td>
                        <td className="px-3 py-3">
                          <Badge variant={userRow.role === 'admin' ? 'default' : 'secondary'}>{userRow.role}</Badge>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant={userRow.profile_completed ? 'default' : 'secondary'}>
                              {userRow.profile_completed ? 'Profile Complete' : 'Profile Incomplete'}
                            </Badge>
                            <Badge variant={userRow.aadhaar_verified ? 'default' : 'secondary'}>
                              {userRow.aadhaar_verified ? 'Aadhaar Verified' : 'Aadhaar Pending'}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">
                          {new Date(userRow.created_at).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={roleBusy}
                              onClick={() => updateUserRole(userRow.id, userRow.role === 'admin' ? 'user' : 'admin')}
                            >
                              {roleBusy ? 'Updating...' : userRow.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={aadhaarBusy}
                              onClick={() => toggleAadhaarStatus(userRow)}
                            >
                              {aadhaarBusy
                                ? 'Updating...'
                                : userRow.aadhaar_verified
                                  ? 'Mark Unverified'
                                  : 'Mark Verified'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="card-modern">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center justify-between">
          <span>{title}</span>
          {icon}
        </CardDescription>
        <CardTitle className="text-3xl">{value.toLocaleString('en-IN')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">Live data from Supabase tables</p>
      </CardContent>
    </Card>
  );
}
