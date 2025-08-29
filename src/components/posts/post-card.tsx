"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { useSocket } from "@/hooks/use-socket"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Send,
  X
} from "lucide-react"

interface Post {
  id: string
  content: string
  image?: string
  createdAt: string
  author: {
    id: string
    name: string
    username: string
    avatar?: string
  }
  _count: {
    likes: number
    comments: number
  }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    username: string
    avatar?: string
  }
}

interface PostCardProps {
  post: Post
  onPostUpdate?: () => void
}

export function PostCard({ post, onPostUpdate }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loadingComments, setLoadingComments] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [togglingLike, setTogglingLike] = useState(false)
  const { data: session } = useSession()
  const socket = useSocket()

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "এইমাত্র"
    if (diffInMinutes < 60) return `${diffInMinutes} মিনিট আগে`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} ঘন্টা আগে`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} দিন আগে`
    
    return date.toLocaleDateString("bn-BD")
  }

  const handleLike = async () => {
    if (togglingLike) return

    setTogglingLike(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/likes`, {
        method: "POST"
      })

      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1)

        // Emit socket event for real-time updates
        if (socket && session?.user?.id && data.liked) {
          socket.emit("post_liked", {
            postId: post.id,
            likerId: session.user.id,
            authorId: post.author.id,
            like: {
              actor: { name: session.user.name },
              type: "LIKE"
            }
          })
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setTogglingLike(false)
    }
  }

  const fetchComments = async () => {
    if (showComments) {
      setShowComments(false)
      return
    }

    setLoadingComments(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
        setShowComments(true)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleComment = async () => {
    if (!newComment.trim() || submittingComment) return

    setSubmittingComment(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim()
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments(prev => [data.comment, ...prev])
        setNewComment("")
        
        // Emit socket event for real-time updates
        if (socket && session?.user?.id) {
          socket.emit("post_commented", {
            postId: post.id,
            commenterId: session.user.id,
            authorId: post.author.id,
            comment: {
              actor: { name: session.user.name },
              type: "COMMENT"
            }
          })
        }
        
        // Update comment count
        if (onPostUpdate) {
          onPostUpdate()
        }
      }
    } catch (error) {
      console.error("Error creating comment:", error)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.author.name} - সোশ্যালমিডিয়া`,
          text: post.content,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(
          `${post.content}\n\n- ${post.author.name} (@${post.author.username})`
        )
        alert("লিঙ্ক কপি করা হয়েছে!")
      } catch (error) {
        console.error("Error copying to clipboard:", error)
      }
    }
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                {post.author.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {post.author.username} · {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-900 dark:text-white mb-3">
          {post.content}
        </p>
        {post.image && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img 
              src={post.image} 
              alt="Post image" 
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-gray-500 hover:text-red-500 ${liked ? 'text-red-500' : ''}`}
              onClick={handleLike}
              disabled={togglingLike}
            >
              <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
              <span className="text-xs">{likeCount}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-blue-500"
              onClick={fetchComments}
              disabled={loadingComments}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{post._count.comments}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-green-500"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span className="text-xs">শেয়ার</span>
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            {/* Add Comment */}
            {session && (
              <div className="flex space-x-2 mb-4">
                <Textarea
                  placeholder="একটি মন্তব্য লিখুন..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[60px] resize-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleComment()
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  onClick={handleComment}
                  disabled={!newComment.trim() || submittingComment}
                  className="self-end"
                >
                  {submittingComment ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                  কোন মন্তব্য নেই
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-semibold text-sm text-gray-900 dark:text-white">
                            {comment.author.name}
                          </h5>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}