"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import NextImage from "next/image"

interface ImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  label?: string
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (res.ok) {
        const { url } = await res.json()
        onChange(url)
      }
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-xs font-body font-medium text-ink-muted uppercase tracking-widest mb-2">
          {label}
        </label>
      )}
      {value ? (
        <div className="relative w-full aspect-video rounded-md overflow-hidden border border-border">
          <NextImage src={value} alt="Cover" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-video border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center gap-2 text-ink-muted hover:border-gold/40 hover:text-gold transition-colors"
        >
          <Upload size={24} />
          <span className="text-sm font-body">{uploading ? "A carregar..." : "Carregar imagem"}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}
