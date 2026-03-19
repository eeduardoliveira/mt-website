import { prisma } from "./prisma"
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
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await prisma.adminSession.create({
    data: { token, expiresAt },
  })

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
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return false

  const session = await prisma.adminSession.findUnique({
    where: { token },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.adminSession.delete({ where: { token } })
    }
    return false
  }

  return true
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (token) {
    await prisma.adminSession.deleteMany({ where: { token } })
  }

  cookieStore.delete(SESSION_COOKIE)
}

export async function requireAuth(): Promise<boolean> {
  const isValid = await validateSession()
  return isValid
}
