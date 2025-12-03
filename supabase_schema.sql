-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  plan text default 'free',
  credits_used int default 0,
  max_credits int default 5,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- HISTORY TABLE
create table public.history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  type text not null,
  details jsonb not null,
  result jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.history enable row level security;

create policy "Users can view own history" on public.history
  for select using (auth.uid() = user_id);

create policy "Users can insert own history" on public.history
  for insert with check (auth.uid() = user_id);

-- SAVED PROPERTIES TABLE
create table public.saved_properties (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  property_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.saved_properties enable row level security;

create policy "Users can view own saved properties" on public.saved_properties
  for select using (auth.uid() = user_id);

create policy "Users can insert own saved properties" on public.saved_properties
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own saved properties" on public.saved_properties
  for delete using (auth.uid() = user_id);

-- TRIGGER FOR NEW USERS
-- This ensures a profile is created when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
