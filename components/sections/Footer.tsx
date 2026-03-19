"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MTMonogram } from "../ui/Logo";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export function Footer() {
  const { locale } = useLanguage();
  const t = translations.footer;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer className="py-10 bg-white">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
        {/* Animated divider */}
        <div ref={ref} className="mb-10">
          <motion.div
            className="h-[1px] bg-border origin-left"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-body font-light text-ink-muted text-center lg:text-left">
            {t.copyright[locale]}
          </p>

          <MTMonogram className="w-7 h-7" />

          <div className="flex items-center gap-4 text-[11px] font-body font-light text-ink-muted text-center lg:text-right">
            <span>{t.bar[locale]}</span>
            <span className="text-border">|</span>
            <a href="#" className="hover:text-ink transition-colors">
              {t.privacy[locale]}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
