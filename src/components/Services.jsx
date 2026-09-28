import { motion } from 'framer-motion'
import { AudioLines, Bot, Globe, Workflow } from 'lucide-react'
import { SectionTitle, SpotlightCard } from './fx'

const SERVICES = [
  {
    icon: AudioLines,
    title: 'Voice AI Agents',
    text: 'Real-time voice assistants that listen, understand and talk back naturally, for support lines, companions or hands-free tools.',
    tools: ['LiveKit', 'Deepgram', 'OpenAI', 'ElevenLabs'],
  },
  {
    icon: Bot,
    title: 'AI Chatbots & Assistants',
    text: 'Custom GPT-powered assistants trained on your content that answer questions and help your users around the clock.',
    tools: ['OpenAI', 'Prompt design', 'APIs'],
  },
  {
    icon: Workflow,
    title: 'AI Tools & Automation',
    text: 'Small, focused AI tools that remove repetitive work, like auto captions, content helpers and smart workflows.',
    tools: ['OpenAI', 'Deepgram', 'FFmpeg'],
  },
  {
    icon: Globe,
    title: 'Modern Websites',
    text: 'Fast, mobile-friendly and SEO-ready websites with an easy admin panel, just like this portfolio.',
    tools: ['React', 'Tailwind CSS', 'Supabase'],
  },
]

export default function Services() {
  return (
    <section id="services" className="cv-auto py-28 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle index="04" eyebrow="What I Can Build For You" accent="Services">
          My
        </SectionTitle>

        <div className="grid sm:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpotlightCard color={i % 2 ? '176, 38, 255' : '0, 246, 255'} className="h-full rounded-3xl glass p-6 md:p-8">
                <div className="relative">
                  <div className="w-12 h-12 mb-5 rounded-2xl flex items-center justify-center text-neon-blue border border-neon-blue/30 bg-neon-blue/5">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-exo text-xl md:text-2xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-light-gray leading-relaxed mb-5">{s.text}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.tools.map((t) => (
                      <span key={t} className="text-xs px-3 py-1 rounded-full text-white/80 border border-white/10 bg-tech-dark/60">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
