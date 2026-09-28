-- Editable website sections (Hero, About Me, My Journey) for the admin "img" page.
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- (Already included in schema.sql for fresh setups.)

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

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch before update on public.site_content
  for each row execute function public.touch_updated_at();
