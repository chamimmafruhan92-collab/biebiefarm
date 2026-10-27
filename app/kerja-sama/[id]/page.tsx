import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "../../../sanity/lib/client";
import { Foto } from "../../panduan/IsiPanduan";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

type FotoData = { _key: string; url?: string | null; alt?: string | null };

type Detail = {
  namaPerusahaan: string;
  bentukKolaborasi?: string | null;
  keterangan?: string | null;
  tautan?: string | null;
  tanggalMulai?: string | null;
  logoUrl?: string | null;
  logoAlt?: string | null;
  fotos?: FotoData[] | null;
};

const query = `*[_type == "kerjaSamaAktif" && _id == $id && status == "aktif" && izinTayang == true][0]{
  namaPerusahaan, bentukKolaborasi, keterangan, tautan, tanggalMulai,
  "logoUrl": logo.asset->url,
  "logoAlt": logo.alt,
  "fotos": dokumentasi[defined(asset)]{ _key, "url": asset->url, alt }
}`;

async function ambil(id: string): Promise<Detail | null> {
  try {
    return await client.fetch<Detail | null>(query, { id });
  } catch {
    return null;
  }
}

function urlAman(u?: string | null): string | null {
  return u && /^https?:\/\//i.test(u.trim()) ? u.trim() : null;
}

function tanggalIndo(t?: string | null): string | null {
  if (!t) return null;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const k = await ambil(id);
  if (!k) return { title: "Kerja sama tidak ditemukan" };
  const judul = `Kerja Sama dengan ${k.namaPerusahaan}`;
  const deskripsi = k.keterangan || k.bentukKolaborasi || undefined;
  const gambar = k.fotos?.find((f) => f.url)?.url || k.logoUrl;
  return {
    title: judul,
    description: deskripsi,
    openGraph: {
      title: judul,
      description: deskripsi,
      type: "article",
      locale: "id_ID",
      images: gambar ? [`${gambar}?w=1200&h=630&fit=crop&auto=format`] : undefined,
    },
  };
}

export default async function DetailKerjaSama({ params }: Props) {
  const { id } = await params;
  const k = await ambil(id);
  if (!k) notFound();

  const foto = (k.fotos ?? []).filter(
    (f): f is { _key: string; url: string; alt?: string | null } => Boolean(f.url)
  );
  const mulai = tanggalIndo(k.tanggalMulai);
  const tautanK = urlAman(k.tautan);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f9fb", color: "#1f2937" }}>
      <article style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 72px" }}>
        <nav style={{ display: "flex", gap: 16, fontSize: 15 }}>
          <Link href="/" style={{ color: "#285b7a", textDecoration: "none" }}>
            ← Bie Bie Farm
          </Link>
          <Link href="/#kerja-sama-aktif" style={{ color: "#285b7a", textDecoration: "none" }}>
            Semua kerja sama aktif
          </Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 28 }}>
          {k.logoUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${k.logoUrl}?w=300&auto=format`}
                alt={k.logoAlt || `Logo ${k.namaPerusahaan}`}
                style={{ width: 72, height: 72, objectFit: "contain", flexShrink: 0 }}
              />
            </>
          ) : null}
          <div>
            <div style={{ fontSize: 12, letterSpacing: 1.3, fontWeight: 700, color: "#1f7a4d" }}>
              ● KERJA SAMA AKTIF
            </div>
            <h1 style={{ margin: "6px 0 0", fontSize: 34, lineHeight: 1.2, color: "#142e45" }}>
              {k.namaPerusahaan}
            </h1>
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            padding: "16px 18px",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            display: "grid",
            gap: 14,
          }}
        >
          {k.bentukKolaborasi ? (
            <div>
              <div style={{ fontSize: 11, letterSpacing: 1.3, fontWeight: 700, color: "#788994" }}>
                BENTUK KOLABORASI
              </div>
              <p style={{ margin: "4px 0 0", fontWeight: 600, lineHeight: 1.6 }}>{k.bentukKolaborasi}</p>
            </div>
          ) : null}
          {k.keterangan ? (
            <p style={{ margin: 0, lineHeight: 1.75, whiteSpace: "pre-line" }}>{k.keterangan}</p>
          ) : null}
          {mulai ? <small style={{ color: "#6b7280" }}>Kerja sama sejak {mulai}</small> : null}
          {tautanK ? (
            <a
              href={tautanK}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#285b7a", textDecoration: "underline" }}
            >
              Kunjungi situs resmi perusahaan →
            </a>
          ) : null}
        </div>

        {foto.length > 0 ? (
          <section style={{ marginTop: 36 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 24, color: "#142e45" }}>Dokumentasi</h2>
            <p style={{ margin: "0 0 18px", color: "#6b7280" }}>{foto.length} foto</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 22,
              }}
            >
              {foto.map((f) => (
                <figure key={f._key} style={{ margin: 0 }}>
                  <Foto
                    src={`${f.url}?w=1200&auto=format`}
                    alt={f.alt || `Dokumentasi bersama ${k.namaPerusahaan}`}
                  />
                  {f.alt ? (
                    <figcaption style={{ marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "#4b5563" }}>
                      {f.alt}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <p style={{ marginTop: 40, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
          Informasi dan foto di halaman ini ditampilkan dengan persetujuan perusahaan yang bersangkutan.
        </p>
      </article>
    </div>
  );
}
