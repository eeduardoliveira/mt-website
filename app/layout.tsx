import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { LanguageWrapper } from "./language-wrapper";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Margarida Tempera — Escritório de Advogados",
  description:
    "Assessoria jurídica rigorosa e personalizada. Serviços jurídicos de excelência para particulares, famílias e empresas em Portugal.",
  keywords: [
    "advogado Lisboa",
    "escritório de advogados",
    "direito do trabalho",
    "direito civil",
    "Margarida Tempera",
  ],
  openGraph: {
    title: "Margarida Tempera — Escritório de Advogados",
    description:
      "Assessoria jurídica rigorosa e personalizada em Portugal.",
    locale: "pt_PT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${montserrat.variable} font-body antialiased bg-white text-ink`}
      >
        <LanguageWrapper>{children}</LanguageWrapper>
      </body>
    </html>
  );
}
