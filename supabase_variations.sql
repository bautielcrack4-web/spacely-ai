-- Add columns for Variations feature
ALTER TABLE public.generations
ADD COLUMN parent_id UUID REFERENCES public.generations(id),
ADD COLUMN seed INTEGER,
ADD COLUMN is_variation BOOLEAN DEFAULT false;

-- Index for faster lookups of variations
CREATE INDEX idx_generations_parent_id ON public.generations(parent_id);
