"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const ease = [0.22, 1, 0.36, 1] as const;

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let frame: number;
    const duration = 1500;
    const start = performance.now();

    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function Hero() {
  const { locale } = useLanguage();
  const t = translations.hero;

  const heroLines = [
    { text: t.line1[locale], italic: false },
    { text: t.line2[locale], italic: false },
    { text: t.line3[locale], italic: true },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 pt-28 lg:pt-0">
        {/* Left column */}
        <div className="flex flex-col justify-center z-10 lg:pr-16">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease }}
            className="text-[11px] font-body font-medium tracking-widest uppercase text-gold mb-8"
          >
            {t.eyebrow[locale]}
          </motion.span>

          <h1 className="mb-8">
            {heroLines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.12, duration: 0.8, ease }}
                  className={`block font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.1] font-light ${
                    line.italic ? "italic text-gold" : "text-ink"
                  }`}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease }}
            className="font-display text-lg lg:text-xl font-light italic text-ink-muted max-w-md mb-10 leading-relaxed"
          >
            {t.subtitle[locale]}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8, ease }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#contacto"
              className="bg-gold text-white text-[11px] font-body font-medium tracking-widest uppercase px-8 py-3.5 hover:bg-gold-light transition-all duration-300 hover:scale-[1.02]"
            >
              {t.cta1[locale]}
            </a>
            <a
              href="#areas"
              className="text-[11px] font-body font-medium tracking-widest uppercase text-ink border border-border px-8 py-3.5 hover:border-ink transition-all duration-300"
            >
              {t.cta2[locale]}
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="hidden lg:flex items-center gap-3 mt-20"
          >
            <span className="text-[10px] font-body tracking-widest uppercase text-ink-muted [writing-mode:vertical-lr]">
              {t.scroll[locale]}
            </span>
            <motion.div
              className="w-[1px] h-12 bg-border origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.4, duration: 0.8, ease }}
            />
          </motion.div>
        </div>

        {/* Right column */}
        <div className="relative lg:h-screen flex items-end lg:items-center justify-center">
          <motion.div
            initial={{ scale: 1.04, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.2, ease }}
            className="relative w-full aspect-[3/4] lg:aspect-auto lg:h-[85vh] max-h-[900px]"
          >
            {/* Gradient fade on left edge */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 hidden lg:block" />

            <Image
              src="/margarida-perfil.jpeg"
              alt="Margarida Tempera, Advogada"
              fill
              priority
              className="object-cover object-top"
              style={{ filter: "saturate(0.88)" }}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease }}
            className="absolute bottom-8 right-4 lg:bottom-16 lg:right-0 z-20 flex flex-col gap-3"
          >
            <div className="bg-white/95 backdrop-blur-sm border border-border px-6 py-4">
              <p className="font-display text-3xl font-light text-gold">
                <CountUp target={5} suffix="+" />
              </p>
              <p className="text-[10px] font-body font-medium tracking-widest uppercase text-ink-muted mt-1">
                {t.stat1label[locale]}
              </p>
            </div>
            <div className="bg-white/95 backdrop-blur-sm border border-border px-6 py-4">
              <p className="font-display text-3xl font-light text-gold">{t.stat2value[locale]}</p>
              <p className="text-[10px] font-body font-medium tracking-widest uppercase text-ink-muted mt-1">
                {t.stat2label[locale]}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
