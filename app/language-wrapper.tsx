"use client";

import { LanguageProvider, useLanguage } from "@/lib/language-context";
import { LOCALE_META } from "@/lib/translations";
import { ReactNode, useEffect } from "react";

function DirectionUpdater({ children }: { children: ReactNode }) {
  const { locale } = useLanguage();

  useEffect(() => {
    const meta = LOCALE_META[locale];
    document.documentElement.dir = meta.dir;
    document.documentElement.lang = locale;
  }, [locale]);

  return <>{children}</>;
}

export function LanguageWrapper({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <DirectionUpdater>{children}</DirectionUpdater>
    </LanguageProvider>
  );
}
