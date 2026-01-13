'use client'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import VideoRoom from '@/components/VideoRoom'
import { Globe, Loader2, Shuffle, Sparkle, Video } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    transports: ["websocket"]
});


const Home = () => {

    const [status, setStatus] = useState('idle');
    const [roomId, setRoomId] = useState("");

    function handleSubmit() {
        socket.emit("start");
        setStatus("waiting");
    }

    function next() {
        socket.emit("next");
        window.location.reload();
    }

    

    useEffect(() => {
        socket.on("matched", ({ roomId }) => {
            console.log("Room id received: ", roomId);

            setRoomId(roomId);
            setStatus("chatting");
        });

        socket.on('waiting', () => {
            setStatus('waiting');
        })

        socket.on("partnerLeft", () => {
            window.location.reload();
        })

        return () => {
            socket.off("matched");
            socket.off('waiting');
        }
    }, [])

    return (
        <div>
            <Navbar show = {status !== 'chatting'} />
            <main className='relative min-h-screen w-full bg-linear-to-br from-black via-zinc-900 to-black text-white overflow-hidden'>
                <div className='absolute -top-32 -left-32 w-100 h-100 bg-purple-600/20 rounded-full blur-3xl'></div>
                <div className='absolute top-1/3 -right-32 w-100 h-100 bg-blue-600/20 rounded-full blur-3xl'></div>
                <AnimatePresence>
                    {status === 'idle' && <motion.div className=' relative z-10 flex flex-col text-center px-6 h-screen items-center justify-center'
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        exit={{ y: 40, opacity: 0 }}>
                        <div className='flex flex-row gap-5'>
                            <div className='mb-6 flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/10'><Sparkle /></div>
                            <div className='text-4xl mt-2 sm:text-5xl tracking-tight mb-3 font-bold'>Talk Orbit</div>

                        </div>
                        <p className='text-zinc-400 mb-8 max-w-md text-sm sm:text-base ml-10'>Anonymous chat conversation with strangers worldwide. No sign-up. No identity. Just pure connection!</p>
                        <motion.button className='flex gap-3 cursor-pointer items-center px-8 py-4 rounded-2xl bg-linear-to-r from-white to-zinc-200 text-black font-semibold text-lg shadow-xl'
                            onClick={handleSubmit}
                            whileHover={{ scale: 1.09 }}
                            whileTap={{ scale: 0.97 }}>
                            <Video /> Start Anonymous Chat
                        </motion.button>
                    </motion.div>}

                    {status === 'waiting' && <motion.div className='relative flex flex-col z-10 min-h-screen items-center justify-center gap-6'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        exit={{ opacity: 0 }}>

                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, ease: "linear", duration: 1.1 }}>
                            <Loader2 size={56} />
                        </motion.div>
                        <motion.p className='text-lg sm:text-xl text-zinc-400'
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, ease: "linear", duration: 1.1 }}>
                            Matching you with someone...
                        </motion.p>
                    </motion.div>}

                    {status === 'chatting' && roomId && (
                        <motion.div className='fixed inset-0 flex flex-col bg-black z-20'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7 }}
                            exit={{ opacity: 0 }}>

                            <div className='flex items-center justify-between px-4 sm:px-6 py-4 bg-black/60 backdrop-blur border-white/10 border-b'>
                                <div className='flex items-center gap-2 text-zinc-400 text-sm'>
                                    <Globe size={16}/>
                                    Talk Orbit | Connected
                                </div>
                                
                                <div>
                                    <motion.button className='flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white font-medium'
                                onClick={next}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                > <Shuffle size={16} />
                                    Next
                                </motion.button>

                                
                                </div>
                            </div>
                                <VideoRoom roomId={roomId} />
                            
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
        </div >
    )
}

export default Home
