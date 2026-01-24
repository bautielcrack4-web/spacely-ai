-- SUBSCRIPTION MANAGEMENT SYSTEM - Database Migration
-- Run this in Supabase SQL Editor

-- 1. CREATE SUBSCRIPTION_DETAILS TABLE
CREATE TABLE IF NOT EXISTS public.subscription_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  lemon_squeezy_subscription_id TEXT,
  plan_name TEXT NOT NULL, -- 'weekly', 'monthly', 'yearly'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'paused'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  cancellation_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  lemon_squeezy_order_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL, -- 'paid', 'refunded', 'failed'
  plan_name TEXT,
  transaction_type TEXT, -- 'subscription', 'upgrade', 'refund'
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE RLS
ALTER TABLE public.subscription_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 4. CREATE RLS POLICIES
-- Subscription Details Policies
DROP POLICY IF EXISTS "Users view own subscription" ON public.subscription_details;
CREATE POLICY "Users view own subscription" ON public.subscription_details
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own subscription" ON public.subscription_details;
CREATE POLICY "Users update own subscription" ON public.subscription_details
  FOR UPDATE USING (auth.uid() = user_id);

-- Transactions Policies
DROP POLICY IF EXISTS "Users view own transactions" ON public.transactions;
CREATE POLICY "Users view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- 5. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_subscription_details_user_id ON public.subscription_details(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- 6. CREATE RPC FUNCTION: Get Subscription Info
CREATE OR REPLACE FUNCTION get_subscription_info(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'subscription', (
      SELECT row_to_json(s.*) 
      FROM subscription_details s 
      WHERE s.user_id = p_user_id
    ),
    'transactions', (
      SELECT COALESCE(json_agg(t.* ORDER BY t.created_at DESC), '[]'::json)
      FROM transactions t 
      WHERE t.user_id = p_user_id
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. CREATE RPC FUNCTION: Update Subscription from Webhook
CREATE OR REPLACE FUNCTION update_subscription_details(
  p_user_id UUID,
  p_subscription_id TEXT,
  p_plan_name TEXT,
  p_status TEXT,
  p_period_start TIMESTAMPTZ,
  p_period_end TIMESTAMPTZ
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.subscription_details (
    user_id,
    lemon_squeezy_subscription_id,
    plan_name,
    status,
    current_period_start,
    current_period_end,
    updated_at
  ) VALUES (
    p_user_id,
    p_subscription_id,
    p_plan_name,
    p_status,
    p_period_start,
    p_period_end,
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    lemon_squeezy_subscription_id = EXCLUDED.lemon_squeezy_subscription_id,
    plan_name = EXCLUDED.plan_name,
    status = EXCLUDED.status,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. CREATE RPC FUNCTION: Record Transaction
CREATE OR REPLACE FUNCTION record_transaction(
  p_user_id UUID,
  p_order_id TEXT,
  p_amount DECIMAL,
  p_currency TEXT,
  p_status TEXT,
  p_plan_name TEXT,
  p_transaction_type TEXT,
  p_receipt_url TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.transactions (
    user_id,
    lemon_squeezy_order_id,
    amount,
    currency,
    status,
    plan_name,
    transaction_type,
    receipt_url
  ) VALUES (
    p_user_id,
    p_order_id,
    p_amount,
    p_currency,
    p_status,
    p_plan_name,
    p_transaction_type,
    p_receipt_url
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. CREATE RPC FUNCTION: Cancel Subscription
CREATE OR REPLACE FUNCTION cancel_subscription_record(
  p_user_id UUID,
  p_reason TEXT,
  p_feedback TEXT,
  p_cancel_at_period_end BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.subscription_details
  SET 
    cancel_at_period_end = p_cancel_at_period_end,
    cancelled_at = CASE WHEN NOT p_cancel_at_period_end THEN NOW() ELSE NULL END,
    cancellation_reason = p_reason,
    cancellation_feedback = p_feedback,
    status = CASE WHEN NOT p_cancel_at_period_end THEN 'cancelled' ELSE status END,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. VERIFICATION QUERIES (Run these to test)
-- SELECT * FROM subscription_details;
-- SELECT * FROM transactions ORDER BY created_at DESC;
-- SELECT get_subscription_info(auth.uid());
