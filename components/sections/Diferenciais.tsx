"use client";

import { AnimatedSection, AnimatedChild } from "../ui/AnimatedSection";
import { SectionLabel } from "../ui/SectionLabel";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export function Diferenciais() {
  const { locale } = useLanguage();
  const t = translations.diferenciais;

  return (
    <section className="py-24 lg:py-36 bg-light">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
        <AnimatedSection>
          <AnimatedChild>
            <SectionLabel text={t.eyebrow[locale]} className="mb-16" />
          </AnimatedChild>
        </AnimatedSection>

        <AnimatedSection
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
          staggerChildren={0.1}
        >
          {t.items.map((item, i) => (
            <AnimatedChild key={i}>
              <div>
                <div className="w-full h-[1px] bg-gold mb-6" />
                <h3 className="font-display text-xl font-light text-ink mb-3">
                  {item.title[locale]}
                </h3>
                <p className="text-[12px] font-body font-light leading-relaxed text-ink-muted">
                  {item.desc[locale]}
                </p>
              </div>
            </AnimatedChild>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
