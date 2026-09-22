import { motion } from 'framer-motion'
import { PROFILE } from '../data'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="py-8 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-0"
          >
            <p className="text-gray-400 text-sm">
              © {year} {PROFILE.name}. All rights reserved.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-sm"
          >
            <p>The Future of Intelligent Innovation</p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}