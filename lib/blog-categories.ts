import type { Locale } from "./translations"

export const blogCategories = [
  {
    value: "direito-familia",
    label: {
      pt: "Direito da Família", en: "Family Law", es: "Derecho de Familia",
      fr: "Droit de la Famille", zh: "家庭法", ja: "家族法",
      hi: "पारिवारिक कानून", ar: "قانون الأسرة", de: "Familienrecht", ru: "Семейное право",
    },
  },
  {
    value: "direito-trabalho",
    label: {
      pt: "Direito do Trabalho", en: "Labor Law", es: "Derecho Laboral",
      fr: "Droit du Travail", zh: "劳动法", ja: "労働法",
      hi: "श्रम कानून", ar: "قانون العمل", de: "Arbeitsrecht", ru: "Трудовое право",
    },
  },
  {
    value: "direito-penal",
    label: {
      pt: "Direito Penal", en: "Criminal Law", es: "Derecho Penal",
      fr: "Droit Pénal", zh: "刑法", ja: "刑法",
      hi: "आपराधिक कानून", ar: "القانون الجنائي", de: "Strafrecht", ru: "Уголовное право",
    },
  },
  {
    value: "direito-civil",
    label: {
      pt: "Direito Civil", en: "Civil Law", es: "Derecho Civil",
      fr: "Droit Civil", zh: "民法", ja: "民法",
      hi: "नागरिक कानून", ar: "القانون المدني", de: "Zivilrecht", ru: "Гражданское право",
    },
  },
  {
    value: "direito-comercial",
    label: {
      pt: "Direito Comercial", en: "Commercial Law", es: "Derecho Comercial",
      fr: "Droit Commercial", zh: "商法", ja: "商法",
      hi: "वाणिज्यिक कानून", ar: "القانون التجاري", de: "Handelsrecht", ru: "Коммерческое право",
    },
  },
  {
    value: "direito-imobiliario",
    label: {
      pt: "Direito Imobiliário", en: "Real Estate Law", es: "Derecho Inmobiliario",
      fr: "Droit Immobilier", zh: "房地产法", ja: "不動産法",
      hi: "अचल संपत्ति कानून", ar: "القانون العقاري", de: "Immobilienrecht", ru: "Недвижимость",
    },
  },
  {
    value: "direito-administrativo",
    label: {
      pt: "Direito Administrativo", en: "Administrative Law", es: "Derecho Administrativo",
      fr: "Droit Administratif", zh: "行政法", ja: "行政法",
      hi: "प्रशासनिक कानून", ar: "القانون الإداري", de: "Verwaltungsrecht", ru: "Административное право",
    },
  },
  {
    value: "direito-fiscal",
    label: {
      pt: "Direito Fiscal", en: "Tax Law", es: "Derecho Fiscal",
      fr: "Droit Fiscal", zh: "税法", ja: "税法",
      hi: "कर कानून", ar: "قانون الضرائب", de: "Steuerrecht", ru: "Налоговое право",
    },
  },
  {
    value: "geral",
    label: {
      pt: "Geral", en: "General", es: "General",
      fr: "Général", zh: "一般", ja: "一般",
      hi: "सामान्य", ar: "عام", de: "Allgemein", ru: "Общее",
    },
  },
] as const

export type BlogCategory = (typeof blogCategories)[number]["value"]

export function getCategoryLabel(value: string, locale: Locale): string {
  const cat = blogCategories.find((c) => c.value === value)
  return cat ? cat.label[locale] : value
}
