import { NextResponse } from "next/server"
import { validateSession } from "@/lib/auth"
import { getSupabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const isAuth = await validateSession()
    if (!isAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg"
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const supabase = getSupabase()

    const { error } = await supabase.storage
      .from("uploads")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filename)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
