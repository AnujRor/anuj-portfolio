-- SEO fields for blog posts (admin "Blog posts" editor -> SEO card).
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- (Already included in schema.sql for fresh setups.)

alter table public.posts add column if not exists meta_title text not null default '';
alter table public.posts add column if not exists meta_description text not null default '';
alter table public.posts add column if not exists tags text[] not null default '{}';
