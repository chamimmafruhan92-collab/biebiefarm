import type { Metadata } from "next";
import Link from "next/link";
import { client } from "../../sanity/lib/client";
import { Foto, namaTahap } from "./IsiPanduan";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Panduan",
  description: "Panduan budidaya dari pengalaman nyata di kebun Bie Bie Farm.",
};

type Ringkas = {
  _id: string;
  judul: string;
  slug: string;
  tahap?: string;
  ringkasan?: string;
  fotoUrl?: string | null;
};

const query = `*[_type == "panduan" && defined(slug.current)] | order(diperbarui desc) {
  _id,
  judul,
  "slug": slug.current,
  tahap,
  ringkasan,
  "fotoUrl": fotoSampul.asset->url
}`;

async function ambilDaftar(): Promise<Ringkas[]> {
  try {
    return await client.fetch<Ringkas[]>(query);
  } catch {
    return [];
  }
}

export default async function DaftarPanduan() {
  const daftar = await ambilDaftar();

  return (
    <div style={{ minHeight: "100vh", background: "#f7f9fb", color: "#142e45" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 20px 64px" }}>
        <Link href="/" style={{ color: "#285b7a", textDecoration: "none", fontSize: 15 }}>
          ← Bie Bie Farm
        </Link>
        <h1 style={{ margin: "18px 0 8px", fontSize: 34, lineHeight: 1.2 }}>Panduan</h1>
        <p style={{ margin: "0 0 28px", color: "#4b5563", lineHeight: 1.6 }}>
          Catatan dan panduan budidaya dari pengalaman nyata di kebun.
        </p>

        {daftar.length === 0 ? (
          <p style={{ color: "#4b5563" }}>Belum ada panduan yang diterbitkan.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {daftar.map((p) => (
              <Link
                key={p._id}
                href={`/panduan/${p.slug}`}
                style={{
                  display: "block",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {p.fotoUrl ? (
                  <Foto src={`${p.fotoUrl}?w=600&h=400&fit=crop&auto=format`} alt={p.judul} />
                ) : null}
                <div style={{ padding: 16 }}>
                  {p.tahap && namaTahap[p.tahap] ? (
                    <div style={{ fontSize: 12, letterSpacing: 0.5, color: "#285b7a", marginBottom: 6 }}>
                      {namaTahap[p.tahap]}
                    </div>
                  ) : null}
                  <h2 style={{ margin: "0 0 8px", fontSize: 20, lineHeight: 1.3 }}>{p.judul}</h2>
                  {p.ringkasan ? (
                    <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.6, fontSize: 15 }}>
                      {p.ringkasan}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
