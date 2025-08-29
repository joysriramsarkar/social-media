"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreatePost } from "@/components/posts/create-post"
import { PostCard } from "@/components/posts/post-card"

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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/posts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      } else {
        setError("পোস্ট লোড করা যায়নি")
      }
    } catch (error) {
      setError("কিছু ভুল হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePostCreated = () => {
    fetchPosts()
  }

  const handlePostUpdate = () => {
    fetchPosts()
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <CreatePost onPostCreated={handlePostCreated} />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white dark:bg-gray-800 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchPosts}>আবার চেষ্টা করুন</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <CreatePost onPostCreated={handlePostCreated} />
        
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  কোন পোস্ট নেই। প্রথম পোস্টটি করুন!
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onPostUpdate={handlePostUpdate}
              />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  )
}