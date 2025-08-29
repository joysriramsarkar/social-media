"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { 
  Search, 
  Send, 
  MoreHorizontal, 
  Phone, 
  Video,
  Paperclip,
  Smile,
  EllipsisVertical,
  MessageCircle
} from "lucide-react"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState([
    {
      id: "1",
      user: {
        name: "আমিনুল ইসলাম",
        username: "@aminul",
        avatar: "/placeholder-avatar.jpg",
        isOnline: true
      },
      lastMessage: "আজকে কি করছেন?",
      timestamp: "২ মিনিট আগে",
      unread: 0
    },
    {
      id: "2",
      user: {
        name: "সারা আক্তার",
        username: "@sara",
        avatar: "/placeholder-avatar.jpg",
        isOnline: false
      },
      lastMessage: "প্রোজেক্টটা কেমন চলছে?",
      timestamp: "১ ঘন্টা আগে",
      unread: 3
    },
    {
      id: "3",
      user: {
        name: "রাকিব হাসান",
        username: "@rakib",
        avatar: "/placeholder-avatar.jpg",
        isOnline: true
      },
      lastMessage: "কাল দেখা হবে ইনশাআল্লাহ",
      timestamp: "৩ ঘন্টা আগে",
      unread: 0
    },
    {
      id: "4",
      user: {
        name: "ফারিয়া খাতুন",
        username: "@faria",
        avatar: "/placeholder-avatar.jpg",
        isOnline: false
      },
      lastMessage: "ধন্যবাদ সাহায্যের জন্য",
      timestamp: "গতকাল",
      unread: 1
    },
    {
      id: "5",
      user: {
        name: "তানভীর আহমেদ",
        username: "@tanvir",
        avatar: "/placeholder-avatar.jpg",
        isOnline: false
      },
      lastMessage: "মিটিংটা কখন হবে?",
      timestamp: "২ দিন আগে",
      unread: 0
    }
  ])

  const [messages, setMessages] = useState<Record<string, any[]>>({
    "1": [
      {
        id: "1",
        sender: "other",
        content: "হাই! কেমন আছেন?",
        timestamp: "১০:৩০ AM"
      },
      {
        id: "2",
        sender: "me",
        content: "আলহামদুলিল্লাহ, ভালো আছি। আপনি?",
        timestamp: "১০:৩২ AM"
      },
      {
        id: "3",
        sender: "other",
        content: "আমিও ভালো আছি। আজকে কি করছেন?",
        timestamp: "১০:৩৫ AM"
      }
    ],
    "2": [
      {
        id: "1",
        sender: "other",
        content: "হাই সারা!",
        timestamp: "গতকাল ৯:০০ PM"
      },
      {
        id: "2",
        sender: "me",
        content: "হাই! কেমন আছেন?",
        timestamp: "গতকাল ৯:০৫ PM"
      },
      {
        id: "3",
        sender: "other",
        content: "ভালো। প্রোজেক্টটা কেমন চলছে?",
        timestamp: "গতকাল ৯:১০ PM"
      },
      {
        id: "4",
        sender: "other",
        content: "কোনো হেল্প লাগলে জানাবেন",
        timestamp: "গতকাল ৯:১৫ PM"
      },
      {
        id: "5",
        sender: "other",
        content: "আমি আছি আপনার সাপোর্টে",
        timestamp: "গতকাল ৯:১৬ PM"
      }
    ]
  })

  const selectedConvData = conversations.find(c => c.id === selectedConversation)
  const currentMessages = selectedConversation ? messages[selectedConversation as keyof typeof messages] || [] : []

  const handleSendMessage = () => {
    if (message.trim() && selectedConversation) {
      // Add message to the current conversation
      const newMessage = {
        id: Date.now().toString(),
        sender: "me",
        content: message.trim(),
        timestamp: new Date().toLocaleTimeString("bn-BD", { 
          hour: "2-digit", 
          minute: "2-digit" 
        })
      }
      
      // Update messages state
      setMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || []), newMessage]
      }))
      
      // Update conversation last message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: message.trim(), timestamp: "এইমাত্র" }
          : conv
      ))
      
      // Clear input
      setMessage("")
      
      // Show success feedback
      toast.success("মেসেজ পাঠানো হয়েছে")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-4">
          {/* Conversations List */}
          <Card className="md:col-span-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">মেসেজ</h2>
                <Button variant="ghost" size="sm">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="অনুসন্ধান করুন..."
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="space-y-1 p-4">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        selectedConversation === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                          <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conversation.user.isOnline && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                            {conversation.user.name}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {conversation.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConvData?.user.avatar} alt={selectedConvData?.user.name} />
                        <AvatarFallback>{selectedConvData?.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-sm">{selectedConvData?.user.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedConvData?.user.isOnline ? 'অনলাইন' : 'অফলাইন'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-4">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      {currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.sender === 'me'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        type="text"
                        placeholder="মেসেজ লিখুন..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="resize-none"
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    কথোপকথন নির্বাচন করুন
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    বাম পাশ থেকে একটি কথোপকথন নির্বাচন করুন অথবা নতুন কথোপকথন শুরু করুন
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}