import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { MapPin, Linkedin, Instagram, Twitter, Send } from 'lucide-react'
import { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, SOCIALS } from '../config'
import { PROFILE } from '../data'
import { hasSupabase, supabaseRest } from '../lib/content'
import { Magnetic, SectionTitle } from './fx'

const SOCIAL_ICONS = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
}

const inputClass =
  'bg-tech-dark/60 text-white placeholder:text-gray-500 border border-white/10 rounded-xl p-4 transition-all duration-300 focus:outline-none focus:border-neon-blue focus:bg-tech-dark/90 focus:shadow-[0_0_0_4px_rgba(0,246,255,0.12)] hover:border-neon-blue/40 w-full'

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const sending = status === 'sending'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formRef.current) return
    setStatus('sending')
    const emailjsReady =
      EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' && EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID'
    const form = new FormData(formRef.current)

    // Save to the admin inbox (Supabase) and/or email it (EmailJS) — success if either works
    const jobs = []
    if (hasSupabase) {
      jobs.push(
        supabaseRest('messages', {
          method: 'POST',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify({ name: form.get('user_name'), email: form.get('user_email'), message: form.get('message') }),
        }),
      )
    }
    if (emailjsReady) {
      jobs.push(emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, { publicKey: EMAILJS_PUBLIC_KEY }))
    }
    if (!jobs.length) {
      console.error('Na Supabase na EmailJS configure hai. .env.local ya src/config.js me keys daalo.')
      setStatus('error')
      return
    }

    const results = await Promise.allSettled(jobs)
    results.filter((r) => r.status === 'rejected').forEach((r) => console.error('Contact form error:', r.reason))
    if (results.some((r) => r.status === 'fulfilled')) {
      setStatus('sent')
      formRef.current.reset()
    } else {
      setStatus('error')
    }
  }

  // Random positions/speeds are fixed once so re-renders do not restart the sweeps
  const [lines] = useState(() =>
    Array.from({ length: 10 }, () => ({
      top: `${10 + Math.random() * 80}%`,
      width: `${50 + Math.random() * 50}%`,
      marginLeft: `${Math.random() * 50}%`,
      animationDuration: `${8 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 5}s`,
    })),
  )

  return (
    <section id="contact" className="cv-auto py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(to_right,#0d1117_1px,transparent_1px),linear-gradient(to_bottom,#0d1117_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          {lines.map((line, i) => (
            <div key={i} className="absolute h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent animate-sweep" style={line} />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle index="05" eyebrow="Get in touch" accent="Future Together" className="!mb-6">
          Let's Build the
        </SectionTitle>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-light-gray mb-16 max-w-2xl mx-auto"
        >
          Have a project idea? Want to collaborate? Let's connect and make something extraordinary.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="border-spin glass p-8 md:p-10 rounded-3xl shadow-[0_30px_100px_-30px_rgba(0,246,255,0.35)] relative overflow-hidden max-w-xl mx-auto"
        >

          <form ref={formRef} onSubmit={handleSubmit} className="grid gap-6">
            <div>
              <label htmlFor="user_name" className="text-white font-medium block mb-2">
                Full Name
              </label>
              <input id="user_name" name="user_name" type="text" required placeholder="Enter your name" className={inputClass} />
            </div>
            <div>
              <label htmlFor="user_email" className="text-white font-medium block mb-2">
                Email Address
              </label>
              <input id="user_email" name="user_email" type="email" required placeholder="Enter your email" className={inputClass} />
            </div>
            <div>
              <label htmlFor="message" className="text-white font-medium block mb-2">
                Message
              </label>
              <textarea id="message" name="message" rows={5} required placeholder="Tell me about your project or idea" className={`${inputClass} resize-none`} />
            </div>

            {status === 'sent' && <p className="text-green-400">✓ Your message has been sent!</p>}
            {status === 'error' && (
              <p className="text-red-400">
                ✗ Something went wrong. Please try again in a moment.
              </p>
            )}

            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group w-full py-4 bg-neon-blue text-tech-dark rounded-xl font-bold hover:bg-neon-blue/90 transition-all duration-300 border border-neon-blue overflow-hidden"
              >
                <div className="absolute inset-0 rounded-md blur-md bg-neon-blue opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center justify-center">
                  {sending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2-647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </form>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t border-gray-700/50 pt-8">
            <p className="text-light-gray text-sm flex items-center mb-4 sm:mb-0">
              <MapPin className="w-4 h-4 mr-2 text-neon-blue" />
              {PROFILE.location}
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.type] || Linkedin
                return (
                  <Magnetic key={s.type} strength={0.5}>
                    <motion.a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.type}
                      whileHover={{ rotate: -8 }}
                      className="flex w-11 h-11 items-center justify-center rounded-full glass text-gray-300 hover:text-tech-dark hover:bg-neon-blue hover:shadow-glow transition-colors duration-300"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  </Magnetic>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}