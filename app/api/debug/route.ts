import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

export async function GET() {
  const results: Record<string, unknown> = {}

  // Try multiple connection string formats
  const urls = [
    {
      name: "pooler_transaction_6543",
      url: `postgresql://postgres.fytptwolmscqzatlckii:lL6Oew8mwM1w@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`,
    },
    {
      name: "pooler_session_5432",
      url: `postgresql://postgres.fytptwolmscqzatlckii:lL6Oew8mwM1w@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`,
    },
    {
      name: "direct_5432",
      url: `postgresql://postgres:lL6Oew8mwM1w@db.fytptwolmscqzatlckii.supabase.co:5432/postgres`,
    },
    {
      name: "pooler_transaction_ssl",
      url: `postgresql://postgres.fytptwolmscqzatlckii:lL6Oew8mwM1w@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require`,
    },
    {
      name: "direct_ssl",
      url: `postgresql://postgres:lL6Oew8mwM1w@db.fytptwolmscqzatlckii.supabase.co:5432/postgres?sslmode=require`,
    },
  ]

  for (const { name, url } of urls) {
    const prisma = new PrismaClient({ datasources: { db: { url } } })
    try {
      const count = await prisma.$queryRaw`SELECT 1 as ok`
      results[name] = { ok: true, result: count }
    } catch (e) {
      results[name] = { ok: false, error: e instanceof Error ? e.message.substring(0, 150) : String(e) }
    } finally {
      await prisma.$disconnect()
    }
  }

  return NextResponse.json(results)
}
