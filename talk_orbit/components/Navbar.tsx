'use client'
import { Sparkle } from 'lucide-react'
import { motion } from 'motion/react'

const Navbar = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <motion.div className='fixed top-0 left-0 right-0 border-b z-30 bg-black/50 backdrop-blur border-white/10'
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 '>
        <span className='w-10 h-10 flex items-center justify-center rounded-xl bg-white/10'>
          <Sparkle size={20} color='white' />
        </span>
        <span className='text-lg font-semibold tracking-tight text-white'>Talk Orbit</span>
      </div>
    </motion.div>
  )
}

export default Navbar
