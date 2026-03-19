"use client"

import Link from "next/link"
import NextImage from "next/image"
import { useLanguage } from "@/lib/language-context"
import { getCategoryLabel } from "@/lib/blog-categories"

interface ArticleCardProps {
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

export function ArticleCard({
  slug,
  titlePt,
  titleEn,
  excerptPt,
  excerptEn,
  category,
  coverImage,
  publishedAt,
  createdAt,
}: ArticleCardProps) {
  const { locale } = useLanguage()
  const title = locale === "pt" ? titlePt : titleEn
  const excerpt = locale === "pt" ? excerptPt : excerptEn
  const date = publishedAt || createdAt

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article>
        <div className="relative aspect-[16/10] rounded-md overflow-hidden bg-light mb-4">
          {coverImage ? (
            <NextImage
              src={coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gold-pale">
              <span className="font-display text-4xl text-gold/30">MT</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-body font-medium text-gold uppercase tracking-widest">
              {getCategoryLabel(category, locale)}
            </span>
            <span className="text-xs font-body text-ink-muted">
              {new Date(date).toLocaleDateString(locale === "pt" ? "pt-PT" : "en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h3 className="font-display text-xl text-ink group-hover:text-gold transition-colors leading-tight">
            {title}
          </h3>

          <p className="font-body text-sm text-ink-muted line-clamp-2">
            {excerpt}
          </p>
        </div>
      </article>
    </Link>
  )
}
