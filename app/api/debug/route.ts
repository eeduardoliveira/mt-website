import { NextResponse } from "next/server"
import { getSupabase } from "@/lib/supabase"

export async function GET() {
  const info: Record<string, unknown> = {
    SUPABASE_URL_SET: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY_SET: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("Article").select("id", { count: "exact", head: true })
    if (error) throw error
    info.db_connected = true
    info.article_count = data
  } catch (error) {
    info.db_connected = false
    info.db_error = error instanceof Error ? error.message : String(error)
  }

  return NextResponse.json(info)
}
