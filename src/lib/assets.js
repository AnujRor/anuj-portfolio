// Images were renamed to SEO-friendly names; rows saved before that still hold the old paths.
// Map them here so the site never shows a broken image (supabase/rename-images.sql fixes the rows themselves).
const RENAMED_ASSETS = {
  'aidost-main.svg': 'ai-dost-voice-ai-anuj-ror-cover.webp',
  'aidost-1.svg': 'ai-dost-voice-ai-anuj-ror-screenshot-1.webp',
  'aidost-2.svg': 'ai-dost-voice-ai-anuj-ror-screenshot-2.webp',
  'aidost-3.svg': 'ai-dost-voice-ai-anuj-ror-screenshot-3.webp',
  'aidost-4.svg': 'ai-dost-voice-ai-anuj-ror-screenshot-4.webp',
  'ozy-main.svg': 'ozy-sneakers-ecommerce-anuj-ror-cover.webp',
  'ozy-1.svg': 'ozy-sneakers-ecommerce-anuj-ror-screenshot-1.webp',
  'ozy-2.svg': 'ozy-sneakers-ecommerce-anuj-ror-screenshot-2.webp',
  'ozy-3.svg': 'ozy-sneakers-ecommerce-anuj-ror-screenshot-3.webp',
  'ozy-4.svg': 'ozy-sneakers-ecommerce-anuj-ror-screenshot-4.webp',
  'iqworld-main.svg': 'iq-world-brain-game-anuj-ror-cover.webp',
  'iqworld-1.svg': 'iq-world-brain-game-anuj-ror-screenshot-1.webp',
  'iqworld-2.svg': 'iq-world-brain-game-anuj-ror-screenshot-2.webp',
  'iqworld-3.svg': 'iq-world-brain-game-anuj-ror-screenshot-3.webp',
  'iqworld-4.svg': 'iq-world-brain-game-anuj-ror-screenshot-4.webp',
  'caption-main.svg': 'ai-video-caption-generator-anuj-ror-cover.webp',
  'caption-1.svg': 'ai-video-caption-generator-anuj-ror-screenshot-1.webp',
  'caption-2.svg': 'ai-video-caption-generator-anuj-ror-screenshot-2.webp',
  'caption-3.svg': 'ai-video-caption-generator-anuj-ror-screenshot-3.webp',
  'caption-4.svg': 'ai-video-caption-generator-anuj-ror-screenshot-4.webp',
  'downloader-main.svg': 'universal-video-downloader-anuj-ror-cover.webp',
  'downloader-1.svg': 'universal-video-downloader-anuj-ror-screenshot-1.webp',
  'downloader-2.svg': 'universal-video-downloader-anuj-ror-screenshot-2.webp',
  'downloader-3.svg': 'universal-video-downloader-anuj-ror-screenshot-3.webp',
  'downloader-4.svg': 'universal-video-downloader-anuj-ror-screenshot-4.webp',
  'profile-hero.png': 'anuj-ror-ai-developer-haryana.webp',
  'profile-hero.webp': 'anuj-ror-ai-developer-haryana.webp',
  'profile-about.png': 'anuj-ror-profile-photo.webp',
  'profile-about.webp': 'anuj-ror-profile-photo.webp',
  'anuj-ai-entrepreneur.webp': 'anuj-ror-ai-developer-haryana.webp',
  'anuj-ai-builder-harsola-haryana.webp': 'anuj-ror-profile-photo.webp',
  'profile.svg': 'portfolio-placeholder.webp',
}
export const asset = (src) => {
  const name = src?.startsWith('/assets/') ? src.slice(8) : null
  return name && RENAMED_ASSETS[name] ? `/assets/${RENAMED_ASSETS[name]}` : src
}
