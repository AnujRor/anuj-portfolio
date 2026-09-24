-- Points posts/projects at the renamed, SEO-friendly image files.
-- Run once in Supabase Dashboard -> SQL Editor. Safe to re-run (only exact old paths are changed).

begin;

drop table if exists asset_map;
create temp table asset_map (old text primary key, new text not null);
insert into asset_map (old, new) values
  ('/assets/aidost-main.svg', '/assets/ai-dost-voice-ai-friend-cover.svg'),
  ('/assets/aidost-1.svg', '/assets/ai-dost-voice-ai-friend-screenshot-1.svg'),
  ('/assets/aidost-2.svg', '/assets/ai-dost-voice-ai-friend-screenshot-2.svg'),
  ('/assets/aidost-3.svg', '/assets/ai-dost-voice-ai-friend-screenshot-3.svg'),
  ('/assets/aidost-4.svg', '/assets/ai-dost-voice-ai-friend-screenshot-4.svg'),
  ('/assets/ozy-main.svg', '/assets/ozy-sneakers-ai-ecommerce-store-cover.svg'),
  ('/assets/ozy-1.svg', '/assets/ozy-sneakers-ai-ecommerce-store-screenshot-1.svg'),
  ('/assets/ozy-2.svg', '/assets/ozy-sneakers-ai-ecommerce-store-screenshot-2.svg'),
  ('/assets/ozy-3.svg', '/assets/ozy-sneakers-ai-ecommerce-store-screenshot-3.svg'),
  ('/assets/ozy-4.svg', '/assets/ozy-sneakers-ai-ecommerce-store-screenshot-4.svg'),
  ('/assets/iqworld-main.svg', '/assets/iq-world-sentence-brain-game-cover.svg'),
  ('/assets/iqworld-1.svg', '/assets/iq-world-sentence-brain-game-screenshot-1.svg'),
  ('/assets/iqworld-2.svg', '/assets/iq-world-sentence-brain-game-screenshot-2.svg'),
  ('/assets/iqworld-3.svg', '/assets/iq-world-sentence-brain-game-screenshot-3.svg'),
  ('/assets/iqworld-4.svg', '/assets/iq-world-sentence-brain-game-screenshot-4.svg'),
  ('/assets/caption-main.svg', '/assets/ai-video-caption-generator-cover.svg'),
  ('/assets/caption-1.svg', '/assets/ai-video-caption-generator-screenshot-1.svg'),
  ('/assets/caption-2.svg', '/assets/ai-video-caption-generator-screenshot-2.svg'),
  ('/assets/caption-3.svg', '/assets/ai-video-caption-generator-screenshot-3.svg'),
  ('/assets/caption-4.svg', '/assets/ai-video-caption-generator-screenshot-4.svg'),
  ('/assets/downloader-main.svg', '/assets/universal-video-downloader-cover.svg'),
  ('/assets/downloader-1.svg', '/assets/universal-video-downloader-screenshot-1.svg'),
  ('/assets/downloader-2.svg', '/assets/universal-video-downloader-screenshot-2.svg'),
  ('/assets/downloader-3.svg', '/assets/universal-video-downloader-screenshot-3.svg'),
  ('/assets/downloader-4.svg', '/assets/universal-video-downloader-screenshot-4.svg'),
  ('/assets/profile-hero.png', '/assets/anuj-ai-entrepreneur.webp'),
  ('/assets/profile-hero.webp', '/assets/anuj-ai-entrepreneur.webp'),
  ('/assets/profile-about.png', '/assets/anuj-ai-builder-harsola-haryana.webp'),
  ('/assets/profile-about.webp', '/assets/anuj-ai-builder-harsola-haryana.webp'),
  ('/assets/profile.svg', '/assets/portfolio-placeholder.svg');

update public.posts p
set cover = m.new
from asset_map m
where p.cover = m.old;

update public.projects p
set images = (
  select array_agg(coalesce(m.new, i.img) order by i.ord)
  from unnest(p.images) with ordinality as i(img, ord)
  left join asset_map m on m.old = i.img
)
where exists (select 1 from unnest(p.images) x join asset_map m on m.old = x);

commit;

-- Check: should return 0 rows
select 'post' as kind, slug as name, cover as path from public.posts where cover in (select old from asset_map)
union all
select 'project', title, img from public.projects, unnest(images) img where img in (select old from asset_map);
