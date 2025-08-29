"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useSocket } from "@/hooks/use-socket"
import { Users, UserPlus } from "lucide-react"

interface FollowButtonProps {
  userId: string
  isFollowing?: boolean
  onFollowChange?: (following: boolean) => void
  size?: "sm" | "default" | "lg"
  className?: string
}

export function FollowButton({ 
  userId, 
  isFollowing: initialIsFollowing = false, 
  onFollowChange,
  size = "default",
  className = ""
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const socket = useSocket()

  const handleFollow = async () => {
    if (loading) return

    setLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "POST"
      })

      if (response.ok) {
        const data = await response.json()
        setFollowing(data.following)
        
        // Emit socket event for real-time updates
        if (socket && session?.user?.id && data.following) {
          socket.emit("user_followed", {
            followerId: session.user.id,
            followingId: userId,
            follow: {
              actor: { name: session.user.name },
              type: "FOLLOW"
            }
          })
        }
        
        if (onFollowChange) {
          onFollowChange(data.following)
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
    } finally {
      setLoading(false)
    }
  }

  if (size === "sm") {
    return (
      <Button 
        variant={following ? "outline" : "default"} 
        size="sm"
        onClick={handleFollow}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
        ) : following ? (
          <>
            <Users className="h-3 w-3 mr-1" />
            ফলো করছেন
          </>
        ) : (
          <>
            <UserPlus className="h-3 w-3 mr-1" />
            ফলো করুন
          </>
        )}
      </Button>
    )
  }

  return (
    <Button 
      variant={following ? "outline" : "default"} 
      onClick={handleFollow}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : following ? (
        <>
          <Users className="h-4 w-4 mr-2" />
          ফলো করছেন
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          ফলো করুন
        </>
      )}
    </Button>
  )
}