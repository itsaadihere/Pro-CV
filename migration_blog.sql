create table public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  meta_description text,
  content text,
  author_name text default 'Sophi Team',
  published boolean default false,
  featured_image text,
  word_count integer,
  primary_keyword text,
  published_at timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.blog_posts enable row level security;

create policy "Blog posts are publicly readable" on public.blog_posts
  for select using (published = true);

create policy "Service role can insert blog posts" on public.blog_posts
  for insert with check (true);
