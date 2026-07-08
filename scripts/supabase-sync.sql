-- ==========================================
-- Supabase User Synchronization Script
-- ==========================================
-- Run this script in the SQL Editor of your Supabase Dashboard
-- to automate user creation and deletion synchronization.

-- 1. Create a trigger function for user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (
    id,
    name,
    email,
    password,
    "isVerified",
    "phoneNumber",
    "role",
    "createdAt",
    "updatedAt"
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'User'),
    new.email,
    '', -- Dummy password value since auth is managed by Supabase
    true, -- Handled by Supabase email verification
    new.raw_user_meta_data->>'phone_number',
    'USER',
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger on auth.users for INSERT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Create a trigger function for user deletion
CREATE OR REPLACE FUNCTION public.handle_delete_user()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public."User" WHERE id = old.id;
  RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create the trigger on auth.users for DELETE
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_delete_user();
