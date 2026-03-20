import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"
import { validateSession } from "@/lib/auth"
import slugify from "slugify"

export async function GET(request: Request) {
  try {
    const supabase = getSupabase()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const published = searchParams.get("published")
    const limit = searchParams.get("limit")

    let query = supabase.from("Article").select("*").order("createdAt", { ascending: false })

    if (category) query = query.eq("category", category)
    if (published === "true") query = query.eq("published", true)
    if (published === "false") query = query.eq("published", false)
    if (limit) query = query.limit(parseInt(limit))

    const { data: articles, error } = await query

    if (error) throw error

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

    const supabase = getSupabase()
    const body = await request.json()
    const { titlePt, titleEn, excerptPt, excerptEn, contentPt, contentEn, category, coverImage, author, published } = body

    if (!titlePt || !titleEn) {
      return NextResponse.json({ error: "Titles are required" }, { status: 400 })
    }

    const slug = slugify(titlePt, { lower: true, strict: true })

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from("Article")
      .select("id")
      .eq("slug", slug)
      .single()
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    const { data: article, error } = await supabase
      .from("Article")
      .insert({
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
        publishedAt: published ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(article, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
