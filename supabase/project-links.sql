-- GitHub link + status for projects (admin "Projects" page).
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- (Already included in schema.sql for fresh setups.)

alter table public.projects add column if not exists repo_link text not null default '';
alter table public.projects add column if not exists status text not null default '';
