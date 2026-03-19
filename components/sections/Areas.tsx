"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "../ui/SectionLabel";
import { AnimatedSection, AnimatedChild } from "../ui/AnimatedSection";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

function AreaCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <motion.div
      className="group relative bg-white border border-border p-8 cursor-default transition-transform duration-300 hover:-translate-y-1 h-full flex flex-col"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="text-[11px] font-body font-medium tracking-widest text-gold block mb-4">
        {num}
      </span>
      <h3 className="font-display text-[22px] font-light text-ink mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-[12px] font-body font-light leading-relaxed text-ink-muted flex-1">
        {desc}
      </p>

      {/* Gold bottom border on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <div className="w-full h-full bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
      </div>
    </motion.div>
  );
}

export function Areas() {
  const { locale } = useLanguage();
  const t = translations.areas;

  return (
    <section id="areas" className="py-24 lg:py-36 bg-white">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
        <AnimatedSection staggerChildren={0.12}>
          <AnimatedChild>
            <SectionLabel text={t.eyebrow[locale]} className="mb-8" />
          </AnimatedChild>
          <AnimatedChild>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.15] text-ink max-w-lg mb-16">
              {t.title1[locale]}
              <br />
              {t.title2[locale]} <em className="italic text-gold">{t.titleAccent[locale]}</em>
            </h2>
          </AnimatedChild>
        </AnimatedSection>

        <AnimatedSection
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          staggerChildren={0.08}
        >
          {t.items.map((area) => (
            <AnimatedChild key={area.num} className="h-full">
              <AreaCard
                num={area.num}
                title={area.title[locale]}
                desc={area.desc[locale]}
              />
            </AnimatedChild>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
