-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  has_paid boolean default false,
  payment_ref text,
  paid_at timestamptz,
  cv_credits integer default 0,
  created_at timestamptz default now()
);

-- CV Jobs table
create table public.cv_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  status text default 'pending', -- pending | processing | completed | failed
  original_file_path text,
  target_industry text,
  target_job_description text,
  output_language text default 'EN',
  ats_score jsonb,
  generated_cv text,
  linkedin_optimizer jsonb,
  cover_letter text,
  gap_analysis jsonb,
  pdf_output_path text,
  email_sent boolean default false,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.cv_jobs enable row level security;

-- RLS Policies for Profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Service role can manage profiles" on public.profiles for all using (true);

-- RLS Policies for CV Jobs
create policy "Users can view own jobs" on public.cv_jobs for select using (auth.uid() = user_id);
create policy "Users can insert own jobs" on public.cv_jobs for insert with check (auth.uid() = user_id);
create policy "Users can update own jobs" on public.cv_jobs for update using (auth.uid() = user_id);
create policy "Service role can manage jobs" on public.cv_jobs for all using (true);

-- Trigger to automatically create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, has_paid, cv_credits)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    false,
    0
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Sophi Beta Mode Schema Extensions
alter table public.profiles
  add column if not exists is_beta_user boolean default false;

alter table public.cv_jobs
  add column if not exists is_beta_job boolean default false;

create table if not exists public.beta_feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  job_id uuid references public.cv_jobs(id) on delete cascade,
  rating text not null,
  comment text,
  created_at timestamptz default now()
);

alter table public.beta_feedback enable row level security;

create policy "Users can insert own feedback" on public.beta_feedback 
  for insert with check (auth.uid() = user_id);

create policy "Users can view own feedback" on public.beta_feedback 
  for select using (auth.uid() = user_id);

create policy "Service role can manage feedback" on public.beta_feedback 
  for all using (true);

