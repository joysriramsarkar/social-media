"use client"

import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { useSession } from "next-auth/react"

export function useSocket() {
  const { data: session } = useSession()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      // Initialize socket connection
      socketRef.current = io(process.env.NODE_ENV === "production" ? "" : "http://localhost:3000", {
        transports: ["websocket", "polling"]
      })

      const socket = socketRef.current

      // Authenticate user with socket
      socket.emit("authenticate", session.user.id)

      // Socket event listeners can be added here
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id)
      })

      socket.on("disconnect", () => {
        console.log("Socket disconnected")
      })

      // Cleanup on unmount
      return () => {
        socket.disconnect()
      }
    }
  }, [session?.user?.id])

  return socketRef.current
}