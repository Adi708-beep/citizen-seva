import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { documentsApi, profileApi } from '@/db/api';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { User, MapPin, Briefcase, GraduationCap, Save, Upload, FileText } from 'lucide-react';
import { INDIAN_STATES, PROFESSIONS, CATEGORIES, EDUCATION_LEVELS, DOCUMENT_TYPES } from '@/types';
import type { Document, Profile } from '@/types';

export default function ProfilePage() {
  const { profile: currentProfile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    if (currentProfile) {
      setFormData({
        name: currentProfile.name || '',
        age: currentProfile.age || undefined,
        state: currentProfile.state || '',
        city: currentProfile.city || '',
        profession: currentProfile.profession || '',
        income: currentProfile.income || undefined,
        category: currentProfile.category || '',
        education: currentProfile.education || '',
        gender: currentProfile.gender || '',
      });
    }
  }, [currentProfile]);

  useEffect(() => {
    const loadDocuments = async () => {
      if (!currentProfile) return;

      try {
        const rows = await documentsApi.getUserDocuments(currentProfile.id);
        setDocuments(rows);
      } catch (error) {
        console.error('Failed to load documents:', error);
      }
    };

    loadDocuments();
  }, [currentProfile]);

  const handleSave = async () => {
    if (!currentProfile) return;

    setIsLoading(true);
    try {
      await profileApi.updateProfile(currentProfile.id, formData);
      await refreshProfile();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (currentProfile) {
      setFormData({
        name: currentProfile.name || '',
        age: currentProfile.age || undefined,
        state: currentProfile.state || '',
        city: currentProfile.city || '',
        profession: currentProfile.profession || '',
        income: currentProfile.income || undefined,
        category: currentProfile.category || '',
        education: currentProfile.education || '',
        gender: currentProfile.gender || '',
      });
    }
    setIsEditing(false);
  };

  const handleUploadDocument = async () => {
    if (!currentProfile) return;

    if (!selectedDocumentType) {
      toast.error('Please select a document type');
      return;
    }

    if (!selectedFile) {
      toast.error('Please choose a file to upload');
      return;
    }

    setIsUploadingDocument(true);
    try {
      const path = `${currentProfile.id}/${Date.now()}-${selectedFile.name}`;
      const { data, error } = await supabase.storage
        .from('app-adfkyk0iayo1_documents_images')
        .upload(path, selectedFile, {
          upsert: false,
          cacheControl: '3600',
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('app-adfkyk0iayo1_documents_images')
        .getPublicUrl(data.path);

      await documentsApi.createDocument({
        user_id: currentProfile.id,
        application_id: null,
        document_type: selectedDocumentType,
        file_url: publicUrlData.publicUrl,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        status: 'pending',
        verification_notes: null,
        verified_at: null,
      });

      const rows = await documentsApi.getUserDocuments(currentProfile.id);
      setDocuments(rows);
      setSelectedFile(null);
      setSelectedDocumentType('');
      toast.success('Document uploaded successfully');
    } catch (error: any) {
      console.error('Failed to upload document:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setIsUploadingDocument(false);
    }
  };

  if (!currentProfile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            Your <span className="font-normal">Profile</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card className="card-modern">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-sm font-medium">{currentProfile.name || 'Not set'}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                {isEditing ? (
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                ) : (
                  <p className="text-sm font-medium">{currentProfile.age || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                {isEditing ? (
                  <Select
                    value={formData.gender || ''}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium">{currentProfile.gender || 'Not set'}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Username</Label>
              <p className="text-sm font-medium text-muted-foreground">{currentProfile.username}</p>
            </div>

            <div className="space-y-2">
              <Label>Account Role</Label>
              <Badge variant={currentProfile.role === 'admin' ? 'default' : 'secondary'}>
                {currentProfile.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="card-modern">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Location</CardTitle>
            </div>
            <CardDescription>Your residential address details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              {isEditing ? (
                <Select
                  value={formData.state || ''}
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                >
                  <SelectTrigger>
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
              ) : (
                <p className="text-sm font-medium">{currentProfile.state || 'Not set'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter your city"
                />
              ) : (
                <p className="text-sm font-medium">{currentProfile.city || 'Not set'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="card-modern">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle>Professional Details</CardTitle>
            </div>
            <CardDescription>Your occupation and income information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              {isEditing ? (
                <Select
                  value={formData.profession || ''}
                  onValueChange={(value) => setFormData({ ...formData, profession: value })}
                >
                  <SelectTrigger>
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
              ) : (
                <p className="text-sm font-medium">{currentProfile.profession || 'Not set'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="income">Annual Income (₹)</Label>
              {isEditing ? (
                <Input
                  id="income"
                  type="number"
                  value={formData.income || ''}
                  onChange={(e) => setFormData({ ...formData, income: parseInt(e.target.value) || undefined })}
                  placeholder="Enter annual income"
                  min="0"
                />
              ) : (
                <p className="text-sm font-medium">
                  {currentProfile.income ? `₹${currentProfile.income.toLocaleString('en-IN')}` : 'Not set'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Educational & Social Information */}
        <Card className="card-modern">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle>Education & Category</CardTitle>
            </div>
            <CardDescription>Your educational and social category details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="education">Education Level</Label>
              {isEditing ? (
                <Select
                  value={formData.education || ''}
                  onValueChange={(value) => setFormData({ ...formData, education: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm font-medium">{currentProfile.education || 'Not set'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Social Category</Label>
              {isEditing ? (
                <Select
                  value={formData.category || ''}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm font-medium">{currentProfile.category || 'Not set'}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion Status */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
          <CardDescription>
            Complete your profile to get better scheme recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Profile Status</span>
              <Badge variant={currentProfile.profile_completed ? 'default' : 'secondary'}>
                {currentProfile.profile_completed ? 'Complete' : 'Incomplete'}
              </Badge>
            </div>
            {currentProfile.aadhaar_verified && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Aadhaar Verification</span>
                <Badge variant="default">Verified</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Vault */}
      <Card className="card-modern">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Document Vault</CardTitle>
          </div>
          <CardDescription>
            Upload and manage documents for faster scheme applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-file">File</Label>
              <Input
                id="document-file"
                type="file"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleUploadDocument} disabled={isUploadingDocument} className="w-full md:w-auto">
                <Upload className="mr-2 h-4 w-4" />
                {isUploadingDocument ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>

          <Separator />

          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {documents.map((document) => (
                <div key={document.id} className="flex flex-col gap-2 rounded-md border border-border bg-muted/20 px-3 py-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium">{document.document_type}</p>
                    <p className="text-xs text-muted-foreground">{document.file_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        document.status === 'verified'
                          ? 'default'
                          : document.status === 'pending'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {document.status}
                    </Badge>
                    <a
                      href={document.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline underline-offset-4"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
