// Database types
export type UserRole = 'user' | 'admin';
export type ApplicationStatus = 'draft' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
export type DocumentStatus = 'pending' | 'verified' | 'rejected';

export interface Profile {
  id: string;
  email: string | null;
  username: string | null;
  role: UserRole;
  name: string | null;
  age: number | null;
  state: string | null;
  city: string | null;
  profession: string | null;
  income: number | null;
  category: string | null;
  education: string | null;
  interests: string[] | null;
  gender: string | null;
  address: string | null;
  aadhaar_verified: boolean;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: string;
  eligibility_criteria: Record<string, any>;
  benefits: string;
  required_documents: string[];
  application_url: string | null;
  deadline: string | null;
  state: string | null;
  department: string | null;
  age_min: number | null;
  age_max: number | null;
  income_max: number | null;
  gender_specific: string | null;
  education_required: string | null;
  embedding: number[] | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  scheme_id: string;
  status: ApplicationStatus;
  eligibility_score: number | null;
  form_data: Record<string, any> | null;
  submitted_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  application_number: string | null;
  created_at: string;
  updated_at: string;
  scheme?: Scheme;
}

export interface Document {
  id: string;
  user_id: string;
  application_id: string | null;
  document_type: string;
  file_url: string;
  file_name: string;
  file_size: number;
  status: DocumentStatus;
  verification_notes: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'model' | 'assistant';
  content: string;
  language: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link: string | null;
  created_at: string;
}

// API response types
export interface AadhaarOCRResult {
  success: boolean;
  data?: {
    name: string | null;
    dob: string | null;
    age: number | null;
    gender: string | null;
    address: string | null;
    state: string | null;
    city: string | null;
    aadhaarNumber: string | null;
    rawText: string;
  };
  error?: string;
}

export interface SpeechToTextResult {
  success: boolean;
  text?: string;
  error?: string;
}

export interface TranslationResult {
  success: boolean;
  translatedText?: string;
  detectedSourceLanguage?: string;
  error?: string;
}

// UI types
export interface SchemeWithEligibility extends Scheme {
  eligibility_score: number;
  missing_criteria: string[];
  matched_criteria: string[];
}

export interface ChatContext {
  userProfile: Profile | null;
  relevantSchemes: Scheme[];
  history: ChatMessage[];
}

export interface VoiceSettings {
  enabled: boolean;
  language: 'en' | 'hi' | 'bn' | 'ta' | 'mr' | 'te';
  autoPlay: boolean;
}

export interface LanguageOption {
  code: 'en' | 'hi' | 'bn' | 'ta' | 'mr' | 'te';
  name: string;
  nativeName: string;
  speechCode: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const CATEGORIES = [
  'General',
  'OBC',
  'SC',
  'ST',
  'EWS',
];

export const EDUCATION_LEVELS = [
  'Below 10th',
  '10th Pass',
  '12th Pass',
  'Graduate',
  'Post Graduate',
  'Doctorate',
];

export const PROFESSIONS = [
  'Student',
  'Working Professional',
  'Self Employed',
  'Farmer',
  'Housewife',
  'Retired',
  'Unemployed',
  'Business Owner',
];

export const SCHEME_CATEGORIES = [
  'Financial Inclusion',
  'Healthcare',
  'Housing',
  'Women Empowerment',
  'Agriculture',
  'Education',
  'Entrepreneurship',
  'Social Security',
  'Energy',
  'Employment',
];

export const DOCUMENT_TYPES = [
  'Aadhaar Card',
  'PAN Card',
  'Voter ID',
  'Driving License',
  'Passport',
  'Ration Card',
  'Income Certificate',
  'Caste Certificate',
  'Domicile Certificate',
  'Birth Certificate',
  'Bank Passbook',
  'Property Documents',
  'Educational Certificates',
  'Other',
];
