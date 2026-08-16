import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getProfile } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, ShieldCheck, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const { signInWithUsername, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const usernameOrEmail = (formData.get('username') as string)?.trim();
    const password = (formData.get('password') as string)?.trim();

    if (!usernameOrEmail || !password) {
      setError('Please fill in both username and password.');
      setIsLoading(false);
      return;
    }

    try {
      let authError: Error | null = null;
      if (usernameOrEmail.includes('@')) {
        const result = await supabase.auth.signInWithPassword({
          email: usernameOrEmail,
          password,
        });
        authError = result.error as Error | null;
      } else {
        const result = await signInWithUsername(usernameOrEmail, password);
        authError = result.error;
      }

      if (authError) throw authError;

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error('Could not verify signed-in user.');

      const profile = await getProfile(userData.user.id);
      if (!profile || profile.role !== 'admin') {
        await signOut();
        throw new Error('This account does not have admin access.');
      }

      toast.success('Admin login successful.');
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Admin sign in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="card-modern">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Sign in with an administrator account to access platform analytics and user management.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="admin-username"
                    name="username"
                    className="pl-10 min-h-[44px]"
                    placeholder="Enter admin username or email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    className="pl-10 min-h-[44px]"
                    placeholder="Enter admin password"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In as Admin'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
