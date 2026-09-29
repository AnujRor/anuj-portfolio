-- GitHub -> Projects sync (supabase/functions/github-sync).
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run,
-- AFTER deploying the function (see README "GitHub sync").

-- Same as supabase/project-links.sql, repeated so this file works on its own
alter table public.projects add column if not exists repo_link text not null default '';
alter table public.projects add column if not exists status text not null default '';

-- Which GitHub repo a project row mirrors. Rows without github_id are manual projects and are never touched.
alter table public.projects add column if not exists github_id bigint unique;
alter table public.projects add column if not exists github_name text not null default '';
alter table public.projects add column if not exists github_pushed_at timestamptz;

-- Each synced repo also gets a blog post; github_id marks the posts the sync owns (other posts are never touched)
alter table public.posts add column if not exists github_id bigint unique;
-- Same as supabase/post-seo.sql, repeated so this file works on its own
alter table public.posts add column if not exists meta_title text not null default '';
alter table public.posts add column if not exists meta_description text not null default '';
alter table public.posts add column if not exists tags text[] not null default '{}';

-- Last run of the sync, shown in the admin Projects page
create table if not exists public.github_sync_state (
  id int primary key default 1 check (id = 1),
  last_run timestamptz,
  result jsonb not null default '{}'::jsonb
);
alter table public.github_sync_state enable row level security;
drop policy if exists "admin reads sync state" on public.github_sync_state;
create policy "admin reads sync state" on public.github_sync_state
  for select to authenticated using (public.is_admin());

-- Run the sync every minute
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('github-sync') where exists (select 1 from cron.job where jobname = 'github-sync');
select cron.schedule(
  'github-sync',
  '* * * * *',
  $$ select net.http_post(
       url := 'https://ibyllydtlizqujqlviru.supabase.co/functions/v1/github-sync',
       headers := '{"Content-Type": "application/json"}'::jsonb,
       body := '{}'::jsonb
     ) $$
);
