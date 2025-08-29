import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "অনুমতি নেই" },
        { status: 401 }
      )
    }

    const followerId = session.user.id
    const followingId = params.userId

    // Users cannot follow themselves
    if (followerId === followingId) {
      return NextResponse.json(
        { error: "নিজেকে ফলো করা যায় না" },
        { status: 400 }
      )
    }

    // Check if both users exist
    const [follower, following] = await Promise.all([
      db.user.findUnique({ where: { id: followerId } }),
      db.user.findUnique({ where: { id: followingId } })
    ])

    if (!follower || !following) {
      return NextResponse.json(
        { error: "ইউজার পাওয়া যায়নি" },
        { status: 404 }
      )
    }

    // Check if already following
    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      }
    })

    if (existingFollow) {
      // Unfollow
      await db.follow.delete({
        where: {
          id: existingFollow.id
        }
      })

      return NextResponse.json(
        { message: "আনফলো করা হয়েছে", following: false },
        { status: 200 }
      )
    } else {
      // Follow
      await db.follow.create({
        data: {
          followerId,
          followingId
        }
      })

      // Create notification
      await db.notification.create({
        data: {
          type: "FOLLOW",
          userId: followingId,
          actorId: followerId
        }
      })

      return NextResponse.json(
        { message: "ফলো করা হয়েছে", following: true },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error("Follow toggle error:", error)
    return NextResponse.json(
      { error: "ফলো ব্যর্থ হয়েছে" },
      { status: 500 }
    )
  }
}