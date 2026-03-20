import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const info: Record<string, unknown> = {
    DATABASE_URL_SET: !!process.env.DATABASE_URL,
    DIRECT_URL_SET: !!process.env.DIRECT_URL,
    DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 30) + "...",
  }

  try {
    const count = await prisma.article.count()
    info.db_connected = true
    info.article_count = count
  } catch (error) {
    info.db_connected = false
    info.db_error = error instanceof Error ? error.message : String(error)
  }

  return NextResponse.json(info)
}
