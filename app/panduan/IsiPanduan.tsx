import type { CSSProperties, ReactNode } from "react";

export const namaTahap: Record<string, string> = {
  "persiapan-lahan": "Persiapan lahan",
  persemaian: "Persemaian",
  penanaman: "Penanaman",
  perawatan: "Perawatan",
  pemupukan: "Pemupukan",
  "hama-penyakit": "Hama dan penyakit",
  panen: "Panen",
  evaluasi: "Evaluasi",
};

export const namaJenisIsi: Record<string, string> = {
  pengalaman: "Pengalaman lapangan pribadi",
  umum: "Acuan umum / referensi",
};

type Span = { _key: string; _type: "span"; text: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string };

export type BlokTeks = {
  _key: string;
  _type: "block";
  style?: string;
  listItem?: "bullet" | "number";
  children: Span[];
  markDefs?: MarkDef[];
};

export type BlokGambar = {
  _key: string;
  _type: "image";
  url?: string | null;
  alt?: string;
};

export type Blok = BlokTeks | BlokGambar;

const gayaP: CSSProperties = {
  margin: "0 0 1.1em",
  lineHeight: 1.75,
  fontSize: 17,
  whiteSpace: "pre-line",
};
const gayaH2: CSSProperties = {
  margin: "1.8em 0 0.6em",
  fontSize: 26,
  lineHeight: 1.25,
  color: "#142e45",
};
const gayaH3: CSSProperties = {
  margin: "1.6em 0 0.5em",
  fontSize: 21,
  lineHeight: 1.3,
  color: "#142e45",
};
const gayaH4: CSSProperties = {
  margin: "1.4em 0 0.5em",
  fontSize: 18,
  lineHeight: 1.3,
  color: "#142e45",
};
const gayaKutipan: CSSProperties = {
  margin: "1.2em 0",
  padding: "0.4em 0 0.4em 1em",
  borderLeft: "4px solid #285b7a",
  color: "#374151",
  fontStyle: "italic",
  lineHeight: 1.75,
};
const gayaDaftar: CSSProperties = {
  margin: "0 0 1.1em",
  paddingLeft: "1.4em",
  lineHeight: 1.75,
  fontSize: 17,
};

export function Foto({ src, alt }: { src: string; alt: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{ width: "100%", height: "auto", display: "block", borderRadius: 12 }}
    />
  );
}

function Teks({ blok }: { blok: BlokTeks }) {
  return (
    <>
      {blok.children.map((span) => {
        let node: ReactNode = span.text;
        for (const mark of span.marks ?? []) {
          if (mark === "strong") {
            node = <strong>{node}</strong>;
          } else if (mark === "em") {
            node = <em>{node}</em>;
          } else {
            const def = blok.markDefs?.find((d) => d._key === mark);
            if (def?.href) {
              node = (
                <a href={def.href} style={{ color: "#285b7a", textDecoration: "underline" }}>
                  {node}
                </a>
              );
            }
          }
        }
        return <span key={span._key}>{node}</span>;
      })}
    </>
  );
}

export default function IsiPanduan({ isi }: { isi: Blok[] }) {
  const hasil: ReactNode[] = [];
  let i = 0;

  while (i < isi.length) {
    const blok = isi[i];

    if (blok._type === "image") {
      if (blok.url) {
        hasil.push(
          <figure key={blok._key} style={{ margin: "1.6em 0" }}>
            <Foto src={`${blok.url}?w=1200&auto=format`} alt={blok.alt || ""} />
            {blok.alt ? (
              <figcaption style={{ marginTop: 8, fontSize: 14, color: "#6b7280" }}>
                {blok.alt}
              </figcaption>
            ) : null}
          </figure>
        );
      }
      i += 1;
      continue;
    }

    if (blok.listItem) {
      const jenis = blok.listItem;
      const butir: BlokTeks[] = [];
      while (i < isi.length) {
        const b = isi[i];
        if (b._type === "block" && b.listItem === jenis) {
          butir.push(b);
          i += 1;
        } else {
          break;
        }
      }
      const Daftar = jenis === "number" ? "ol" : "ul";
      hasil.push(
        <Daftar key={butir[0]._key} style={gayaDaftar}>
          {butir.map((b) => (
            <li key={b._key}>
              <Teks blok={b} />
            </li>
          ))}
        </Daftar>
      );
      continue;
    }

    if (blok.children.every((c) => !c.text.trim())) {
      i += 1;
      continue;
    }

    const isiTeks = <Teks blok={blok} />;
    if (blok.style === "h2") {
      hasil.push(<h2 key={blok._key} style={gayaH2}>{isiTeks}</h2>);
    } else if (blok.style === "h3") {
      hasil.push(<h3 key={blok._key} style={gayaH3}>{isiTeks}</h3>);
    } else if (blok.style === "h4") {
      hasil.push(<h4 key={blok._key} style={gayaH4}>{isiTeks}</h4>);
    } else if (blok.style === "blockquote") {
      hasil.push(<blockquote key={blok._key} style={gayaKutipan}>{isiTeks}</blockquote>);
    } else {
      hasil.push(<p key={blok._key} style={gayaP}>{isiTeks}</p>);
    }
    i += 1;
  }

  return <div>{hasil}</div>;
}
