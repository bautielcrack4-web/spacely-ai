-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  credits int default 3,
  subscription_status text default 'free', -- 'free', 'active', 'cancelled'
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, credits)
  values (new.id, new.email, 3);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- GENERATIONS TABLE
create table public.generations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  image_url text not null,
  prompt text,
  style text,
  room_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.generations enable row level security;

-- Policies for Generations
create policy "Users can view own generations" on public.generations
  for select using (auth.uid() = user_id);

create policy "Users can insert own generations" on public.generations
  for insert using (auth.uid() = user_id); -- Backfill if needed, but usually API handles this with service role or user context

-- STORAGE BUCKET
-- Note: Buckets are usually created via UI or Storage API, but policy can be SQL.
insert into storage.buckets (id, name, public) values ('generations', 'generations', true);

-- Storage Policies
create policy "Public Access" on storage.objects for select
  using ( bucket_id = 'generations' );

create policy "Authenticated users can upload" on storage.objects for insert
  with check ( bucket_id = 'generations' and auth.role() = 'authenticated' );

-- FUNCTION TO DECREMENT CREDITS
create or replace function decrement_credits(user_id uuid)
returns void as $$
begin
  update public.profiles
  set credits = credits - 1
  where id = user_id and credits > 0;
end;
$$ language plpgsql security definer;
