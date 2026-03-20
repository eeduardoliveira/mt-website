import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

export async function GET() {
  const results: Record<string, unknown> = {}

  const urls = [
    {
      name: "prisma_user_pooler_6543",
      url: `postgresql://prisma_user.fytptwolmscqzatlckii:MTwebsite2024db@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`,
    },
    {
      name: "prisma_user_pooler_5432",
      url: `postgresql://prisma_user.fytptwolmscqzatlckii:MTwebsite2024db@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`,
    },
  ]

  for (const { name, url } of urls) {
    const prisma = new PrismaClient({ datasources: { db: { url } } })
    try {
      const count = await prisma.$queryRaw`SELECT 1 as ok`
      results[name] = { ok: true, result: count }
    } catch (e) {
      results[name] = { ok: false, error: e instanceof Error ? e.message.substring(0, 200) : String(e) }
    } finally {
      await prisma.$disconnect()
    }
  }

  return NextResponse.json(results)
}
