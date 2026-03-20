import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"
import { validateSession } from "@/lib/auth"
import slugify from "slugify"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase()
    const { data: article, error } = await supabase
      .from("Article")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error || !article) {
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

    const supabase = getSupabase()
    const body = await request.json()
    const { titlePt, titleEn, excerptPt, excerptEn, contentPt, contentEn, category, coverImage, author, published } = body

    const { data: existing } = await supabase
      .from("Article")
      .select("*")
      .eq("id", params.id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Regenerate slug if title changed
    let slug = existing.slug
    if (titlePt && titlePt !== existing.titlePt) {
      slug = slugify(titlePt, { lower: true, strict: true })
      const { data: duplicate } = await supabase
        .from("Article")
        .select("id")
        .eq("slug", slug)
        .single()
      if (duplicate && duplicate.id !== params.id) {
        slug = `${slug}-${Date.now()}`
      }
    }

    // Handle publishedAt
    let publishedAt = existing.publishedAt
    if (published && !existing.published) {
      publishedAt = new Date().toISOString()
    } else if (!published) {
      publishedAt = null
    }

    const updateData: Record<string, unknown> = { slug, publishedAt, updatedAt: new Date().toISOString() }
    if (titlePt !== undefined) updateData.titlePt = titlePt
    if (titleEn !== undefined) updateData.titleEn = titleEn
    if (excerptPt !== undefined) updateData.excerptPt = excerptPt
    if (excerptEn !== undefined) updateData.excerptEn = excerptEn
    if (contentPt !== undefined) updateData.contentPt = contentPt
    if (contentEn !== undefined) updateData.contentEn = contentEn
    if (category !== undefined) updateData.category = category
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (author !== undefined) updateData.author = author
    if (published !== undefined) updateData.published = published

    const { data: article, error } = await supabase
      .from("Article")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

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

    const supabase = getSupabase()
    const { error } = await supabase
      .from("Article")
      .delete()
      .eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
