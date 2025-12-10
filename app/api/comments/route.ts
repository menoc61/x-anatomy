// app/api/comments/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { getAuthSession } from "@/lib/auth"

const postSchema = z.object({
  content: z.string().min(1, "Comment text is required"),
  postId: z.coerce.number().int().positive("Post ID is required"),
})

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const postId = url.searchParams.get("postId")

    if (!postId) {
      return NextResponse.json(
        { error: "Missing postId parameter" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: parseInt(postId),
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("[GET /api/comments]", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json()

    const { content, postId } = postSchema.parse(body)

    // Get the user from the database to ensure we have the ID
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: user.id,
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error("[POST /api/comments]", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
