"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ArticleTable } from "@/components/admin/ArticleTable"

export default function AdminArticlesPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/admin/login")
        } else {
          setAuthed(true)
        }
      })
  }, [router])

  if (!authed) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-ink-muted font-body text-sm">A verificar sessão...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-off-white">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <ArticleTable />
      </main>
    </div>
  )
}
