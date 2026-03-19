"use client";

import { LanguageProvider } from "@/lib/language-context";
import { ReactNode } from "react";

export function LanguageWrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
