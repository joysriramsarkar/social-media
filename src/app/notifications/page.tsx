"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Bell,
  Check,
  X,
  Clock
} from "lucide-react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "like",
      actor: {
        name: "আমিনুল ইসলাম",
        username: "@aminul",
        avatar: "/placeholder-avatar.jpg"
      },
      post: {
        id: "1",
        content: "আজকের দিনটা অনেক সুন্দর কাটছে!"
      },
      createdAt: "২ মিনিট আগে",
      read: false
    },
    {
      id: "2",
      type: "comment",
      actor: {
        name: "সারা আক্তার",
        username: "@sara",
        avatar: "/placeholder-avatar.jpg"
      },
      post: {
        id: "2",
        content: "নতুন একটা প্রোজেক্ট শুরু করলাম"
      },
      comment: "অনেক ভালো হয়েছে! সাকসেস চাই",
      createdAt: "১৫ মিনিট আগে",
      read: false
    },
    {
      id: "3",
      type: "follow",
      actor: {
        name: "রাকিব হাসান",
        username: "@rakib",
        avatar: "/placeholder-avatar.jpg"
      },
      createdAt: "১ ঘন্টা আগে",
      read: true
    },
    {
      id: "4",
      type: "like",
      actor: {
        name: "ফারিয়া খাতুন",
        username: "@faria",
        avatar: "/placeholder-avatar.jpg"
      },
      post: {
        id: "3",
        content: "আজকে বন্ধুদের সাথে দেখা হলো"
      },
      createdAt: "৩ ঘন্টা আগে",
      read: true
    },
    {
      id: "5",
      type: "follow",
      actor: {
        name: "তানভীর আহমেদ",
        username: "@tanvir",
        avatar: "/placeholder-avatar.jpg"
      },
      createdAt: "৫ ঘন্টা আগে",
      read: true
    }
  ])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationText = (notification: any) => {
    switch (notification.type) {
      case "like":
        return (
          <>
            <span className="font-semibold">{notification.actor.name}</span> আপনার পোস্টটি লাইক করেছেন
          </>
        )
      case "comment":
        return (
          <>
            <span className="font-semibold">{notification.actor.name}</span> আপনার পোস্টে কমেন্ট করেছেন: "{notification.comment}"
          </>
        )
      case "follow":
        return (
          <>
            <span className="font-semibold">{notification.actor.name}</span> আপনাকে ফলো করেছেন
          </>
        )
      default:
        return "নতুন নোটিফিকেশন"
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read)
  const readNotifications = notifications.filter(n => n.read)

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">নোটিফিকেশন</h1>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              সব পড়ুন
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="relative">
              সব
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              অপঠিত
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">পঠিত</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    কোন নোটিফিকেশন নেই
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    যখন কেউ আপনার পোস্ট লাইক করবে, কমেন্ট করবে বা ফলো করবে, তখন আপনি নোটিফিকেশন পাবেন
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {getNotificationText(notification)}
                            </p>
                            {notification.post && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                "{notification.post.content}"
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {notification.createdAt}
                            </p>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 h-auto"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                        <AvatarFallback>{notification.actor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-2">
            {unreadNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    সব নোটিফিকেশন পড়া হয়েছে
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    আপনার কোন অপঠিত নোটিফিকেশন নেই
                  </p>
                </CardContent>
              </Card>
            ) : (
              unreadNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {getNotificationText(notification)}
                            </p>
                            {notification.post && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                "{notification.post.content}"
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {notification.createdAt}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 h-auto"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                        <AvatarFallback>{notification.actor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="read" className="space-y-2">
            {readNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    কোন পঠিত নোটিফিকেশন নেই
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    আপনি যখন নোটিফিকেশন পড়বেন, সেগুলো এখানে দেখাবে
                  </p>
                </CardContent>
              </Card>
            ) : (
              readNotifications.map((notification) => (
                <Card key={notification.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {getNotificationText(notification)}
                        </p>
                        {notification.post && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            "{notification.post.content}"
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.createdAt}
                        </p>
                      </div>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                        <AvatarFallback>{notification.actor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}