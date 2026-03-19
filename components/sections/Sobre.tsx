"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { SectionLabel } from "../ui/SectionLabel";
import { AnimatedSection, AnimatedChild } from "../ui/AnimatedSection";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const ease = [0.22, 1, 0.36, 1] as const;

export function Sobre() {
  const { locale } = useLanguage();
  const t = translations.sobre;

  const dividerRef = useRef(null);
  const dividerInView = useInView(dividerRef, { once: true, margin: "-80px" });

  const frameRef = useRef(null);
  const frameInView = useInView(frameRef, { once: true, margin: "-80px" });

  const badgeLines = t.badge[locale].split("\n");

  return (
    <section id="sobre" className="py-24 lg:py-36 bg-off-white">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left: Photo block */}
        <div className="relative" ref={frameRef}>
          <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0">
            {/* Offset gold border frame */}
            <motion.div
              className="absolute -right-4 -bottom-4 w-full h-full border-2 border-gold"
              initial={{ opacity: 0, x: -12, y: -12 }}
              animate={
                frameInView
                  ? { opacity: 1, x: 0, y: 0 }
                  : { opacity: 0, x: -12, y: -12 }
              }
              transition={{ duration: 0.8, delay: 0.3, ease }}
            />

            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="/margarida-perfil.jpeg"
                alt="Margarida Tempera"
                fill
                className="object-cover object-top"
                style={{ filter: "saturate(0.88)" }}
                sizes="(max-width: 1024px) 100vw, 450px"
              />
            </div>

            {/* Badge */}
            <div className="absolute -top-3 -right-3 lg:top-6 lg:-right-6 bg-white border border-border px-4 py-3 z-10">
              <p className="text-[9px] font-body font-medium tracking-widest uppercase text-ink-muted leading-tight">
                {badgeLines[0]}
                <br />
                {badgeLines[1]}
              </p>
            </div>

            {/* Pullquote */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6 pt-16">
              <p className="font-display text-lg italic text-white font-light leading-relaxed">
                &ldquo;{t.pullquote[locale]}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col justify-center">
          <AnimatedSection staggerChildren={0.12}>
            <AnimatedChild>
              <SectionLabel text={t.eyebrow[locale]} className="mb-8" />
            </AnimatedChild>

            <AnimatedChild>
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.15] text-ink mb-10">
                {t.title1[locale]}
                <br />{t.title2[locale]} <em className="italic text-gold">{t.titleAccent[locale]}</em>
              </h2>
            </AnimatedChild>

            <AnimatedChild>
              <p className="text-sm font-body font-light leading-relaxed text-ink-muted mb-6">
                {t.p1[locale]}
              </p>
            </AnimatedChild>

            <AnimatedChild>
              <p className="text-sm font-body font-light leading-relaxed text-ink-muted mb-10">
                {t.p2[locale]}
              </p>
            </AnimatedChild>

            <AnimatedChild>
              <div ref={dividerRef} className="mb-10">
                <motion.div
                  className="h-[1px] bg-gold origin-left"
                  initial={{ scaleX: 0 }}
                  animate={dividerInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.8, ease }}
                />
              </div>
            </AnimatedChild>

            <AnimatedChild>
              <ul className="space-y-3">
                {t.credentials.map((cred, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[13px] font-body font-light text-ink leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                    {cred[locale]}
                  </li>
                ))}
              </ul>
            </AnimatedChild>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
