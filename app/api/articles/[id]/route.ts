import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateSession } from "@/lib/auth"
import slugify from "slugify"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch {
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAuth = await validateSession()
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { titlePt, titleEn, excerptPt, excerptEn, contentPt, contentEn, category, coverImage, author, published } = body

    const existing = await prisma.article.findUnique({
      where: { id: params.id },
    })
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Regenerate slug if title changed
    let slug = existing.slug
    if (titlePt && titlePt !== existing.titlePt) {
      slug = slugify(titlePt, { lower: true, strict: true })
      const duplicate = await prisma.article.findUnique({ where: { slug } })
      if (duplicate && duplicate.id !== params.id) {
        slug = `${slug}-${Date.now()}`
      }
    }

    // Handle publishedAt
    let publishedAt = existing.publishedAt
    if (published && !existing.published) {
      publishedAt = new Date()
    } else if (!published) {
      publishedAt = null
    }

    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        slug,
        ...(titlePt !== undefined && { titlePt }),
        ...(titleEn !== undefined && { titleEn }),
        ...(excerptPt !== undefined && { excerptPt }),
        ...(excerptEn !== undefined && { excerptEn }),
        ...(contentPt !== undefined && { contentPt }),
        ...(contentEn !== undefined && { contentEn }),
        ...(category !== undefined && { category }),
        ...(coverImage !== undefined && { coverImage }),
        ...(author !== undefined && { author }),
        ...(published !== undefined && { published }),
        publishedAt,
      },
    })

    return NextResponse.json(article)
  } catch {
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAuth = await validateSession()
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.article.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
