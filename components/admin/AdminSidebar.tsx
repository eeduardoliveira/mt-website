"use client"

import { useRouter, usePathname } from "next/navigation"
import { FileText, ExternalLink, LogOut } from "lucide-react"

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <aside className="w-60 bg-ink min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="font-display text-lg text-white">Margarida Tempera</h2>
        <p className="text-white/40 text-xs font-body mt-1">Painel de Administração</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={() => router.push("/admin/articles")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-body transition-colors ${
            isActive("/admin/articles") ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
          }`}
        >
          <FileText size={16} />
          Artigos
        </button>
      </nav>

      <div className="p-4 space-y-1 border-t border-white/10">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-body text-white/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ExternalLink size={16} />
          Ver Site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-body text-white/60 hover:bg-white/5 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}
