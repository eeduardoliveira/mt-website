"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RichTextEditor } from "./RichTextEditor"
import { ImageUpload } from "./ImageUpload"
import { blogCategories } from "@/lib/blog-categories"
import { Save, Eye, ArrowLeft } from "lucide-react"

interface ArticleData {
  id?: string
  titlePt: string
  titleEn: string
  excerptPt: string
  excerptEn: string
  contentPt: string
  contentEn: string
  category: string
  coverImage: string | null
  author: string
  published: boolean
}

interface ArticleFormProps {
  initialData?: ArticleData
  isEditing?: boolean
}

export function ArticleForm({ initialData, isEditing }: ArticleFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"pt" | "en">("pt")

  const [form, setForm] = useState<ArticleData>({
    titlePt: initialData?.titlePt || "",
    titleEn: initialData?.titleEn || "",
    excerptPt: initialData?.excerptPt || "",
    excerptEn: initialData?.excerptEn || "",
    contentPt: initialData?.contentPt || "",
    contentEn: initialData?.contentEn || "",
    category: initialData?.category || "geral",
    coverImage: initialData?.coverImage || null,
    author: initialData?.author || "Margarida Tempera",
    published: initialData?.published || false,
  })

  function updateField(field: keyof ArticleData, value: string | boolean | null) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(publish?: boolean) {
    setSaving(true)
    try {
      const data = { ...form }
      if (publish !== undefined) data.published = publish

      const url = isEditing ? `/api/articles/${initialData?.id}` : "/api/articles"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push("/admin/articles")
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/admin/articles")}
          className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors font-body text-sm"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="flex items-center gap-3">
          {form.published ? (
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="px-4 py-2 text-sm font-body font-medium text-ink-muted border border-border rounded-md hover:bg-light transition-colors"
            >
              Despublicar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-body font-medium text-gold border border-gold rounded-md hover:bg-gold/5 transition-colors"
            >
              <Eye size={14} />
              Publicar
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-body font-medium text-white bg-ink rounded-md hover:bg-ink/90 transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Cover Image */}
        <ImageUpload
          value={form.coverImage}
          onChange={(url) => updateField("coverImage", url)}
          label="Imagem de Capa"
        />

        {/* Meta */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-body font-medium text-ink-muted uppercase tracking-widest mb-2">
              Categoria
            </label>
            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-md bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
            >
              {blogCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label.pt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-ink-muted uppercase tracking-widest mb-2">
              Autor
            </label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => updateField("author", e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-md bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
            />
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex gap-1 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("pt")}
            className={`px-4 py-2 text-sm font-body font-medium border-b-2 transition-colors ${
              activeTab === "pt" ? "border-gold text-gold" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            Portugu&ecirc;s
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("en")}
            className={`px-4 py-2 text-sm font-body font-medium border-b-2 transition-colors ${
              activeTab === "en" ? "border-gold text-gold" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            English
          </button>
        </div>

        {/* PT Content */}
        <div className={activeTab === "pt" ? "space-y-6" : "hidden"}>
          <div>
            <label className="block text-xs font-body font-medium text-ink-muted uppercase tracking-widest mb-2">
              T&iacute;tulo (PT)
            </label>
            <input
              type="text"
              value={form.titlePt}
              onChange={(e) => updateField("titlePt", e.target.value)}
              placeholder="Título do artigo em português"
              className="w-full px-4 py-3 border border-border rounded-md bg-white font-display text-xl text-ink focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-ink-muted uppercase tracking-widest mb-2">
              Excerto (PT)
            </label>
            <textarea
              value={form.excerptPt}
              onChange={(e) => updateField("excerptPt", e.target.value)}
              placeholder="Breve resumo do artigo"
              rows={2}
              className="w-full px-4 py-3 border border-border rounded-md bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none"
            />
          </div>
          <RichTextEditor
            content={form.contentPt}
            onChange={(html) => updateField("contentPt", html)}
            label="Conte&uacute;do (PT)"
          />
        </div>

        {/* EN Content */}
        <div className={activeTab === "en" ? "space-y-6" : "hidden"}>
          <div>
            <label className="block text-xs font-body font-medium text-ink-muted uppercase tracking-widest mb-2">
              Title (EN)
            </label>
            <input
              type="text"
              value={form.titleEn}
              onChange={(e) => updateField("titleEn", e.target.value)}
              placeholder="Article title in English"
              className="w-full px-4 py-3 border border-border rounded-md bg-white font-display text-xl text-ink focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-body font-medium text-ink-muted uppercase tracking-widest mb-2">
              Excerpt (EN)
            </label>
            <textarea
              value={form.excerptEn}
              onChange={(e) => updateField("excerptEn", e.target.value)}
              placeholder="Brief article summary"
              rows={2}
              className="w-full px-4 py-3 border border-border rounded-md bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none"
            />
          </div>
          <RichTextEditor
            content={form.contentEn}
            onChange={(html) => updateField("contentEn", html)}
            label="Content (EN)"
          />
        </div>
      </div>
    </div>
  )
}
