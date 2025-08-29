"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Globe,
  Camera,
  Save,
  LogOut
} from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    username: session?.user?.username || "",
    bio: "প্রোগ্রামার | ডেভেলপার | টেক এন্থুজিয়াস্ট\nকোডিং নিয়ে কাজ করতে ভালোবাসি।",
    location: "ঢাকা, বাংলাদেশ",
    website: "https://example.com"
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    likeNotifications: true,
    commentNotifications: true,
    followNotifications: true,
    messageNotifications: true
  })

  const [privacySettings, setPrivacySettings] = useState({
    privateAccount: false,
    showActivityStatus: true,
    allowMessages: true,
    showOnlineStatus: true
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Here we would normally update the profile via API
    setTimeout(() => {
      setIsLoading(false)
      // Show success message
    }, 1000)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">সেটিংস</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            আপনার অ্যাকাউন্ট সেটিংস পরিচালনা করুন
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>প্রোফাইল</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>নোটিফিকেশন</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>প্রাইভেসি</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Moon className="h-4 w-4" />
              <span>অ্যাপিয়ারেন্স</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>প্রোফাইল তথ্য</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={session?.user?.image || "/placeholder-avatar.jpg"} alt={session?.user?.name} />
                        <AvatarFallback className="text-2xl">{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">প্রোফাইল ছবি</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        JPG, GIF বা PNG. সর্বোচ্চ ৫MB।
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">নাম</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">ইউজারনেম</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">বায়ো</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">লোকেশন</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">ওয়েবসাইট</Label>
                      <Input
                        id="website"
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "সেভ হচ্ছে..." : "সেভ করুন"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>নোটিফিকেশন সেটিংস</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">ইমেইল নোটিফিকেশন</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        গুরুত্বপূর্ণ আপডেটের জন্য ইমেইল পান
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, emailNotifications: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">পুশ নোটিফিকেশন</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ব্রাউজারে পুশ নোটিফিকেশন পান
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, pushNotifications: checked})
                      }
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-lg font-semibold mb-4">নির্দিষ্ট নোটিফিকেশন</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">❤️</Badge>
                        <Label>লাইক নোটিফিকেশন</Label>
                      </div>
                      <Switch
                        checked={notificationSettings.likeNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, likeNotifications: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">💬</Badge>
                        <Label>কমেন্ট নোটিফিকেশন</Label>
                      </div>
                      <Switch
                        checked={notificationSettings.commentNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, commentNotifications: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">👥</Badge>
                        <Label>ফলো নোটিফিকেশন</Label>
                      </div>
                      <Switch
                        checked={notificationSettings.followNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, followNotifications: checked})
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">📧</Badge>
                        <Label>মেসেজ নোটিফিকেশন</Label>
                      </div>
                      <Switch
                        checked={notificationSettings.messageNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, messageNotifications: checked})
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>প্রাইভেসি সেটিংস</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">প্রাইভেট অ্যাকাউন্ট</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        শুধুমাত্র অনুমোদিত ফলোয়াররা আপনার পোস্ট দেখতে পারবে
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.privateAccount}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, privateAccount: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">অ্যাক্টিভিটি স্ট্যাটাস দেখান</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        অন্যরা আপনার অ্যাক্টিভিটি দেখতে পারবে
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.showActivityStatus}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, showActivityStatus: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">মেসেজ অনুমতি দিন</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        অন্যরা আপনাকে মেসেজ পাঠাতে পারবে
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.allowMessages}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, allowMessages: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">অনলাইন স্ট্যাটাস দেখান</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        অন্যরা দেখতে পারবে যখন আপনি অনলাইন থাকবেন
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.showOnlineStatus}
                      onCheckedChange={(checked) => 
                        setPrivacySettings({...privacySettings, showOnlineStatus: checked})
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Moon className="h-5 w-5" />
                  <span>অ্যাপিয়ারেন্স সেটিংস</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">ডার্ক মোড</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ডার্ক থিম ব্যবহার করুন
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">কমপ্যাক্ট ভিউ</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        আরও কনটেন্ট দেখার জন্য কমপ্যাক্ট লেআউট
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base">ল্যাঙ্গুয়েজ</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start">
                        <Globe className="h-4 w-4 mr-2" />
                        বাংলা
                      </Button>
                      <Button variant="ghost" className="justify-start">
                        <Globe className="h-4 w-4 mr-2" />
                        English
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <LogOut className="h-5 w-5" />
                  <span>অ্যাকাউন্ট</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    আপনি যদি লগ আউট করেন, আপনাকে আবার লগ ইন করতে হবে।
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    লগ আউট করুন
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}