import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { INDIAN_STATES } from '@/types';

export default function DemoApplicationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    state: '',
    city: '',
    address: '',
    income: '',
    category: '',
    education: '',
    phone: '',
    email: '',
  });
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({
    aadhaar: null,
    income_certificate: null,
    address_proof: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.age || !formData.state) {
      toast.error('Please fill all required fields');
      return;
    }

    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <CardTitle className="mt-4 text-2xl">Application Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your application has been submitted successfully.
            </p>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-semibold">Application Number</p>
              <p className="text-lg font-bold text-primary">APP-{Date.now()}</p>
            </div>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mx-auto max-w-3xl">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-2xl">Government Scheme Application Form</CardTitle>
              <p className="text-sm text-muted-foreground">
                Please fill out all required fields marked with *
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="Enter your age"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange('gender', value)}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Select
                        value={formData.education}
                        onValueChange={(value) => handleInputChange('education', value)}
                      >
                        <SelectTrigger id="education">
                          <SelectValue placeholder="Select education" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Below 10th">Below 10th</SelectItem>
                          <SelectItem value="10th Pass">10th Pass</SelectItem>
                          <SelectItem value="12th Pass">12th Pass</SelectItem>
                          <SelectItem value="Graduate">Graduate</SelectItem>
                          <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address Information</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => handleInputChange('state', value)}
                      >
                        <SelectTrigger id="state">
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
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter complete address"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Economic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Economic Information</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="income">Annual Income (₹)</Label>
                      <Input
                        id="income"
                        name="income"
                        type="number"
                        value={formData.income}
                        onChange={(e) => handleInputChange('income', e.target.value)}
                        placeholder="Enter annual income"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange('category', value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="OBC">OBC</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="ST">ST</SelectItem>
                          <SelectItem value="EWS">EWS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Document Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Document Upload</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Card *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="aadhaar"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange('aadhaar', e.target.files?.[0] || null)}
                        />
                        {documents.aadhaar && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="income_certificate">Income Certificate</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="income_certificate"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange('income_certificate', e.target.files?.[0] || null)}
                        />
                        {documents.income_certificate && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address_proof">Address Proof</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="address_proof"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange('address_proof', e.target.files?.[0] || null)}
                        />
                        {documents.address_proof && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Submit Application
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
