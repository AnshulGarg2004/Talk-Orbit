'use client'
import React, { useEffect, useRef } from 'react'

const VideoRoom = ({ roomId }: { roomId: string }) => {

    const zpRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("IM HRE");

        const start = async () => {
            const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

            console.log("here");

            const appId = process.env.NEXT_PUBLIC_ZEEGO_APP_ID;
            const serverSecret = process.env.NEXT_PUBLIC_ZEEGO_SERVER_SECRET!;
            const userId = crypto.randomUUID();
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(Number(appId), serverSecret, roomId, userId, "stranger");
            const zp = ZegoUIKitPrebuilt.create(kitToken);

            zpRef.current = zp;
            zpRef.current.joinRoom({
                container: containerRef.current,

                scenario: {
                    mode: ZegoUIKitPrebuilt.VideoConference,  // try videoConference
                },
                showPreJoinView: true,
                showTextChat: true,
                   // try removing it once

            });
            

            
        }
        start();
        return () => {
                if (zpRef.current) {
                    try {
                        zpRef.current.leaveRoom();
                        zpRef.current.destroy();
                    } catch (error) {
                        zpRef.current = null;
                    }
                }
            }
    }, [])

    return (
        <div ref={containerRef} className='w-full h-screen' />
    )
}

export default VideoRoom
