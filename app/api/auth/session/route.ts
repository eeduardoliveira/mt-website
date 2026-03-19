import { NextResponse } from "next/server"
import { validateSession } from "@/lib/auth"

export async function GET() {
  try {
    const isValid = await validateSession()
    return NextResponse.json({ authenticated: isValid })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
