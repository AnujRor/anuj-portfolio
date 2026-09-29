-- Portfolio admin schema
-- Run this whole file once in Supabase Dashboard -> SQL Editor -> New query -> Run.

-- ---------- Admins ----------
-- Only users listed here can write content or read messages.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- ---------- Blog posts ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover text not null default '',
  category text not null default 'General',
  read_time text not null default '3 min read',
  meta_title text not null default '',
  meta_description text not null default '',
  tags text[] not null default '{}',
  github_id bigint unique,
  published boolean not null default false,
  published_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.posts enable row level security;

drop policy if exists "public reads published posts" on public.posts;
create policy "public reads published posts" on public.posts
  for select using (published or public.is_admin());

drop policy if exists "admin writes posts" on public.posts;
create policy "admin writes posts" on public.posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text not null default '',
  description text not null default '',
  long_description text not null default '',
  images text[] not null default '{}',
  features text[] not null default '{}',
  tech_stack text[] not null default '{}',
  demo_link text not null default '#',
  repo_link text not null default '',
  status text not null default '',
  github_id bigint unique,
  github_name text not null default '',
  github_pushed_at timestamptz,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;

drop policy if exists "public reads published projects" on public.projects;
create policy "public reads published projects" on public.projects
  for select using (published or public.is_admin());

drop policy if exists "admin writes projects" on public.projects;
create policy "admin writes projects" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Contact messages ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  message text not null check (char_length(message) between 1 and 5000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;

drop policy if exists "anyone can send a message" on public.messages;
create policy "anyone can send a message" on public.messages
  for insert to anon, authenticated with check (read = false);

drop policy if exists "admin manages messages" on public.messages;
create policy "admin manages messages" on public.messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Editable site sections (Hero, About Me, My Journey) ----------
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

drop policy if exists "public reads site content" on public.site_content;
create policy "public reads site content" on public.site_content
  for select using (true);

drop policy if exists "admin writes site content" on public.site_content;
create policy "admin writes site content" on public.site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- updated_at trigger ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch before update on public.site_content
  for each row execute function public.touch_updated_at();

-- ---------- Image storage ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public reads media" on storage.objects;
create policy "public reads media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "admin uploads media" on storage.objects;
create policy "admin uploads media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin updates media" on storage.objects;
create policy "admin updates media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin deletes media" on storage.objects;
create policy "admin deletes media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ---------- Make yourself admin ----------
-- 1. Supabase Dashboard -> Authentication -> Users -> "Add user" (email + password, tick "Auto confirm").
-- 2. Then run (replace the email with the one you just created):
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'YOUR_EMAIL_HERE';
