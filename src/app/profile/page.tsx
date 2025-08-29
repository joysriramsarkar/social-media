"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FollowButton } from "@/components/users/follow-button"
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Edit,
  MapPin,
  Calendar,
  Link as LinkIcon
} from "lucide-react"

export default function Profile() {
  const [user, setUser] = useState({
    id: "1",
    name: "আমিনুল ইসলাম",
    username: "@aminul",
    bio: "প্রোগ্রামার | ডেভেলপার | টেক এন্থুজিয়াস্ট\nকোডিং নিয়ে কাজ করতে ভালোবাসি। নতুন টেকনোলজি শিখতে ভালো লাগে।",
    avatar: "/placeholder-avatar.jpg",
    coverImage: "/placeholder-cover.jpg",
    location: "ঢাকা, বাংলাদেশ",
    website: "https://aminul.dev",
    joinDate: "জানুয়ারি ২০২৩",
    stats: {
      posts: 156,
      following: 342,
      followers: 1280
    }
  })

  const [posts, setPosts] = useState([
    {
      id: "1",
      content: "আজকের দিনটা অনেক সুন্দর কাটছে! আশা করি সবারই দিনটা ভালো কাটছে। #সুন্দরদিন",
      image: "/placeholder-post.jpg",
      likes: 42,
      comments: 8,
      shares: 3,
      createdAt: "২ ঘন্টা আগে"
    },
    {
      id: "2",
      content: "নতুন একটা প্রোজেক্ট শুরু করলাম। সবার দোয়া ও সমর্থন চাই। প্রোগ্রামিং নিয়ে কাজ করতে ভালো লাগে। #প্রোগ্রামিং #নতুনশুরু",
      likes: 128,
      comments: 23,
      shares: 12,
      createdAt: "৫ ঘন্টা আগে"
    },
    {
      id: "3",
      content: "আজকে বন্ধুদের সাথে দেখা হলো। অনেকদিন পর মজা করলাম। বন্ধুত্ব সত্যিই একটা অসাধারণ সম্পর্ক। #বন্ধুত্ব #মজা",
      image: "/placeholder-post.jpg",
      likes: 67,
      comments: 15,
      shares: 5,
      createdAt: "১ দিন আগে"
    }
  ])

  const handleFollowChange = (following: boolean) => {
    setUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        followers: following ? prev.stats.followers + 1 : prev.stats.followers - 1
      }
    }))
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
          <img 
            src={user.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>

        {/* Profile Info */}
        <Card className="rounded-t-none">
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative -mt-16">
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    {user.username}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  প্রোফাইল এডিট করুন
                </Button>
                <FollowButton 
                  userId={user.id}
                  onFollowChange={handleFollowChange}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bio */}
            <div>
              <p className="text-gray-900 dark:text-white whitespace-pre-line">
                {user.bio}
              </p>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              {user.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </div>
              )}
              {user.website && (
                <div className="flex items-center">
                  <LinkIcon className="h-4 w-4 mr-1" />
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
                    {user.website}
                  </a>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {user.joinDate} থেকে
              </div>
            </div>

            {/* Stats */}
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">
                  {user.stats.posts}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  পোস্ট
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">
                  {user.stats.following}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ফলোইং
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 dark:text-white">
                  {user.stats.followers}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ফলোয়ার
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="mt-6">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">পোস্ট</TabsTrigger>
              <TabsTrigger value="media">মিডিয়া</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="bg-white dark:bg-gray-800 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                            {user.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.username} · {post.createdAt}
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
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                          <Heart className="h-4 w-4 mr-1" />
                          <span className="text-xs">{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">{post.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                          <Share2 className="h-4 w-4 mr-1" />
                          <span className="text-xs">{post.shares}</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="media" className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {posts.filter(post => post.image).map((post) => (
                  <div key={post.id} className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt="Post media" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  )
}