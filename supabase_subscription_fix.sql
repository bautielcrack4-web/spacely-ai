-- FIX SUBSCRIPTION SYNC (Run this in Supabase SQL Editor)

-- 1. Ensure the correct column name exists
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='stripe_customer_id') THEN
        ALTER TABLE public.profiles RENAME COLUMN stripe_customer_id TO lemon_squeezy_customer_id;
    END IF;
END $$;

-- Add the column if it doesn't exist at all (fallback)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lemon_squeezy_customer_id text;

-- 2. Update the subscription function to use the Lemon Squeezy column
CREATE OR REPLACE FUNCTION update_subscription(
    p_user_id uuid,
    p_status text,
    p_credits int,
    p_customer_id text
)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET 
    subscription_status = p_status,
    credits = p_credits,
    lemon_squeezy_customer_id = p_customer_id
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
