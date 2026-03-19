"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCategoryLabel } from "@/lib/blog-categories"
import { Edit, Trash2, Eye, EyeOff, Plus } from "lucide-react"

interface Article {
  id: string
  titlePt: string
  slug: string
  category: string
  published: boolean
  createdAt: string
  publishedAt: string | null
}

export function ArticleTable() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    try {
      const res = await fetch("/api/articles")
      if (res.ok) {
        const data = await res.json()
        setArticles(data)
      }
    } finally {
      setLoading(false)
    }
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    })
    fetchArticles()
  }

  async function deleteArticle(id: string) {
    if (!confirm("Tem a certeza que deseja eliminar este artigo?")) return
    await fetch(`/api/articles/${id}`, { method: "DELETE" })
    fetchArticles()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-ink-muted font-body text-sm">
        A carregar...
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Artigos</h1>
        <button
          onClick={() => router.push("/admin/articles/new")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-body font-medium text-white bg-ink rounded-md hover:bg-ink/90 transition-colors"
        >
          <Plus size={16} />
          Novo Artigo
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-ink-muted font-body">
          <p className="text-lg mb-2">Sem artigos</p>
          <p className="text-sm">Crie o primeiro artigo para começar.</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-off-white">
                <th className="text-left px-4 py-3 text-xs font-body font-medium text-ink-muted uppercase tracking-widest">Título</th>
                <th className="text-left px-4 py-3 text-xs font-body font-medium text-ink-muted uppercase tracking-widest">Categoria</th>
                <th className="text-left px-4 py-3 text-xs font-body font-medium text-ink-muted uppercase tracking-widest">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-body font-medium text-ink-muted uppercase tracking-widest">Data</th>
                <th className="text-right px-4 py-3 text-xs font-body font-medium text-ink-muted uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-border last:border-0 hover:bg-off-white/50 transition-colors">
                  <td className="px-4 py-3 font-body text-sm text-ink">{article.titlePt}</td>
                  <td className="px-4 py-3 font-body text-sm text-ink-muted">{getCategoryLabel(article.category, "pt")}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-body rounded-full ${
                      article.published ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {article.published ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-ink-muted">
                    {new Date(article.createdAt).toLocaleDateString("pt-PT")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => togglePublish(article.id, article.published)}
                        title={article.published ? "Despublicar" : "Publicar"}
                        className="p-1.5 text-ink-muted hover:text-ink transition-colors"
                      >
                        {article.published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                        title="Editar"
                        className="p-1.5 text-ink-muted hover:text-ink transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        title="Eliminar"
                        className="p-1.5 text-ink-muted hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
