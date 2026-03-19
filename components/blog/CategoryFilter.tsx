"use client"

import { useLanguage } from "@/lib/language-context"
import { blogCategories } from "@/lib/blog-categories"

interface CategoryFilterProps {
  selected: string | null
  onChange: (category: string | null) => void
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const { locale } = useLanguage()

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors ${
          selected === null
            ? "bg-ink text-white"
            : "bg-light text-ink-muted hover:bg-ink/5"
        }`}
      >
        {locale === "pt" ? "Todas" : "All"}
      </button>
      {blogCategories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors ${
            selected === cat.value
              ? "bg-ink text-white"
              : "bg-light text-ink-muted hover:bg-ink/5"
          }`}
        >
          {cat.label[locale]}
        </button>
      ))}
    </div>
  )
}
