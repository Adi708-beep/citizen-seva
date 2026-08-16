import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, User, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/db/supabase';
import type { AadhaarOCRResult } from '@/types';
import { INDIAN_STATES, PROFESSIONS } from '@/types';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInWithUsername, signUpWithUsername } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    username: '',
    password: '',
    name: '',
    age: '',
    state: '',
    city: '',
    profession: '',
  });

  const from = (location.state as any)?.from || '/dashboard';

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Validate username (only letters, digits, underscore)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      setIsLoading(false);
      return;
    }

    try {
      const { error: authError } = await signInWithUsername(username, password);

      if (authError) {
        setError(authError.message);
        return;
      }

      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { username, password, name, age, state, city, profession } = signUpData;

    if (!username || !password || !name || !age || !state || !city || !profession) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Validate username (only letters, digits, underscore)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      setIsLoading(false);
      return;
    }

    // Validate age
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError('Please enter a valid age');
      setIsLoading(false);
      return;
    }

    try {
      // Sign up with metadata
      const email = `${username}@miaoda.com`;
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            name,
            age: ageNum,
            state,
            city,
            profession,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Auto sign in
      const { error: signInError } = await signInWithUsername(username, password);
      if (signInError) throw signInError;

      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAadhaarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `temp/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('app-adfkyk0iayo1_aadhaar_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Call OCR Edge Function
      const formData = new FormData();
      formData.append('image', file);

      const { data: ocrData, error: ocrError } = await supabase.functions.invoke<AadhaarOCRResult>(
        'ocr-aadhaar',
        {
          body: formData,
        }
      );

      if (ocrError) {
        const errorMsg = await ocrError?.context?.text();
        throw new Error(errorMsg || ocrError.message);
      }

      if (!ocrData?.success || !ocrData.data) {
        throw new Error('Failed to extract Aadhaar information');
      }

      // Create temporary account with extracted data
      const tempUsername = `user_${Date.now()}`;
      const tempPassword = Math.random().toString(36).slice(-12);

      const { error: signUpError } = await supabase.auth.signUp({
        email: `${tempUsername}@miaoda.com`,
        password: tempPassword,
        options: {
          data: {
            username: tempUsername,
            name: ocrData.data.name,
            age: ocrData.data.age,
            state: ocrData.data.state,
            city: ocrData.data.city,
            gender: ocrData.data.gender,
            address: ocrData.data.address,
            aadhaar_verified: true,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Auto sign in
      const { error: signInError } = await signInWithUsername(tempUsername, tempPassword);
      if (signInError) throw signInError;

      toast.success('Aadhaar verified! Please complete your profile.');
      navigate('/profile-setup', { replace: true });
    } catch (err: any) {
      console.error('Aadhaar upload error:', err);
      setError(err.message || 'Failed to process Aadhaar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-3 md:p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="mb-2 text-2xl md:text-4xl font-semibold tracking-tight">
            Welcome to <span className="font-normal">Citizen Seva</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">Your AI-powered government services assistant</p>
        </div>

        <Card className="card-modern">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-xl md:text-2xl">Get Started</CardTitle>
            <CardDescription className="text-xs md:text-sm">Sign in or create an account to access government schemes</CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="signin" className="text-xs md:text-sm py-2">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-xs md:text-sm py-2">Sign Up</TabsTrigger>
                <TabsTrigger value="aadhaar" className="text-xs md:text-sm py-2">Aadhaar</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-3 md:space-y-4 mt-4 md:mt-6">
                <form onSubmit={handleSignIn} className="space-y-3 md:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-username" className="text-sm">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-username"
                        name="username"
                        placeholder="Enter your username"
                        className="pl-10 min-h-[44px]"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 min-h-[44px]"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-xs md:text-sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full min-h-[44px]" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-3 md:space-y-4 mt-4 md:mt-6">
                <form onSubmit={handleSignUp} className="space-y-3 md:space-y-4">
                  <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-username" className="text-sm">Username *</Label>
                      <Input
                        id="signup-username"
                        value={signUpData.username}
                        onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                        placeholder="Choose username"
                        disabled={isLoading}
                        required
                        className="min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm">Password *</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        placeholder="Choose password"
                        disabled={isLoading}
                        required
                        className="min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="signup-name" className="text-sm">Full Name *</Label>
                      <Input
                        id="signup-name"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        placeholder="Enter your full name"
                        disabled={isLoading}
                        required
                        className="min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-age" className="text-sm">Age *</Label>
                      <Input
                        id="signup-age"
                        type="number"
                        value={signUpData.age}
                        onChange={(e) => setSignUpData({ ...signUpData, age: e.target.value })}
                        placeholder="Enter your age"
                        disabled={isLoading}
                        min="1"
                        max="120"
                        required
                        className="min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-state" className="text-sm">State *</Label>
                      <Select
                        value={signUpData.state}
                        onValueChange={(value) => setSignUpData({ ...signUpData, state: value })}
                        disabled={isLoading}
                        required
                      >
                        <SelectTrigger className="min-h-[44px]">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-profession" className="text-sm">Profession *</Label>
                      <Select
                        value={signUpData.profession}
                        onValueChange={(value) => setSignUpData({ ...signUpData, profession: value })}
                        disabled={isLoading}
                        required
                      >
                        <SelectTrigger className="min-h-[44px]">
                          <SelectValue placeholder="Select profession" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROFESSIONS.map((profession) => (
                            <SelectItem key={profession} value={profession}>
                              {profession}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="signup-city" className="text-sm">City *</Label>
                      <Input
                        id="signup-city"
                        value={signUpData.city}
                        onChange={(e) => setSignUpData({ ...signUpData, city: e.target.value })}
                        placeholder="Enter your city"
                        disabled={isLoading}
                        required
                        className="min-h-[44px]"
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-xs md:text-sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full min-h-[44px]" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="aadhaar" className="space-y-3 md:space-y-4 mt-4 md:mt-6">
                <div className="space-y-3 md:space-y-4">
                  <div className="rounded-lg border-2 border-dashed border-border p-6 md:p-8 text-center">
                    <Upload className="mx-auto mb-3 md:mb-4 h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-sm md:text-base font-semibold">Upload Aadhaar Card</h3>
                    <p className="mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground">
                      We'll automatically extract your information using AI
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleAadhaarUpload}
                      disabled={isLoading}
                      className="cursor-pointer min-h-[44px]"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription className="text-xs md:text-sm">{error}</AlertDescription>
                    </Alert>
                  )}

                  {isLoading && (
                    <div className="text-center py-4">
                      <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                      <p className="text-xs md:text-sm text-muted-foreground">Processing Aadhaar...</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
