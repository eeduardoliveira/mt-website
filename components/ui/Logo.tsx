"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export function MTMonogram({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <Image
      src="/logo-margarida.png"
      alt="MT"
      width={40}
      height={40}
      className={className}
    />
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  const { locale } = useLanguage();
  const t = translations.nav;

  return (
    <a href="#" className="flex items-center gap-3 group">
      <MTMonogram className="w-9 h-9 object-contain" />
      {!compact && (
        <div className="hidden sm:block">
          <p className="text-[11px] font-body font-medium tracking-widest uppercase leading-tight">
            Margarida Tempera
          </p>
          <p className="text-[9px] font-body font-light tracking-[0.25em] uppercase text-ink-muted leading-tight">
            {t.subtitle[locale]}
          </p>
        </div>
      )}
    </a>
  );
}
