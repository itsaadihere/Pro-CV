-- Create template_history table
create table if not exists public.template_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  template_id text not null,
  used_at timestamptz default now()
);

-- Enable RLS
alter table public.template_history enable row level security;

-- Create RLS Policies
drop policy if exists "Users view own history" on public.template_history;
create policy "Users view own history" on public.template_history
  for select using (auth.uid() = user_id);

drop policy if exists "Users insert own history" on public.template_history;
create policy "Users insert own history" on public.template_history
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users delete own history" on public.template_history;
create policy "Users delete own history" on public.template_history
  for delete using (auth.uid() = user_id);

drop policy if exists "Service role can manage history" on public.template_history;
create policy "Service role can manage history" on public.template_history
  for all using (true);

-- Create index
create index if not exists idx_template_history_user on public.template_history(user_id);

-- Add template_used to cv_jobs
alter table public.cv_jobs
  add column if not exists template_used text;
