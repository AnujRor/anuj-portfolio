export const PROFILE = {
  name: 'Anuj',
  title: 'Anuj | AI Entrepreneur',
  heroType: 'I am Anuj',
  headline: 'The intelligence behind tomorrow\'s world',
  dreamer: '19-year-old Dreamer & Builder',
  from: 'from Harsola, Haryana',
  location: 'Harsola, Kaithal, Haryana, India',
  photo: '/assets/anuj-ai-entrepreneur.webp',
  aboutPhoto: '/assets/anuj-ai-builder-harsola-haryana.webp',
  about: {
    paragraphs: [
      'Growing up in a small village in Haryana, a place where the idea of building artificial intelligence felt like a distant dream. But even as a kid, I never thought like the people around me. While others talked about jobs and safety, I dreamt about creating something the world had never seen.',
      'While others chased certificates, I spent nights teaching myself everything I needed to build solutions that truly matter.',
      "That's how my AI friend — AI Dost — was born. Not just as an AI project, but as a companion that talks, listens and helps like a real friend. I'm building a world where technology doesn't just work for you — it stays by your side.",
      'I may not have a formal education, but I have a global vision — to build technology that touches hearts, that brings comfort, and that makes people believe again. I\'m not here to fit in.',
    ],
    closing: "I'm here to create something the world will never forget.",
    story: [
      "I'm not from a coding background. I didn't study AI in college. But I built it anyway.",
      'With zero funding, no team, and just a vision — I created intelligent systems that can speak, feel, and help. My journey has been fueled by relentless curiosity and the desire to build something meaningful.',
      'My journey from Harsola to the future is driven by one thing: unshakable belief in solving real problems. I believe that technology should serve humanity, not the other way around.',
    ],
    timeline: [
      {
        year: '2024',
        text: '10th pass out',
      },
      {
        year: '2025',
        text: "Started experimenting with AI tools and discovered my passion and dream's.",
      },
      {
        year: '2026',
        text: 'Actively developing five impactful projects: AI Dost, Ozy Sneakers, IQ World, AI Caption Generator, and Universal Downloader — building solutions that blend AI with real-world applications.',
      },
    ],
  },
  skills: [
    { name: 'OpenAI GPT', iconType: 'Bot', image: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128' },
    { name: 'ElevenLabs', iconType: 'Volume2', image: 'https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128' },
    { name: 'Deepgram', iconType: 'Waveform', image: 'https://www.google.com/s2/favicons?domain=deepgram.com&sz=128' },
    { name: 'Cartesia AI', iconType: 'Heart', image: 'https://www.google.com/s2/favicons?domain=cartesia.ai&sz=128' },
    { name: 'LiveKit', iconType: 'Video', image: 'https://www.google.com/s2/favicons?domain=livekit.io&sz=128' },
    { name: 'Voice Assistants', iconType: 'Mic', image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f5e3.png' },
    { name: 'RT Communication', iconType: 'MessageCircle', image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f4ac.png' },
    { name: 'Solving Real Problems', iconType: 'Brain', image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f9e0.png' },
    { name: 'Beyond the Code', iconType: 'Pencil', image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f680.png' },
    { name: 'Building Minds, Not Just Apps', iconType: 'Lightbulb', image: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/1f4a1.png' },
  ],
  stats: [
    { value: 50, suffix: '+', label: 'AI Tools Mastered' },
    { value: 1000, suffix: '+', label: 'Development Hours' },
    { value: 10, suffix: '+', label: 'Pioneering Solutions' },
  ],
  vision: [
    "I don't follow systems.",
    'I design new ones.',
    "I don't build resumes.",
    'I build revolutions.',
    "I don't chase trends.",
    'I define futures.',
  ],
}

export const PROJECTS = [
  {
    id: 1,
    title: 'AI Dost',
    description: "Your personal AI friend that talks and works with you like a real dost.",
    longDescription: `
AI Dost is more than an assistant — it's a friend who is always there for you.
It talks, listens, understands, and helps you with almost anything — just like a real friend.
Built with the latest AI voice and language models, it learns your preferences and behaves naturally.
Next, every model will be custom-trained to deliver ultra-realistic, empathetic interactions.`,
    mainImage: '/assets/ai-dost-voice-ai-friend-cover.svg',
    images: ['/assets/ai-dost-voice-ai-friend-screenshot-1.svg', '/assets/ai-dost-voice-ai-friend-screenshot-2.svg', '/assets/ai-dost-voice-ai-friend-screenshot-3.svg', '/assets/ai-dost-voice-ai-friend-screenshot-4.svg'],
    tag: 'Flagship',
    tagColor: 'neon-blue',
    techStack: [
      'LiveKit (real-time audio/video)',
      'Deepgram (speech-to-text)',
      'OpenAI (NLP & reasoning)',
      'ElevenLabs (voice cloning)',
    ],
    features: [
      'Instant, emotion-aware voice chats',
      'Talks and works like a trusted real friend',
      'Adaptive emotional responses',
      'Multi-language support with natural accents',
      'Future: bespoke AI models for next-level realism',
    ],
    demoLink: '#',
  },
  {
    id: 2,
    title: 'Ozy Sneakers',
    description: 'AI-powered e-commerce store for sneaker lovers.',
    longDescription: `
Ozy Sneakers is a full e-commerce website built to make sneaker shopping effortless.
Browse the latest kicks, get AI-powered style suggestions, and complete secure one-click checkouts.
From hot drops to classic fits, Ozy Sneakers brings the sneaker culture to your doorstep.`,
    mainImage: '/assets/ozy-sneakers-ai-ecommerce-store-cover.svg',
    images: ['/assets/ozy-sneakers-ai-ecommerce-store-screenshot-1.svg', '/assets/ozy-sneakers-ai-ecommerce-store-screenshot-2.svg', '/assets/ozy-sneakers-ai-ecommerce-store-screenshot-3.svg', '/assets/ozy-sneakers-ai-ecommerce-store-screenshot-4.svg'],
    tag: 'E-Commerce',
    tagColor: 'purple-500',
    techStack: [
      'React & Tailwind (UI)',
      'Secure Payment Integration',
      'AI Product Recommendations',
      'Inventory & Order Management',
    ],
    features: [
      'Curated sneaker catalog with live inventory',
      'AI-powered style & size recommendations',
      'Secure, one-click checkout experience',
      'Real-time order tracking dashboard',
      'Responsive & mobile-first storefront',
    ],
    demoLink: '#',
  },
  {
    id: 3,
    title: 'IQ World',
    description: 'A brain game where you pick the right words to build sentences.',
    longDescription: `
IQ World challenges your brain: choose the correct words from a mix and arrange them into meaningful sentences.
Each level adds new puzzles, faster timers, and smarter scoring, keeping your mind sharp while you play.
Built with a custom game engine for smooth, addictive gameplay.`,
    mainImage: '/assets/iq-world-sentence-brain-game-cover.svg',
    images: ['/assets/iq-world-sentence-brain-game-screenshot-1.svg', '/assets/iq-world-sentence-brain-game-screenshot-2.svg', '/assets/iq-world-sentence-brain-game-screenshot-3.svg', '/assets/iq-world-sentence-brain-game-screenshot-4.svg'],
    tag: 'Gaming',
    tagColor: 'green-500',
    techStack: [
      'Custom Game Engine',
      'Word & Sentence AI Models',
      'Multi-level Progression System',
      'React & Tailwind (UI)',
    ],
    features: [
      'Select correct words to form perfect sentences',
      'Unlimited levels with increasing difficulty',
      'Score, streaks & leaderboard tracking',
      'Multiple categories & languages',
      'Smooth, addictive brain-training gameplay',
    ],
    demoLink: '#',
  },
  {
    id: 4,
    title: 'AI Caption Generator',
    description: 'Automatically adds captions to any video using AI.',
    longDescription: `
AI Caption Generator transforms any video into a fully captioned masterpiece.
Upload any video and our AI instantly understands the speech, adds accurate subtitles, and styles them beautifully.
Perfect for reels, shorts, tutorials, and YouTube — captions in seconds, not hours.`,
    mainImage: '/assets/ai-video-caption-generator-cover.svg',
    images: ['/assets/ai-video-caption-generator-screenshot-1.svg', '/assets/ai-video-caption-generator-screenshot-2.svg', '/assets/ai-video-caption-generator-screenshot-3.svg', '/assets/ai-video-caption-generator-screenshot-4.svg'],
    tag: 'Creativity',
    tagColor: 'orange-500',
    techStack: [
      'Deepgram (speech-to-text)',
      'OpenAI (translation & styling)',
      'FFmpeg (video rendering)',
      'React & Tailwind (UI)',
    ],
    features: [
      'Auto captions for any video in seconds',
      'Multi-language subtitle generation',
      'Custom styles, colors & fonts',
      'Burn-in or SRT subtitle export',
      'Batch processing for multiple videos',
    ],
    demoLink: '#',
  },
  {
    id: 5,
    title: 'Universal Downloader',
    description: 'One tool to download videos from almost any platform.',
    longDescription: `
Universal Downloader is the all-in-one video downloader — paste any link and grab your video instantly.
Supports hundreds of platforms with multiple quality options, from HD to audio-only.`
      .trim(),
    mainImage: '/assets/universal-video-downloader-cover.svg',
    images: ['/assets/universal-video-downloader-screenshot-1.svg', '/assets/universal-video-downloader-screenshot-2.svg', '/assets/universal-video-downloader-screenshot-3.svg', '/assets/universal-video-downloader-screenshot-4.svg'],
    tag: 'Utility',
    tagColor: 'sky-500',
    techStack: [
      'Multi-platform Parsing Engine',
      'Adaptive Bitrate Streaming',
      'Audio & Video Extraction',
      'React & Tailwind (UI)',
    ],
    features: [
      'Paste any link to download instantly',
      'Supports hundreds of platforms',
      'Multiple quality options (HD to audio)',
      'Fast, batched parallel downloads',
      'Clean and simple interface',
    ],
    demoLink: '#',
  },
]
// Blog posts — edit, add or remove freely. `content` is a list of blocks:
// plain strings become paragraphs, { h: '...' } becomes a heading, { quote: '...' } a pull quote.
export const BLOG_POSTS = [
  {
    slug: 'from-harsola-to-ai',
    title: 'From Harsola to AI: How a Village Kid Started Building Intelligence',
    excerpt: 'No college, no team, no funding — just curiosity and a laptop. This is how my journey into artificial intelligence began.',
    date: '2026-09-10',
    readTime: '5 min read',
    category: 'Journey',
    cover: '/assets/anuj-ai-entrepreneur.webp',
    content: [
      'Growing up in Harsola, a small village in Haryana, building artificial intelligence felt like something that only happened in big cities and bigger companies. But I never stopped asking one question: why not me?',
      { h: 'The first spark' },
      'In 2025 I started experimenting with AI tools. At first it was just curiosity — what can these models actually do? Very quickly curiosity turned into obsession. I spent nights learning, breaking things and building them again.',
      { quote: "I didn't study AI in college. But I built it anyway." },
      { h: 'What I learned' },
      'You don\'t need permission to start. The internet is the biggest university in the world, and every tool you need is one search away. What you do need is consistency — showing up every single day, even when nothing works.',
      'This blog is where I\'ll share everything I learn along the way: the wins, the failures and the lessons in between.',
    ],
  },
  {
    slug: 'building-ai-dost',
    title: 'Building AI Dost: An AI That Talks Like a Real Friend',
    excerpt: 'The story behind my flagship project — a voice AI companion that listens, speaks and actually cares.',
    date: '2026-08-22',
    readTime: '6 min read',
    category: 'Projects',
    cover: '/assets/ai-dost-voice-ai-friend-cover.svg',
    content: [
      'AI Dost started with a simple idea: what if technology didn\'t just work for you, but stayed by your side like a friend?',
      { h: 'Why voice?' },
      'Typing to an AI feels like using a tool. Talking to one feels like a conversation. That\'s why I built AI Dost around real-time voice — so it feels natural, human and warm.',
      { h: 'The stack' },
      'Under the hood AI Dost combines large language models for thinking, speech-to-text for listening, and expressive text-to-speech for talking — all streamed in real time so the conversation never feels slow.',
      { quote: 'The goal isn\'t to build a smarter chatbot. It\'s to build a better friend.' },
      'There\'s still a long way to go, but every version gets a little more human.',
    ],
  },
  {
    slug: 'real-time-voice-ai-lessons',
    title: '5 Lessons From Building Real-Time Voice AI',
    excerpt: 'Latency, interruptions, emotions — the hard parts nobody tells you about when you build a voice assistant.',
    date: '2026-07-30',
    readTime: '4 min read',
    category: 'Tech',
    cover: '/assets/ai-video-caption-generator-cover.svg',
    content: [
      'Building a voice assistant that feels natural is much harder than it looks. Here are the biggest lessons I\'ve learned so far.',
      { h: '1. Latency is everything' },
      'If the reply takes more than a second, the magic breaks. Streaming every step — listening, thinking and speaking — is the only way to make it feel alive.',
      { h: '2. People interrupt' },
      'Real conversations aren\'t turn-based. Your assistant has to stop talking the moment the user starts.',
      { h: '3. Voice carries emotion' },
      'The same sentence can sound caring or cold. Choosing the right voice matters as much as choosing the right model.',
      { h: '4. Keep answers short' },
      'What reads well on a screen sounds far too long out loud. Spoken answers need to be short and direct.',
      { h: '5. Ship, then improve' },
      'No version is perfect. Put it in front of real people, listen, and make it better every day.',
    ],
  },
]
