import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "../../../sanity/lib/client";
import IsiPanduan, { Foto, namaJenisIsi, namaTahap, type Blok } from "../IsiPanduan";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

type Detail = {
  judul: string;
  tahap?: string;
  jenisIsi?: string;
  ringkasan?: string;
  kondisiKebun?: string;
  diperbarui?: string;
  fotoUrl?: string | null;
  fotoAlt?: string;
  isi?: Blok[];
};

const query = `*[_type == "panduan" && slug.current == $slug][0]{
  judul,
  tahap,
  jenisIsi,
  ringkasan,
  kondisiKebun,
  diperbarui,
  "fotoUrl": fotoSampul.asset->url,
  "fotoAlt": fotoSampul.alt,
  "isi": isi[]{ ..., "url": asset->url }
}`;

async function ambil(slug: string): Promise<Detail | null> {
  try {
    return await client.fetch<Detail | null>(query, { slug });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await ambil(slug);
  if (!p) return { title: "Panduan tidak ditemukan" };
  return {
    title: p.judul,
    description: p.ringkasan,
    openGraph: {
      title: p.judul,
      description: p.ringkasan,
      type: "article",
      locale: "id_ID",
      images: p.fotoUrl
        ? [`${p.fotoUrl}?w=1200&h=630&fit=crop&auto=format`]
        : undefined,
    },
  };
}

export default async function DetailPanduan({ params }: Props) {
  const { slug } = await params;
  const p = await ambil(slug);
  if (!p) notFound();

  const tanggal = p.diperbarui
    ? new Date(p.diperbarui).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f9fb", color: "#1f2937" }}>
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 72px" }}>
        <nav style={{ display: "flex", gap: 16, fontSize: 15 }}>
          <Link href="/" style={{ color: "#285b7a", textDecoration: "none" }}>
            ← Bie Bie Farm
          </Link>
          <Link href="/panduan" style={{ color: "#285b7a", textDecoration: "none" }}>
            Semua panduan
          </Link>
        </nav>

        {p.tahap && namaTahap[p.tahap] ? (
          <div style={{ marginTop: 22, fontSize: 13, letterSpacing: 0.5, color: "#285b7a" }}>
            {namaTahap[p.tahap]}
          </div>
        ) : null}

        <h1 style={{ margin: "8px 0 12px", fontSize: 36, lineHeight: 1.2, color: "#142e45" }}>
          {p.judul}
        </h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 14, color: "#6b7280" }}>
          {p.jenisIsi && namaJenisIsi[p.jenisIsi] ? (
            <span
              style={{
                background: "#e8f0f6",
                color: "#285b7a",
                padding: "3px 10px",
                borderRadius: 999,
              }}
            >
              {namaJenisIsi[p.jenisIsi]}
            </span>
          ) : null}
          {tanggal ? <span>Diperbarui {tanggal}</span> : null}
        </div>

        {p.ringkasan ? (
          <p style={{ margin: "20px 0 0", fontSize: 18, lineHeight: 1.7, color: "#374151" }}>
            {p.ringkasan}
          </p>
        ) : null}

        {p.fotoUrl ? (
          <div style={{ margin: "24px 0" }}>
            <Foto
              src={`${p.fotoUrl}?w=1400&auto=format`}
              alt={p.fotoAlt || p.judul}
            />
          </div>
        ) : null}

        {p.kondisiKebun ? (
          <div
            style={{
              margin: "20px 0",
              padding: "14px 16px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              fontSize: 15,
              lineHeight: 1.65,
              whiteSpace: "pre-line",
            }}
          >
            <b style={{ color: "#142e45" }}>Kondisi kebun saat itu</b>
            <br />
            {p.kondisiKebun}
          </div>
        ) : null}

        <div style={{ marginTop: 28 }}>
          {p.isi && p.isi.length > 0 ? <IsiPanduan isi={p.isi} /> : null}
        </div>
      </article>
    </div>
  );
}
