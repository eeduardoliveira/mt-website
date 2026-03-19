"use client";

import { useState, useEffect } from "react";
import { AnimatedSection, AnimatedChild } from "../ui/AnimatedSection";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { ArticleCard } from "../blog/ArticleCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  slug: string;
  titlePt: string;
  titleEn: string;
  excerptPt: string;
  excerptEn: string;
  category: string;
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export function Noticias() {
  const { locale } = useLanguage();
  const t = translations.noticias;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/articles?published=true&limit=3")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Don't render section if no articles and finished loading
  if (loaded && articles.length === 0) return null;

  return (
    <section id="noticias" className="py-24 lg:py-36 bg-white">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
        <AnimatedSection>
          <AnimatedChild>
            <SectionLabel text={t.eyebrow[locale]} className="mb-6" />
          </AnimatedChild>
          <AnimatedChild>
            <div className="flex items-end justify-between mb-12">
              <h2 className="font-display text-3xl lg:text-4xl font-light text-ink">
                {t.title[locale]}
              </h2>
              <Link
                href="/blog"
                className="hidden sm:flex items-center gap-2 text-[11px] font-body font-medium tracking-widest uppercase text-gold hover:text-gold-light transition-colors"
              >
                {t.cta[locale]}
                <ArrowRight size={14} />
              </Link>
            </div>
          </AnimatedChild>
        </AnimatedSection>

        {articles.length > 0 && (
          <AnimatedSection
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            staggerChildren={0.1}
          >
            {articles.map((article) => (
              <AnimatedChild key={article.id}>
                <ArticleCard {...article} />
              </AnimatedChild>
            ))}
          </AnimatedSection>
        )}

        <AnimatedSection className="sm:hidden mt-10">
          <AnimatedChild>
            <Link
              href="/blog"
              className="flex items-center justify-center gap-2 text-[11px] font-body font-medium tracking-widest uppercase text-gold hover:text-gold-light transition-colors"
            >
              {t.cta[locale]}
              <ArrowRight size={14} />
            </Link>
          </AnimatedChild>
        </AnimatedSection>
      </div>
    </section>
  );
}
