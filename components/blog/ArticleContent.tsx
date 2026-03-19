"use client"

import { useLanguage } from "@/lib/language-context"

interface ArticleContentProps {
  contentPt: string
  contentEn: string
}

export function ArticleContent({ contentPt, contentEn }: ArticleContentProps) {
  const { locale } = useLanguage()
  const content = locale === "pt" ? contentPt : contentEn

  return (
    <div
      className="prose prose-lg max-w-none font-body prose-headings:font-display prose-headings:text-ink prose-p:text-ink/80 prose-a:text-gold hover:prose-a:text-gold-light prose-img:rounded-md"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
