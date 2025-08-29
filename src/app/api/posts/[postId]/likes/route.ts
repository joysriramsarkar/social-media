import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "অনুমতি নেই" },
        { status: 401 }
      )
    }

    const postId = params.postId

    // Check if post exists
    const post = await db.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: "পোস্ট পাওয়া যায়নি" },
        { status: 404 }
      )
    }

    // Check if user already liked the post
    const existingLike = await db.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId
        }
      }
    })

    if (existingLike) {
      // Unlike the post
      await db.like.delete({
        where: {
          id: existingLike.id
        }
      })

      return NextResponse.json(
        { message: "পোস্ট আনলাইক করা হয়েছে", liked: false },
        { status: 200 }
      )
    } else {
      // Like the post
      await db.like.create({
        data: {
          userId: session.user.id,
          postId: postId
        }
      })

      // Create notification if the liker is not the post author
      if (session.user.id !== post.author.id) {
        await db.notification.create({
          data: {
            type: "LIKE",
            userId: post.author.id,
            actorId: session.user.id,
            postId: postId
          }
        })
      }

      return NextResponse.json(
        { message: "পোস্ট লাইক করা হয়েছে", liked: true },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error("Like toggle error:", error)
    return NextResponse.json(
      { error: "লাইক ব্যর্থ হয়েছে" },
      { status: 500 }
    )
  }
}