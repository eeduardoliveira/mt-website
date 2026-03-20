"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations, LOCALE_META, Locale } from "@/lib/translations";

const locales = Object.keys(LOCALE_META) as Locale[];

export function Nav() {
  const { locale, setLocale } = useLanguage();
  const t = translations.nav;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: t.areas[locale], href: "#areas" },
    { label: t.about[locale], href: "#sobre" },
    { label: t.blog[locale], href: "/blog" },
    { label: t.contact[locale], href: "#contacto" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)] py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          <Logo />

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[11px] font-body font-medium tracking-widest uppercase text-ink-muted hover:text-ink transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}

            {/* Language dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((prev) => !prev)}
                className="flex items-center gap-1 text-[11px] font-body font-medium tracking-widest uppercase text-ink-muted hover:text-ink transition-colors duration-300"
              >
                {locale.toUpperCase()}
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-white border border-border shadow-lg rounded-sm py-1 min-w-[160px] z-50"
                  >
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setLocale(loc);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-body transition-colors duration-150 ${
                          loc === locale
                            ? "text-gold font-medium"
                            : "text-ink-muted hover:text-ink hover:bg-cream/50"
                        }`}
                      >
                        {LOCALE_META[loc].name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="#contacto"
              className="text-[11px] font-body font-medium tracking-widest uppercase border border-gold text-gold px-6 py-2.5 hover:bg-gold hover:text-white transition-all duration-300"
            >
              {t.cta[locale]}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 -mr-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5 text-ink" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center"
          >
            <button
              className="absolute top-6 right-6 p-2"
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5 text-ink" />
            </button>

            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-3xl font-light text-ink"
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Mobile language list */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap justify-center gap-3 max-w-xs"
              >
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setLocale(loc);
                      setMobileOpen(false);
                    }}
                    className={`text-sm font-body px-3 py-1.5 border transition-colors duration-200 ${
                      loc === locale
                        ? "border-gold text-gold"
                        : "border-border text-ink-muted hover:text-ink hover:border-ink"
                    }`}
                  >
                    {LOCALE_META[loc].name}
                  </button>
                ))}
              </motion.div>

              <motion.a
                href="#contacto"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 text-[11px] font-body font-medium tracking-widest uppercase border border-gold text-gold px-8 py-3 hover:bg-gold hover:text-white transition-all duration-300"
              >
                {t.cta[locale]}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
