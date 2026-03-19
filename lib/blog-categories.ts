export const blogCategories = [
  { value: "direito-familia", label: { pt: "Direito da Família", en: "Family Law" } },
  { value: "direito-trabalho", label: { pt: "Direito do Trabalho", en: "Labor Law" } },
  { value: "direito-penal", label: { pt: "Direito Penal", en: "Criminal Law" } },
  { value: "direito-civil", label: { pt: "Direito Civil", en: "Civil Law" } },
  { value: "direito-comercial", label: { pt: "Direito Comercial", en: "Commercial Law" } },
  { value: "direito-imobiliario", label: { pt: "Direito Imobiliário", en: "Real Estate Law" } },
  { value: "direito-administrativo", label: { pt: "Direito Administrativo", en: "Administrative Law" } },
  { value: "direito-fiscal", label: { pt: "Direito Fiscal", en: "Tax Law" } },
  { value: "geral", label: { pt: "Geral", en: "General" } },
] as const

export type BlogCategory = (typeof blogCategories)[number]["value"]

export function getCategoryLabel(value: string, locale: "pt" | "en"): string {
  const cat = blogCategories.find((c) => c.value === value)
  return cat ? cat.label[locale] : value
}
