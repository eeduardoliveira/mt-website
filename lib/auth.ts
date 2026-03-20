import { getSupabase } from "./supabase"
import { cookies } from "next/headers"
import { randomBytes } from "crypto"

const SESSION_COOKIE = "admin_session"
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export async function verifyPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false
  return password === adminPassword
}

export async function createSession(): Promise<string> {
  const supabase = getSupabase()
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  const { error } = await supabase
    .from("AdminSession")
    .insert({ token, expiresAt: expiresAt.toISOString() })

  if (error) throw error

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return token
}

export async function validateSession(): Promise<boolean> {
  const supabase = getSupabase()
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return false

  const { data: session } = await supabase
    .from("AdminSession")
    .select("*")
    .eq("token", token)
    .single()

  if (!session || new Date(session.expiresAt) < new Date()) {
    if (session) {
      await supabase.from("AdminSession").delete().eq("token", token)
    }
    return false
  }

  return true
}

export async function destroySession(): Promise<void> {
  const supabase = getSupabase()
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    await supabase.from("AdminSession").delete().eq("token", token)
  }

  cookieStore.delete(SESSION_COOKIE)
}

export async function requireAuth(): Promise<boolean> {
  const isValid = await validateSession()
  return isValid
}
