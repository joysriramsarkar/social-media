import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/config"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "অনুমতি নেই" },
        { status: 401 }
      )
    }

    const { content, image } = await request.json()

    if (!content && !image) {
      return NextResponse.json(
        { error: "কন্টেন্ট বা ছবি প্রয়োজন" },
        { status: 400 }
      )
    }

    const post = await db.post.create({
      data: {
        content: content || "",
        image: image || null,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      }
    })

    return NextResponse.json(
      { message: "পোস্ট সফলভাবে তৈরি হয়েছে", post },
      { status: 201 }
    )
  } catch (error) {
    console.error("Post creation error:", error)
    return NextResponse.json(
      { error: "পোস্ট তৈরি ব্যর্থ হয়েছে" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    // If user is authenticated, get posts from followed users and user's own posts
    if (session?.user?.id) {
      const posts = await db.post.findMany({
        where: {
          OR: [
            {
              author: {
                followers: {
                  some: {
                    followerId: session.user.id
                  }
                }
              }
            },
            {
              authorId: session.user.id
            }
          ]
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: offset,
        take: limit
      })

      return NextResponse.json({ posts })
    }

    // For non-authenticated users, get public posts
    const posts = await db.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      skip: offset,
      take: limit
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Posts fetch error:", error)
    return NextResponse.json(
      { error: "পোস্ট লোড ব্যর্থ হয়েছে" },
      { status: 500 }
    )
  }
}