-- Add is_beta_user to profiles
alter table public.profiles
  add column if not exists is_beta_user boolean default false;

-- Add is_beta_job to cv_jobs
alter table public.cv_jobs
  add column if not exists is_beta_job boolean default false;

-- Create beta_feedback table
create table if not exists public.beta_feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  job_id uuid references public.cv_jobs(id) on delete cascade,
  rating text not null,
  comment text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.beta_feedback enable row level security;

-- RLS Policies
create policy "Users can insert own feedback" on public.beta_feedback 
  for insert with check (auth.uid() = user_id);

create policy "Users can view own feedback" on public.beta_feedback 
  for select using (auth.uid() = user_id);

create policy "Service role can manage feedback" on public.beta_feedback 
  for all using (true);
