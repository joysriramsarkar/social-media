import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId

    const comments = await db.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Comments fetch error:", error)
    return NextResponse.json(
      { error: "কমেন্ট লোড ব্যর্থ হয়েছে" },
      { status: 500 }
    )
  }
}

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
    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "কমেন্ট কন্টেন্ট প্রয়োজন" },
        { status: 400 }
      )
    }

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

    const comment = await db.comment.create({
      data: {
        content: content.trim(),
        authorId: session.user.id,
        postId: postId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          }
        }
      }
    })

    // Create notification if the commenter is not the post author
    if (session.user.id !== post.author.id) {
      await db.notification.create({
        data: {
          type: "COMMENT",
          userId: post.author.id,
          actorId: session.user.id,
          postId: postId,
          commentId: comment.id
        }
      })
    }

    return NextResponse.json(
      { message: "কমেন্ট সফলভাবে তৈরি হয়েছে", comment },
      { status: 201 }
    )
  } catch (error) {
    console.error("Comment creation error:", error)
    return NextResponse.json(
      { error: "কমেন্ট তৈরি ব্যর্থ হয়েছে" },
      { status: 500 }
    )
  }
}