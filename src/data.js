export const PROFILE = {
  name: 'Anuj',
  title: 'Anuj | AI Entrepreneur',
  heroType: 'I am Anuj',
  headline: 'The intelligence behind tomorrow\'s world',
  dreamer: '19-year-old Dreamer & Builder',
  from: 'from Harsola, Haryana',
  location: 'Harsola, Kaithal, Haryana, India',
  photo: '/assets/profile.svg',
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
        year: '2023',
        text: "Started experimenting with AI tools and discovered my passion and dream's.",
      },
      {
        year: '2024',
        text: 'Built my first real projects and began turning ideas into working products.',
      },
      {
        year: '2025',
        text: 'Actively developing five impactful projects: AI Dost, Ozy Sneakers, IQ World, AI Caption Generator, and Universal Downloader — building solutions that blend AI with real-world applications.',
      },
    ],
  },
  skills: [
    { name: 'OpenAI GPT', iconType: 'Bot' },
    { name: 'ElevenLabs', iconType: 'Volume2' },
    { name: 'Deepgram', iconType: 'Waveform' },
    { name: 'Cartesia AI', iconType: 'Heart' },
    { name: 'LiveKit', iconType: 'Video' },
    { name: 'Voice Assistants', iconType: 'Mic' },
    { name: 'RT Communication', iconType: 'MessageCircle' },
    { name: 'Solving Real Problems', iconType: 'Brain' },
    { name: 'Beyond the Code', iconType: 'Pencil' },
    { name: 'Building Minds, Not Just Apps', iconType: 'Lightbulb' },
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
    mainImage: '/assets/aidost-main.svg',
    images: ['/assets/aidost-1.svg', '/assets/aidost-2.svg', '/assets/aidost-3.svg', '/assets/aidost-4.svg'],
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
    mainImage: '/assets/ozy-main.svg',
    images: ['/assets/ozy-1.svg', '/assets/ozy-2.svg', '/assets/ozy-3.svg', '/assets/ozy-4.svg'],
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
    mainImage: '/assets/iqworld-main.svg',
    images: ['/assets/iqworld-1.svg', '/assets/iqworld-2.svg', '/assets/iqworld-3.svg', '/assets/iqworld-4.svg'],
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
    mainImage: '/assets/caption-main.svg',
    images: ['/assets/caption-1.svg', '/assets/caption-2.svg', '/assets/caption-3.svg', '/assets/caption-4.svg'],
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
    mainImage: '/assets/downloader-main.svg',
    images: ['/assets/downloader-1.svg', '/assets/downloader-2.svg', '/assets/downloader-3.svg', '/assets/downloader-4.svg'],
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