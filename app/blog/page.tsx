"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"
import { ArticleCard } from "@/components/blog/ArticleCard"
import { CategoryFilter } from "@/components/blog/CategoryFilter"
import { SectionLabel } from "@/components/ui/SectionLabel"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Article {
  id: string
  slug: string
  titlePt: string
  titleEn: string
  excerptPt: string
  excerptEn: string
  category: string
  coverImage: string | null
  publishedAt: string | null
  createdAt: string
}

export default function BlogPage() {
  const { locale } = useLanguage()
  const t = translations.blog
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams({ published: "true" })
    if (category) params.set("category", category)
    fetch(`/api/articles?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data)
        setLoading(false)
      })
  }, [category])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-off-white py-20 lg:py-28">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ink-muted hover:text-ink font-body text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            {locale === "pt" ? "Voltar ao site" : "Back to site"}
          </Link>
          <SectionLabel text={t.eyebrow[locale]} />
          <h1 className="font-display text-4xl lg:text-5xl text-ink mt-4">
            {t.title[locale]}
          </h1>
          <p className="font-body text-ink-muted mt-4 max-w-2xl">
            {t.subtitle[locale]}
          </p>
        </div>
      </div>

      {/* Filter + Articles */}
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <CategoryFilter selected={category} onChange={setCategory} />

        {loading ? (
          <div className="text-center py-20 text-ink-muted font-body text-sm">
            {locale === "pt" ? "A carregar..." : "Loading..."}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-ink-muted font-body">
            <p className="text-lg mb-2">
              {locale === "pt" ? "Sem artigos publicados" : "No published articles"}
            </p>
            <p className="text-sm">
              {locale === "pt" ? "Volte em breve para novidades." : "Check back soon for updates."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
