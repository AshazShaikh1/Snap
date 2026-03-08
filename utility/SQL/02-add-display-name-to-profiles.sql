-- 02-add-display-name-to-profiles.sql

-- 1. Add the display_name column to the existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;

-- 2. Update the trigger function to capture the display_name from the auth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'display_name'
  );
  RETURN new;
END;
$$;
