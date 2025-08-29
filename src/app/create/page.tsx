"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft } from "lucide-react"

export default function CreatePage() {
  const router = useRouter()
  const { data: session } = useSession()

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ফিরে যান
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            নতুন পোস্ট তৈরি করুন
          </h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={session.user?.image || "/placeholder-avatar.jpg"} alt={session.user?.name} />
                <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {session.user?.name || "ইউজার"}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {session.user?.username || "@username"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="min-h-[200px]">
                <textarea
                  placeholder="কি চলছে? শেয়ার করুন..."
                  className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    ছবি যোগ করুন
                  </Button>
                  <Button variant="outline" size="sm">
                    ভিডিও যোগ করুন
                  </Button>
                  <Button variant="outline" size="sm">
                    লোকেশন যোগ করুন
                  </Button>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  পোস্ট করুন
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}