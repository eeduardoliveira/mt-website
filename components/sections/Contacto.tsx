"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Mail, MapPin, Linkedin } from "lucide-react";
import { SectionLabel } from "../ui/SectionLabel";
import { AnimatedSection, AnimatedChild } from "../ui/AnimatedSection";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  area: string;
  message: string;
};

const inputBase =
  "w-full bg-transparent border-0 border-b border-border py-3 text-sm font-body font-light text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-gold transition-colors duration-300";

export function Contacto() {
  const { locale } = useLanguage();
  const t = translations.contacto;
  const tAreas = translations.areas;

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const contactSchema = z.object({
    name: z.string().min(2, t.validation.name[locale]),
    email: z.string().email(t.validation.email[locale]),
    phone: z.string().optional(),
    area: z.string().min(1, t.validation.area[locale]),
    message: z.string().min(10, t.validation.message[locale]),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const contactInfo = [
    { icon: Mail, label: "margaridatempera.adv@gmail.com", href: "mailto:margaridatempera.adv@gmail.com" },
    { icon: MapPin, label: t.location[locale], href: null },
    { icon: Linkedin, label: "linkedin.com/in/margaridatempera", href: "https://linkedin.com/in/margaridatempera" },
  ];

  const areaOptions = [
    ...tAreas.items.map((a) => a.title[locale]),
    t.form.other[locale],
  ];

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      setSubmitted(true);
    } catch {
      alert(locale === "pt" ? "Erro ao enviar. Por favor, tente novamente." : "Error sending. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 lg:py-36 bg-white">
      <div className="max-w-[1320px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left */}
        <AnimatedSection staggerChildren={0.12}>
          <AnimatedChild>
            <SectionLabel text={t.eyebrow[locale]} className="mb-8" />
          </AnimatedChild>

          <AnimatedChild>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.15] text-ink mb-6">
              {t.title1[locale]}
              <br />
              <em className="italic text-gold">{t.titleAccent[locale]}</em>
              <br />{t.title3[locale]}
            </h2>
          </AnimatedChild>

          <AnimatedChild>
            <p className="text-sm font-body font-light leading-relaxed text-ink-muted mb-12 max-w-md">
              {t.subtitle[locale]}
            </p>
          </AnimatedChild>

          <AnimatedChild>
            <div className="space-y-4">
              {contactInfo.map((item, i) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-3 group">
                    <Icon className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span className="text-sm font-body font-light text-ink-muted group-hover:text-ink transition-colors">
                      {item.label}
                    </span>
                  </div>
                );

                return item.href ? (
                  <a
                    key={i}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={i}>{content}</div>
                );
              })}
            </div>
          </AnimatedChild>
        </AnimatedSection>

        {/* Right: Form */}
        <AnimatedSection staggerChildren={0.08}>
          {submitted ? (
            <AnimatedChild>
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="font-display text-2xl font-light text-ink mb-3">
                  {t.form.successTitle[locale]}
                </p>
                <p className="text-sm font-body font-light text-ink-muted">
                  {t.form.successText[locale]}
                </p>
              </div>
            </AnimatedChild>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <AnimatedChild>
                <div>
                  <input
                    {...register("name")}
                    placeholder={t.form.name[locale]}
                    className={inputBase}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-gold mt-1">{errors.name.message}</p>
                  )}
                </div>
              </AnimatedChild>

              <AnimatedChild>
                <div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder={t.form.email[locale]}
                    className={inputBase}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-gold mt-1">{errors.email.message}</p>
                  )}
                </div>
              </AnimatedChild>

              <AnimatedChild>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder={t.form.phone[locale]}
                  className={inputBase}
                />
              </AnimatedChild>

              <AnimatedChild>
                <div>
                  <select
                    {...register("area")}
                    defaultValue=""
                    className={`${inputBase} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>
                      {t.form.area[locale]}
                    </option>
                    {areaOptions.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {errors.area && (
                    <p className="text-[11px] text-gold mt-1">{errors.area.message}</p>
                  )}
                </div>
              </AnimatedChild>

              <AnimatedChild>
                <div>
                  <textarea
                    {...register("message")}
                    placeholder={t.form.message[locale]}
                    rows={4}
                    className={`${inputBase} resize-none`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-gold mt-1">{errors.message.message}</p>
                  )}
                </div>
              </AnimatedChild>

              <AnimatedChild>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold text-white text-[11px] font-body font-medium tracking-widest uppercase py-4 hover:bg-gold-light transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                >
                  {submitting ? t.form.submitting[locale] : t.form.submit[locale]}
                </button>
              </AnimatedChild>
            </form>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
