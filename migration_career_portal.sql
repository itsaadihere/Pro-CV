-- ─────────────────────────────────────────
-- RECRUITER / COMPANY PROFILES
-- ─────────────────────────────────────────
create table if not exists public.recruiter_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  company_name text,
  company_size text, -- "1-10", "11-50", "51-200", "201-1000", "1000+"
  industry text,
  location_city text,
  location_country text default 'Pakistan',
  website text,
  logo_url text,
  description text, -- company about section
  is_verified boolean default false,
  is_active boolean default true,
  plan text default 'free', -- free | starter | pro
  job_post_credits integer default 2, -- free plan gets 2 job posts
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.recruiter_profiles enable row level security;
drop policy if exists "Recruiters view own profile" on public.recruiter_profiles;
create policy "Recruiters view own profile"
  on public.recruiter_profiles for select using (auth.uid() = id);

drop policy if exists "Recruiters update own profile" on public.recruiter_profiles;
create policy "Recruiters update own profile"
  on public.recruiter_profiles for update using (auth.uid() = id);

drop policy if exists "Public can view recruiter profiles" on public.recruiter_profiles;
create policy "Public can view recruiter profiles"
  on public.recruiter_profiles for select using (is_active = true);


-- ─────────────────────────────────────────
-- JOB LISTINGS
-- ─────────────────────────────────────────
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  recruiter_id uuid references public.recruiter_profiles(id) on delete cascade,
  title text not null,
  company_name text not null,
  company_logo_url text,
  location_city text,
  location_country text default 'Pakistan',
  location_type text default 'onsite', -- onsite | remote | hybrid
  employment_type text default 'full-time', -- full-time | part-time | contract | internship | freelance
  industry text,
  department text,
  experience_level text, -- entry | mid | senior | lead | director
  experience_years_min integer default 0,
  experience_years_max integer,
  salary_min integer, -- in PKR
  salary_max integer,
  salary_currency text default 'PKR',
  salary_visible boolean default true,
  description text not null, -- full job description
  requirements text, -- bullet list of requirements
  responsibilities text, -- bullet list of responsibilities
  benefits text,
  keywords text[], -- ATS keywords extracted from JD
  application_email text, -- where to send applications
  application_url text, -- external apply link (optional)
  apply_via_sophi boolean default true, -- apply inside Sophi platform
  status text default 'active', -- active | paused | closed | draft
  views_count integer default 0,
  applications_count integer default 0,
  featured boolean default false,
  expires_at timestamptz default (now() + interval '30 days'),
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_jobs_industry on public.jobs(industry);
create index if not exists idx_jobs_location on public.jobs(location_city);
create index if not exists idx_jobs_keywords on public.jobs using gin(keywords);

alter table public.jobs enable row level security;
drop policy if exists "Public can view active jobs" on public.jobs;
create policy "Public can view active jobs"
  on public.jobs for select using (status = 'active' and expires_at > now());

drop policy if exists "Recruiters manage own jobs" on public.jobs;
create policy "Recruiters manage own jobs"
  on public.jobs for all using (auth.uid() = recruiter_id);


-- ─────────────────────────────────────────
-- JOB APPLICATIONS
-- ─────────────────────────────────────────
create table if not exists public.job_applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete cascade,
  applicant_id uuid references public.profiles(id) on delete cascade,
  cv_job_id uuid references public.cv_jobs(id), -- which Sophi CV they applied with
  cover_letter text,
  status text default 'applied', -- applied | viewed | shortlisted | interview | rejected | hired
  match_score integer, -- 0-100: how well their CV keywords match job keywords
  recruiter_notes text,
  applied_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(job_id, applicant_id) -- prevent duplicate applications
);

alter table public.job_applications enable row level security;
drop policy if exists "Applicants view own applications" on public.job_applications;
create policy "Applicants view own applications"
  on public.job_applications for select using (auth.uid() = applicant_id);

drop policy if exists "Applicants insert own applications" on public.job_applications;
create policy "Applicants insert own applications"
  on public.job_applications for insert with check (auth.uid() = applicant_id);

drop policy if exists "Recruiters view applications for their jobs" on public.job_applications;
create policy "Recruiters view applications for their jobs"
  on public.job_applications for select
  using (exists (
    select 1 from public.jobs
    where jobs.id = job_applications.job_id
    and jobs.recruiter_id = auth.uid()
  ));

drop policy if exists "Recruiters update application status" on public.job_applications;
create policy "Recruiters update application status"
  on public.job_applications for update
  using (exists (
    select 1 from public.jobs
    where jobs.id = job_applications.job_id
    and jobs.recruiter_id = auth.uid()
  ));


-- ─────────────────────────────────────────
-- SAVED JOBS (Bookmarks)
-- ─────────────────────────────────────────
create table if not exists public.saved_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete cascade,
  saved_at timestamptz default now(),
  unique(user_id, job_id)
);

alter table public.saved_jobs enable row level security;
drop policy if exists "Users manage own saved jobs" on public.saved_jobs;
create policy "Users manage own saved jobs"
  on public.saved_jobs for all using (auth.uid() = user_id);


-- ─────────────────────────────────────────
-- JOB RECOMMENDATIONS (Precomputed)
-- ─────────────────────────────────────────
create table if not exists public.job_recommendations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  job_id uuid references public.jobs(id) on delete cascade,
  match_score integer not null, -- 0-100
  matched_keywords text[], -- which keywords matched
  generated_at timestamptz default now()
);

create index if not exists idx_recommendations_user on public.job_recommendations(user_id, match_score desc);

alter table public.job_recommendations enable row level security;
drop policy if exists "Users view own recommendations" on public.job_recommendations;
create policy "Users view own recommendations"
  on public.job_recommendations for select using (auth.uid() = user_id);


-- ─────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  type text not null, -- job_match | application_update | new_job_alert | cv_ready
  title text not null,
  body text,
  data jsonb, -- { job_id, application_id, etc }
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;
drop policy if exists "Users view own notifications" on public.notifications;
create policy "Users view own notifications"
  on public.notifications for select using (auth.uid() = user_id);

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications"
  on public.notifications for update using (auth.uid() = user_id);


-- ─────────────────────────────────────────
-- PUSH NOTIFICATION TOKEN IN PROFILES
-- ─────────────────────────────────────────
alter table public.profiles
  add column if not exists expo_push_token text;
