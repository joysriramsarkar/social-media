import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "অনুমতি নেই" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    const notifications = await db.notification.findMany({
      where: {
        userId: session.user.id,
        ...(unreadOnly ? { read: false } : {})
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          }
        },
        post: {
          select: {
            id: true,
            content: true,
          }
        },
        comment: {
          select: {
            id: true,
            content: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Notifications fetch error:", error)
    return NextResponse.json(
      { error: "নোটিফিকেশন লোড ব্যর্থ হয়েছে" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "অনুমতি নেই" },
        { status: 401 }
      )
    }

    const { notificationIds, markAllAsRead } = await request.json()

    if (markAllAsRead) {
      // Mark all notifications as read
      await db.notification.updateMany({
        where: {
          userId: session.user.id,
          read: false
        },
        data: {
          read: true
        }
      })
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await db.notification.updateMany({
        where: {
          id: {
            in: notificationIds
          },
          userId: session.user.id
        },
        data: {
          read: true
        }
      })
    }

    return NextResponse.json(
      { message: "নোটিফিকেশন আপডেট হয়েছে" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Notifications update error:", error)
    return NextResponse.json(
      { error: "নোটিফিকেশন আপডেট ব্যর্থ হয়েছে" },
      { status: 500 }
    )
  }
}