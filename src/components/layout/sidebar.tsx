"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Home, 
  Search, 
  Bell, 
  MessageSquare, 
  PlusSquare, 
  User, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { name: "হোম", href: "/", icon: Home },
  { name: "অনুসন্ধান", href: "/search", icon: Search },
  { name: "নোটিফিকেশন", href: "/notifications", icon: Bell },
  { name: "মেসেজ", href: "/messages", icon: MessageSquare },
  { name: "পোস্ট করুন", href: "/create", icon: PlusSquare },
  { name: "প্রোফাইল", href: "/profile", icon: User },
  { name: "সেটিংস", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold text-blue-600">সোশ্যালমিডিয়া</h1>
          </div>
          <nav className="mt-8 flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={session ? item.href : "/auth/signin"}
                  className={cn(
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-700 dark:border-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400",
                      "mr-3 flex-shrink-0 h-5 w-5"
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center w-full">
            {session ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image || "/placeholder-avatar.jpg"} alt={session?.user?.name} />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0) || session?.user?.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session?.user?.name || session?.user?.username || "ইউজার"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    @{session?.user?.username || "username"}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      গেস্ট ইউজার
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => signIn()}>
                  লগইন
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl font-bold text-blue-600">সোশ্যালমিডিয়া</h1>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400",
                      "mr-3 flex-shrink-0 h-5 w-5"
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center w-full">
              {session ? (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || "/placeholder-avatar.jpg"} alt={session?.user?.name} />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0) || session?.user?.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {session?.user?.name || session?.user?.username || "ইউজার"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      @{session?.user?.username || "username"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        গেস্ট ইউজার
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => signIn()}>
                    লগইন
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}