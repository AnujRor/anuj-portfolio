// Images were renamed to SEO-friendly names; rows saved before that still hold the old paths.
// Map them here so the site never shows a broken image (supabase/rename-images.sql fixes the rows themselves).
const RENAMED_ASSETS = {
  'aidost-main.svg': 'ai-dost-voice-ai-anuj-ror-cover.svg',
  'aidost-1.svg': 'ai-dost-voice-ai-anuj-ror-screenshot-1.svg',
  'aidost-2.svg': 'ai-dost-voice-ai-anuj-ror-screenshot-2.svg',
  'aidost-3.svg': 'ai-dost-voice-ai-anuj-ror-screenshot-3.svg',
  'aidost-4.svg': 'ai-dost-voice-ai-anuj-ror-screenshot-4.svg',
  'ozy-main.svg': 'ozy-sneakers-ecommerce-anuj-ror-cover.svg',
  'ozy-1.svg': 'ozy-sneakers-ecommerce-anuj-ror-screenshot-1.svg',
  'ozy-2.svg': 'ozy-sneakers-ecommerce-anuj-ror-screenshot-2.svg',
  'ozy-3.svg': 'ozy-sneakers-ecommerce-anuj-ror-screenshot-3.svg',
  'ozy-4.svg': 'ozy-sneakers-ecommerce-anuj-ror-screenshot-4.svg',
  'iqworld-main.svg': 'iq-world-brain-game-anuj-ror-cover.svg',
  'iqworld-1.svg': 'iq-world-brain-game-anuj-ror-screenshot-1.svg',
  'iqworld-2.svg': 'iq-world-brain-game-anuj-ror-screenshot-2.svg',
  'iqworld-3.svg': 'iq-world-brain-game-anuj-ror-screenshot-3.svg',
  'iqworld-4.svg': 'iq-world-brain-game-anuj-ror-screenshot-4.svg',
  'caption-main.svg': 'ai-video-caption-generator-anuj-ror-cover.svg',
  'caption-1.svg': 'ai-video-caption-generator-anuj-ror-screenshot-1.svg',
  'caption-2.svg': 'ai-video-caption-generator-anuj-ror-screenshot-2.svg',
  'caption-3.svg': 'ai-video-caption-generator-anuj-ror-screenshot-3.svg',
  'caption-4.svg': 'ai-video-caption-generator-anuj-ror-screenshot-4.svg',
  'downloader-main.svg': 'universal-video-downloader-anuj-ror-cover.svg',
  'downloader-1.svg': 'universal-video-downloader-anuj-ror-screenshot-1.svg',
  'downloader-2.svg': 'universal-video-downloader-anuj-ror-screenshot-2.svg',
  'downloader-3.svg': 'universal-video-downloader-anuj-ror-screenshot-3.svg',
  'downloader-4.svg': 'universal-video-downloader-anuj-ror-screenshot-4.svg',
  'profile-hero.png': 'anuj-ror-ai-developer-haryana.webp',
  'profile-hero.webp': 'anuj-ror-ai-developer-haryana.webp',
  'profile-about.png': 'anuj-ror-profile-photo.webp',
  'profile-about.webp': 'anuj-ror-profile-photo.webp',
  'profile.svg': 'portfolio-placeholder.svg',
}
export const asset = (src) => {
  const name = src?.startsWith('/assets/') ? src.slice(8) : null
  return name && RENAMED_ASSETS[name] ? `/assets/${RENAMED_ASSETS[name]}` : src
}
