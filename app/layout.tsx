import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "Bie Bie Farm — Belajar Pertanian dari Pengalaman Nyata",
    template: "%s | Bie Bie Farm"
  },
  description:
    "Catatan, panduan, dan pengalaman nyata bertani dari Bie Bie Farm. Belajar budidaya dengan pendekatan praktis, teknologi, dan inovasi.",
  openGraph: {
    title: "Bie Bie Farm",
    description: "Belajar Pertanian dari Pengalaman Nyata.",
    type: "website",
    locale: "id_ID"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
