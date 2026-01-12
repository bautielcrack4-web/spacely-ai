-- SAFE SETUP SCRIPT (Run this)

-- 1. PROFILES (Skip if exists)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  credits int default 3,
  subscription_status text default 'free',
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. GENERATIONS TABLE (Create if missing)
create table if not exists public.generations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  image_url text not null,
  prompt text,
  style text,
  room_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Safe to run multiple times)
alter table public.profiles enable row level security;
alter table public.generations enable row level security;

-- 3. POLICIES (Drop first to avoid errors)
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can view own generations" on public.generations;
create policy "Users can view own generations" on public.generations for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own generations" on public.generations;
create policy "Users can insert own generations" on public.generations for insert with check (auth.uid() = user_id);

-- 4. STORAGE BUCKET (Handle conflict)
insert into storage.buckets (id, name, public) 
values ('generations', 'generations', true)
on conflict (id) do nothing;

-- Storage Policies
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'generations' );

drop policy if exists "Authenticated users can upload" on storage.objects;
create policy "Authenticated users can upload" on storage.objects for insert with check ( bucket_id = 'generations' and auth.role() = 'authenticated' );

-- 5. CREDIT FUNCTION
create or replace function decrement_credits(user_id uuid)
returns void as $$
begin
  update public.profiles
  set credits = credits - 1
  where id = user_id and credits > 0;
end;
$$ language plpgsql security definer;

-- 6. SUBSCRIPTION UPDATE FUNCTION
-- This allows the webhook to update status and credits bypassing RLS
create or replace function update_subscription(
    p_user_id uuid,
    p_status text,
    p_credits int,
    p_customer_id text
)
returns void as $$
begin
  update public.profiles
  set 
    subscription_status = p_status,
    credits = p_credits,
    stripe_customer_id = p_customer_id
  where id = p_user_id;
end;
$$ language plpgsql security definer;
