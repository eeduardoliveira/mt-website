import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateSession } from "@/lib/auth"
import slugify from "slugify"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const published = searchParams.get("published")
    const limit = searchParams.get("limit")

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (published === "true") where.published = true
    if (published === "false") where.published = false

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: parseInt(limit) } : {}),
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Failed to fetch articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await validateSession()
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { titlePt, titleEn, excerptPt, excerptEn, contentPt, contentEn, category, coverImage, author, published } = body

    if (!titlePt || !titleEn) {
      return NextResponse.json({ error: "Titles are required" }, { status: 400 })
    }

    const slug = slugify(titlePt, { lower: true, strict: true })

    // Check for duplicate slug
    const existing = await prisma.article.findUnique({ where: { slug } })
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    const article = await prisma.article.create({
      data: {
        slug: finalSlug,
        titlePt,
        titleEn,
        excerptPt: excerptPt || "",
        excerptEn: excerptEn || "",
        contentPt: contentPt || "",
        contentEn: contentEn || "",
        category: category || "geral",
        coverImage: coverImage || null,
        author: author || "Margarida Tempera",
        published: published || false,
        publishedAt: published ? new Date() : null,
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
