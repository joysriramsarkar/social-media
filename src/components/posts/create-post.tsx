"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { useSocket } from "@/hooks/use-socket"
import { Image, Video, Smile, MapPin, Calendar, X } from "lucide-react"

interface CreatePostProps {
  onPostCreated?: () => void
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const socket = useSocket()

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePost = async () => {
    if (!content.trim() && !selectedImage) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          image: selectedImage
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Emit socket event for real-time updates
        if (socket && session?.user?.id) {
          socket.emit("new_post", {
            authorId: session.user.id,
            post: data.post,
            followers: [] // This would be populated with actual follower IDs
          })
        }
        
        // Reset form
        setContent("")
        setSelectedImage(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        
        // Notify parent component
        if (onPostCreated) {
          onPostCreated()
        }
      } else {
        console.error("Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="কি চলছে? শেয়ার করুন..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] resize-none border-none p-0 focus-visible:ring-0 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
        </div>
        
        {/* Selected Image Preview */}
        {selectedImage && (
          <div className="mt-4 relative">
            <img 
              src={selectedImage} 
              alt="Selected image for upload" 
              className="w-full max-h-96 object-cover rounded-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full h-8 w-8 p-0"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {(content || selectedImage) && (
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={handlePost}
              disabled={isSubmitting || (!content.trim() && !selectedImage)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "পোস্ট হচ্ছে..." : "পোস্ট করুন"}
            </Button>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
                id="image-upload"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500 hover:text-blue-500"
                onClick={() => fileInputRef.current?.click()}
              >
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="h-4 w-4 mr-1" aria-hidden="true" />
                <span className="text-xs">ছবি</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                <Video className="h-4 w-4 mr-1" />
                <span className="text-xs">ভিডিও</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-yellow-500">
                <Smile className="h-4 w-4 mr-1" />
                <span className="text-xs">ইমোজি</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-xs">লোকেশন</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-xs">ইভেন্ট</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}