-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Schemes policies (public read, admin write)
CREATE POLICY "Anyone can view schemes" ON public.schemes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert schemes" ON public.schemes
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update schemes" ON public.schemes
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete schemes" ON public.schemes
  FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Applications policies
CREATE POLICY "Users can view their own applications" ON public.applications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" ON public.applications
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can insert their own applications" ON public.applications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON public.applications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all applications" ON public.applications
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

-- Documents policies
CREATE POLICY "Users can view their own documents" ON public.documents
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents" ON public.documents
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can insert their own documents" ON public.documents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON public.documents
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all documents" ON public.documents
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

-- Chat history policies
CREATE POLICY "Users can view their own chat history" ON public.chat_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages" ON public.chat_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all chat history" ON public.chat_history
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can view all notifications" ON public.notifications
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('app-adfkyk0iayo1_documents_images', 'app-adfkyk0iayo1_documents_images', true),
  ('app-adfkyk0iayo1_aadhaar_images', 'app-adfkyk0iayo1_aadhaar_images', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'app-adfkyk0iayo1_documents_images');

CREATE POLICY "Anyone can view public documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'app-adfkyk0iayo1_documents_images');

CREATE POLICY "Users can update their own documents in storage"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'app-adfkyk0iayo1_documents_images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents in storage"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'app-adfkyk0iayo1_documents_images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for Aadhaar bucket
CREATE POLICY "Authenticated users can upload Aadhaar images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'app-adfkyk0iayo1_aadhaar_images');

CREATE POLICY "Users can view their own Aadhaar images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'app-adfkyk0iayo1_aadhaar_images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own Aadhaar images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'app-adfkyk0iayo1_aadhaar_images' AND auth.uid()::text = (storage.foldername(name))[1]);