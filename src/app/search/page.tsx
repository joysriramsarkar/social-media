"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Hash, MapPin } from "lucide-react"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const mockUsers = [
    {
      id: "1",
      name: "আমিনুল ইসলাম",
      username: "@aminul",
      bio: "প্রোগ্রামার | ডেভেলপার",
      avatar: "/placeholder-avatar.jpg",
      followers: 1280,
      isFollowing: false
    },
    {
      id: "2", 
      name: "সারা আক্তার",
      username: "@sara",
      bio: "গ্রাফিক ডিজাইনার | আর্টিস্ট",
      avatar: "/placeholder-avatar.jpg",
      followers: 890,
      isFollowing: true
    },
    {
      id: "3",
      name: "রাকিব হাসান",
      username: "@rakib", 
      bio: "কন্টেন্ট ক্রিয়েটর | ব্লগার",
      avatar: "/placeholder-avatar.jpg",
      followers: 567,
      isFollowing: false
    }
  ]

  const mockHashtags = [
    { name: "প্রোগ্রামিং", posts: 15420 },
    { name: "বাংলাদেশ", posts: 8930 },
    { name: "টেকনোলজি", posts: 6780 },
    { name: "শিক্ষা", posts: 5430 },
    { name: "খেলাধুলা", posts: 4320 }
  ]

  const mockLocations = [
    { name: "ঢাকা, বাংলাদেশ", posts: 2340 },
    { name: "চট্টগ্রাম, বাংলাদেশ", posts: 1890 },
    { name: "রাজশাহী, বাংলাদেশ", posts: 980 },
    { name: "খুলনা, বাংলাদেশ", posts: 760 },
    { name: "সিলেট, বাংলাদেশ", posts: 650 }
  ]

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredHashtags = mockHashtags.filter(hashtag =>
    hashtag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLocations = mockLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="অনুসন্ধান করুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 text-lg h-12"
            />
          </div>
        </div>

        <div className="flex space-x-1 mb-6 border-b border-gray-200 dark:border-gray-700">
          {[
            { key: "all", label: "সব", icon: Search },
            { key: "users", label: "ইউজার", icon: Users },
            { key: "hashtags", label: "হ্যাশট্যাগ", icon: Hash },
            { key: "locations", label: "লোকেশন", icon: MapPin }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center space-x-2"
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-6">
          {/* Users */}
          {(activeTab === "all" || activeTab === "users") && filteredUsers.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  ইউজার
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-sm">{user.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.username} · {user.followers.toLocaleString()} ফলোয়ার
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {user.bio}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={user.isFollowing ? "outline" : "default"}
                      size="sm"
                    >
                      {user.isFollowing ? "ফলো করছেন" : "ফলো করুন"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Hashtags */}
          {(activeTab === "all" || activeTab === "hashtags") && filteredHashtags.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Hash className="h-5 w-5 mr-2" />
                  হ্যাশট্যাগ
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredHashtags.map((hashtag, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">#{hashtag.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {hashtag.posts.toLocaleString()} পোস্ট
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Locations */}
          {(activeTab === "all" || activeTab === "locations") && filteredLocations.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  লোকেশন
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredLocations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-sm">{location.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {location.posts.toLocaleString()} পোস্ট
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {searchQuery && 
           filteredUsers.length === 0 && 
           filteredHashtags.length === 0 && 
           filteredLocations.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  কোন ফলাফল পাওয়া যায়নি
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  "{searchQuery}" এর জন্য কোন ইউজার, হ্যাশট্যাগ বা লোকেশন পাওয়া যায়নি
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}