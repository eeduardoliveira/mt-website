"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ArticleForm } from "@/components/admin/ArticleForm"

export default function EditArticlePage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [article, setArticle] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/session").then((res) => res.json()),
      fetch(`/api/articles/${params.id}`).then((res) => res.json()),
    ]).then(([session, articleData]) => {
      if (!session.authenticated) {
        router.push("/admin/login")
      } else {
        setAuthed(true)
        setArticle(articleData)
      }
      setLoading(false)
    })
  }, [router, params.id])

  if (!authed || loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-ink-muted font-body text-sm">A carregar...</div>
      </div>
    )
  }

  if (!article || article.error) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-ink-muted font-body text-sm">Artigo não encontrado.</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-off-white">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ArticleForm initialData={article as any} isEditing />
      </main>
    </div>
  )
}
