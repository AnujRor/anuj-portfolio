// Images were renamed to SEO-friendly names; rows saved before that still hold the old paths.
// Map them here so the site never shows a broken image (supabase/rename-images.sql fixes the rows themselves).
const RENAMED_ASSETS = {
  'aidost-main.svg': 'ai-dost-voice-ai-friend-cover.svg',
  'aidost-1.svg': 'ai-dost-voice-ai-friend-screenshot-1.svg',
  'aidost-2.svg': 'ai-dost-voice-ai-friend-screenshot-2.svg',
  'aidost-3.svg': 'ai-dost-voice-ai-friend-screenshot-3.svg',
  'aidost-4.svg': 'ai-dost-voice-ai-friend-screenshot-4.svg',
  'ozy-main.svg': 'ozy-sneakers-ai-ecommerce-store-cover.svg',
  'ozy-1.svg': 'ozy-sneakers-ai-ecommerce-store-screenshot-1.svg',
  'ozy-2.svg': 'ozy-sneakers-ai-ecommerce-store-screenshot-2.svg',
  'ozy-3.svg': 'ozy-sneakers-ai-ecommerce-store-screenshot-3.svg',
  'ozy-4.svg': 'ozy-sneakers-ai-ecommerce-store-screenshot-4.svg',
  'iqworld-main.svg': 'iq-world-sentence-brain-game-cover.svg',
  'iqworld-1.svg': 'iq-world-sentence-brain-game-screenshot-1.svg',
  'iqworld-2.svg': 'iq-world-sentence-brain-game-screenshot-2.svg',
  'iqworld-3.svg': 'iq-world-sentence-brain-game-screenshot-3.svg',
  'iqworld-4.svg': 'iq-world-sentence-brain-game-screenshot-4.svg',
  'caption-main.svg': 'ai-video-caption-generator-cover.svg',
  'caption-1.svg': 'ai-video-caption-generator-screenshot-1.svg',
  'caption-2.svg': 'ai-video-caption-generator-screenshot-2.svg',
  'caption-3.svg': 'ai-video-caption-generator-screenshot-3.svg',
  'caption-4.svg': 'ai-video-caption-generator-screenshot-4.svg',
  'downloader-main.svg': 'universal-video-downloader-cover.svg',
  'downloader-1.svg': 'universal-video-downloader-screenshot-1.svg',
  'downloader-2.svg': 'universal-video-downloader-screenshot-2.svg',
  'downloader-3.svg': 'universal-video-downloader-screenshot-3.svg',
  'downloader-4.svg': 'universal-video-downloader-screenshot-4.svg',
  'profile-hero.png': 'anuj-ai-entrepreneur.webp',
  'profile-hero.webp': 'anuj-ai-entrepreneur.webp',
  'profile-about.png': 'anuj-ai-builder-harsola-haryana.webp',
  'profile-about.webp': 'anuj-ai-builder-harsola-haryana.webp',
  'profile.svg': 'portfolio-placeholder.svg',
}
export const asset = (src) => {
  const name = src?.startsWith('/assets/') ? src.slice(8) : null
  return name && RENAMED_ASSETS[name] ? `/assets/${RENAMED_ASSETS[name]}` : src
}
