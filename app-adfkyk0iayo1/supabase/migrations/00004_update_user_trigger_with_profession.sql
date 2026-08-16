-- Update the handle_new_user function to include profession
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Insert a profile synced with fields collected at signup
  INSERT INTO public.profiles (
    id, 
    email, 
    username, 
    name, 
    age, 
    state, 
    city, 
    profession,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'name',
    (NEW.raw_user_meta_data->>'age')::int,
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'profession',
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  
  RETURN NEW;
END;
$$;