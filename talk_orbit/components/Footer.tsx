'use client';

const Footer = () => {
  return (
    <div className=" relative z-10 text-center backdrop-blur-2xl  py-6 text-xs text-zinc-500 bg-black/10 border-b border-white/10">
      &copy; {new Date().getFullYear()} Talk Orbit | Anonymous Video/Voice call | All Rights Reserved!
    </div>
  )
}

export default Footer
