import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { MapPin, Linkedin, Instagram, Twitter, Send } from 'lucide-react'
import { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, SOCIALS } from '../config'
import { PROFILE } from '../data'

const SOCIAL_ICONS = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
}

const inputClass =
  'bg-[#0f172a] text-white placeholder:text-gray-400 border border-neon-blue/50 rounded-lg p-4 transition-all duration-300 focus:outline-none focus:border-neon-blue focus:ring-0 w-full'

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const sending = status === 'sending'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formRef.current) return
    setStatus('sending')
    try {
      if (
        EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ||
        EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
        EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID'
      ) {
        console.error('EmailJS keys configure nahi hain. src/config.js me apni keys daalo.')
        setStatus('error')
        return
      }
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, {
        publicKey: EMAILJS_PUBLIC_KEY,
      })
      setStatus('sent')
      formRef.current.reset()
    } catch (err) {
      console.error('EmailJS Error:', err)
      setStatus('error')
    }
  }

  const lines = Array.from({ length: 10 })

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-tech-dark">
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(to_right,#0d1117_1px,transparent_1px),linear-gradient(to_bottom,#0d1117_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          {lines.map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-20"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: 0,
                right: 0,
                width: `${50 + Math.random() * 50}%`,
                marginLeft: `${Math.random() * 50}%`,
              }}
              animate={{ x: ['-100%', '100%'], opacity: [0, 0.2, 0] }}
              transition={{ duration: 8 + Math.random() * 10, repeat: Infinity, ease: 'linear', delay: Math.random() * 5 }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center font-exo text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white"
        >
          Let's Build the <span className="text-neon-blue">Future Together</span>
        </motion.h2>

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
          className="bg-dark-slate bg-opacity-70 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-800 relative overflow-hidden max-w-xl mx-auto"
        >
          <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-neon-blue/50 rounded-tl-md" />
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-neon-blue/50 rounded-tr-md" />
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-neon-blue/50 rounded-bl-md" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-neon-blue/50 rounded-br-md" />

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
                ✗ Something went wrong. EmailJS keys configure karo — check src/config.js.
              </p>
            )}

            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group w-full py-4 bg-neon-blue text-tech-dark rounded-md font-bold hover:bg-neon-blue/90 transition-all duration-300 border border-neon-blue overflow-hidden"
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
            <div className="flex space-x-6">
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.type] || Linkedin
                return (
                  <motion.a
                    key={s.type}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2 }}
                    className="text-gray-400 hover:text-neon-blue transition-all duration-300 hover:shadow-glow"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}