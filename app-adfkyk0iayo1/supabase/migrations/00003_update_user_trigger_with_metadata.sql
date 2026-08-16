-- Update handle_new_user function to use metadata from signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  INSERT INTO public.profiles (
    id, 
    email, 
    username, 
    role,
    name,
    age,
    state,
    city,
    gender,
    address,
    aadhaar_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END,
    NEW.raw_user_meta_data->>'name',
    CASE 
      WHEN NEW.raw_user_meta_data->>'age' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'age')::integer 
      ELSE NULL 
    END,
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'address',
    COALESCE((NEW.raw_user_meta_data->>'aadhaar_verified')::boolean, false)
  );
  RETURN NEW;
END;
$$;