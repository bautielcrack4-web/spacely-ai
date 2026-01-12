-- Consolidated Migration for All New Features
-- Run this in your Supabase SQL Editor

-- 1. Add columns for Variations & Advanced Features
ALTER TABLE public.generations
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.generations(id),
ADD COLUMN IF NOT EXISTS seed INTEGER,
ADD COLUMN IF NOT EXISTS is_variation BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS style TEXT,
ADD COLUMN IF NOT EXISTS prompt TEXT,
ADD COLUMN IF NOT EXISTS room_type TEXT;

-- 2. Index for faster variation lookups
CREATE INDEX IF NOT EXISTS idx_generations_parent_id ON public.generations(parent_id);

-- 3. Update Policy (Optional but good for safety)
-- Ensure users can delete their own generations
CREATE POLICY "Users can delete their own generations"
ON public.generations FOR DELETE
USING (auth.uid() = user_id);
