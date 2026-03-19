"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { ArticleContent } from "@/components/blog/ArticleContent"
import { ArticleCard } from "@/components/blog/ArticleCard"
import { getCategoryLabel } from "@/lib/blog-categories"
import Link from "next/link"
import NextImage from "next/image"
import { ArrowLeft, Calendar, Linkedin } from "lucide-react"

interface Article {
  id: string
  slug: string
  titlePt: string
  titleEn: string
  excerptPt: string
  excerptEn: string
  contentPt: string
  contentEn: string
  category: string
  coverImage: string | null
  author: string
  publishedAt: string | null
  createdAt: string
}

export default function ArticlePage() {
  const { locale } = useLanguage()
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [related, setRelated] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all published articles, find by slug
    fetch("/api/articles?published=true")
      .then((res) => res.json())
      .then((articles: Article[]) => {
        const found = articles.find((a) => a.slug === params.slug)
        setArticle(found || null)

        if (found) {
          // Get related articles (same category, excluding current)
          const relatedArticles = articles
            .filter((a) => a.id !== found.id && a.category === found.category)
            .slice(0, 3)
          setRelated(relatedArticles)
        }

        setLoading(false)
      })
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-ink-muted font-body text-sm">
          {locale === "pt" ? "A carregar..." : "Loading..."}
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="font-display text-2xl text-ink mb-4">
          {locale === "pt" ? "Artigo não encontrado" : "Article not found"}
        </p>
        <Link href="/blog" className="text-gold font-body text-sm hover:text-gold-light transition-colors">
          {locale === "pt" ? "Voltar ao blog" : "Back to blog"}
        </Link>
      </div>
    )
  }

  const title = locale === "pt" ? article.titlePt : article.titleEn
  const date = article.publishedAt || article.createdAt

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-off-white py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-6 lg:px-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-ink-muted hover:text-ink font-body text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            {locale === "pt" ? "Voltar ao blog" : "Back to blog"}
          </Link>

          <div className="mt-4">
            <span className="text-xs font-body font-medium text-gold uppercase tracking-widest">
              {getCategoryLabel(article.category, locale)}
            </span>
          </div>

          <h1 className="font-display text-3xl lg:text-4xl text-ink mt-3 leading-tight">
            {title}
          </h1>

          <div className="flex items-center gap-5 mt-8">
            {/* Profile photo */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-light">
              <NextImage src="/margarida-perfil.jpeg" alt="Margarida Tempera" fill className="object-cover object-top" />
            </div>

            {/* Name + date */}
            <div className="flex-1">
              <p className="font-body text-sm text-ink">
                <span className="font-medium">{article.author}</span>
                <span className="text-ink-muted"> | </span>
                <span className="text-ink-muted">{locale === "pt" ? "Advogada" : "Lawyer"}</span>
              </p>
              <p className="font-body text-xs text-ink-muted mt-1 flex items-center gap-1.5">
                <Calendar size={12} />
                {new Date(date).toLocaleDateString(locale === "pt" ? "pt-PT" : "en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="max-w-[1000px] mx-auto px-6 lg:px-10 -mt-4">
          <div className="relative aspect-[2/1] rounded-lg overflow-hidden shadow-lg">
            <NextImage
              src={article.coverImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <ArticleContent contentPt={article.contentPt} contentEn={article.contentEn} />
      </div>

      {/* Author follow CTA */}
      <div className="max-w-[800px] mx-auto px-6 lg:px-10 pb-12">
        <div className="border-t border-light pt-8 flex items-center gap-5">
          <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-light">
            <NextImage src="/margarida-perfil.jpeg" alt="Margarida Tempera" fill className="object-cover object-top" />
          </div>
          <div className="flex-1">
            <p className="font-body text-sm text-ink font-medium">{article.author}</p>
            <p className="font-body text-xs text-ink-muted">{locale === "pt" ? "Advogada" : "Lawyer"}</p>
          </div>
          <a
            href="https://linkedin.com/in/margaridatempera"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#0A66C2] text-white text-xs font-body font-medium px-4 py-2 rounded-sm hover:bg-[#004182] transition-colors"
          >
            <Linkedin size={14} />
            {locale === "pt" ? "Seguir no LinkedIn" : "Follow on LinkedIn"}
          </a>
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="bg-off-white py-16 lg:py-20">
          <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
            <h2 className="font-display text-2xl text-ink mb-8">
              {locale === "pt" ? "Artigos Relacionados" : "Related Articles"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((a) => (
                <ArticleCard key={a.id} {...a} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
