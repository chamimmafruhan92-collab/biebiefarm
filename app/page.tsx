import Link from "next/link";
import {
  ArrowDownToLine, ArrowRight, BookOpen, Sprout, FlaskConical,
  Camera, Leaf, MapPin, Menu, MessageCircle, Tractor, Users, Wheat
} from "lucide-react";
import { client } from "../sanity/lib/client";
import { namaTahap } from "./panduan/IsiPanduan";

export const revalidate = 60;

async function ambilFotoHero(): Promise<{ url: string; alt: string } | null> {
  try {
    const hasil = await client.fetch<{ url?: string | null; alt?: string | null } | null>(
      `*[_id == "pengaturanBeranda"][0]{ "url": fotoHero.asset->url, "alt": fotoHero.alt }`
    );
    return hasil?.url ? { url: hasil.url, alt: hasil.alt || "" } : null;
  } catch {
    return null;
  }
}

type PanduanRingkas = {
  _id: string;
  judul: string;
  slug: string;
  tahap?: string;
  ringkasan?: string;
};

const queryPanduan = `*[_type == "panduan" && defined(slug.current)] | order(diperbarui desc)[0...6]{
  _id,
  judul,
  "slug": slug.current,
  tahap,
  ringkasan
}`;

async function ambilPanduan(): Promise<PanduanRingkas[]> {
  try {
    return await client.fetch<PanduanRingkas[]>(queryPanduan);
  } catch {
    return [];
  }
}

type Konten = {
  tentangParagraf?: string[] | null;
  kerjaSamaTeks?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
};

async function ambilKonten(): Promise<Konten | null> {
  try {
    return await client.fetch<Konten | null>(
      `*[_id == "tentangKerjaSama"][0]{ tentangParagraf, kerjaSamaTeks, whatsapp, email, instagram, tiktok, facebook }`
    );
  } catch {
    return null;
  }
}

type Entri = {
  _id: string;
  judul: string;
  kategori?: string | null;
  tanggal?: string | null;
  keterangan?: string | null;
  fotoUrl?: string | null;
  fotoAlt?: string | null;
};

async function ambilDokumentasi(): Promise<Entri[]> {
  try {
    return await client.fetch<Entri[]>(
      `*[_type == "dokumentasi" && defined(foto.asset)] | order(tanggal desc, _createdAt desc)[0...4]{
        _id, judul, kategori, tanggal, keterangan,
        "fotoUrl": foto.asset->url,
        "fotoAlt": foto.alt
      }`
    );
  } catch {
    return [];
  }
}

type KerjaSama = {
  _id: string;
  namaPerusahaan: string;
  bentukKolaborasi?: string | null;
  keterangan?: string | null;
  logoUrl?: string | null;
  logoAlt?: string | null;
  tautan?: string | null;
  tanggalMulai?: string | null;
  fotos?: { url: string; alt?: string | null }[] | null;
};

async function ambilKerjaSamaAktif(): Promise<KerjaSama[]> {
  try {
    return await client.fetch<KerjaSama[]>(
      `*[_type == "kerjaSamaAktif" && status == "aktif" && izinTayang == true]
        | order(tanggalMulai desc, _createdAt desc)[0...6]{
        _id, namaPerusahaan, bentukKolaborasi, keterangan, tautan, tanggalMulai,
        "logoUrl": logo.asset->url,
        "logoAlt": logo.alt,
        "fotos": dokumentasi[defined(asset)][0...3]{ "url": asset->url, "alt": alt }
      }`
    );
  } catch {
    return [];
  }
}

const tentangBawaan = [
  "Bie Bie Farm adalah ruang berbagi tentang pertanian dari sudut pandang orang yang menjalaninya sendiri.",
  "Kami percaya pengalaman di kebun punya banyak hal untuk dipelajari—termasuk saat rencana tidak berjalan sesuai harapan. Di sini, proses, pengamatan, dan evaluasi sama pentingnya dengan hasil.",
];

const kerjaSamaBawaan =
  "Terbuka untuk diskusi dan kerja sama yang relevan dengan edukasi serta dunia pertanian.";

const labelKategori: Record<string, string> = {
  "jurnal-petani": "JURNAL PETANI",
  "catatan-praktik": "CATATAN PRAKTIK",
};

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

const guides = [
  { number: "01", category: "BUDIDAYA", title: "Panduan Budidaya Tomat", description: "Ruang untuk panduan dari persiapan lahan sampai evaluasi panen.", icon: Sprout },
  { number: "02", category: "PRAKTIK KEBUN", title: "Pemupukan yang Terukur", description: "Catatan praktik, pengamatan tanaman, dan keputusan pemupukan.", icon: FlaskConical },
  { number: "03", category: "PENGAMATAN", title: "Hama dan Penyakit Tanaman", description: "Mengenali gejala dan mencatat hasil pengamatan di lapangan.", icon: Leaf },
];

const nav = [
  ["Tentang", "#tentang"],
  ["Edukasi", "#edukasi"],
  ["Dokumentasi", "#dokumentasi"],
  ["Kerja sama", "#kerja-sama"],
];

export default async function Home() {
    const [panduanTerbit, fotoHero, konten, dokumentasi, kerjaSama] = await Promise.all([
    ambilPanduan(),
    ambilFotoHero(),
    ambilKonten(),
        ambilDokumentasi(),
    ambilKerjaSamaAktif(),
  ]);

  const paragrafTentang = (konten?.tentangParagraf ?? []).filter((t) => t && t.trim());
  const teksTentang = paragrafTentang.length > 0 ? paragrafTentang : tentangBawaan;
  const teksKerjaSama = konten?.kerjaSamaTeks?.trim() || kerjaSamaBawaan;

  const nomorWa = (konten?.whatsapp ?? "").replace(/\D/g, "");
  const emailKontak = konten?.email?.trim() || "";
  const linkWa = nomorWa ? `https://wa.me/${nomorWa}` : null;
  const linkEmail = emailKontak ? `mailto:${emailKontak}` : null;
  const kontakUtama = linkWa ?? linkEmail ?? "#kontak";
  const kontakEksternal = Boolean(linkWa);

  const tautanSosial = [
    { label: "WhatsApp", href: linkWa },
    { label: "Email", href: linkEmail },
    { label: "Instagram", href: urlAman(konten?.instagram) },
    { label: "TikTok", href: urlAman(konten?.tiktok) },
    { label: "Facebook", href: urlAman(konten?.facebook) },
  ].filter((t): t is { label: string; href: string } => Boolean(t.href));

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Bie Bie Farm, beranda">
          <span className="brand-mark"><Sprout size={23} strokeWidth={1.8} /></span>
          <span className="brand-name">bie bie <b>farm.</b><small>CATATAN PETANI MUDA</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {nav.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
        </nav>
        <a className="header-cta" href="#edukasi">Jelajahi edukasi <ArrowRight size={16} /></a>
        <a className="mobile-menu" href="#navigasi" aria-label="Lihat navigasi"><Menu size={23} /></a>
      </header>

      <div id="navigasi" className="mobile-nav">
        {nav.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
      </div>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> DARI KEBUN, UNTUK SESAMA PETANI</div>
          <h1>Belajar pertanian<br /><em>dari pengalaman nyata.</em></h1>
          <p className="hero-description">
            Catatan perjalanan petani muda yang terus belajar, mencoba, dan berbagi.
            Tentang budidaya, teknologi, inovasi, serta realita di lapangan.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#edukasi">Jelajahi panduan <ArrowRight size={17} /></a>
            <a className="button button-secondary" href="#tentang">Kenali Bie Bie Farm</a>
          </div>
          <div className="hero-note"><MapPin size={15} /> Lereng Gunung Sumbing, Jawa Tengah</div>
        </div>
        <div className={fotoHero ? "hero-visual hero-foto" : "hero-visual"} role="img" aria-label={fotoHero?.alt || "Ilustrasi suasana kebun di lereng pegunungan"}>
          {fotoHero ? (
            <>
              <style>{`.hero-visual.hero-foto:before,.hero-visual.hero-foto:after{display:none}`}</style>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${fotoHero.url}?w=1400&auto=format`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </>
          ) : null}
          <div className="hero-image-overlay" />
          <div className="image-caption"><span className="caption-line" /><span>CATATAN DARI LAPANGAN<br /><b>Belajar, tumbuh, berbagi.</b></span></div>
          <div className="floating-note"><Sprout size={19} /><span><b>Berbasis pengalaman</b><small>Bukan sekadar teori</small></span></div>
        </div>
        <div className="hero-index"><span>01</span><span className="index-rule" /><span>PERTANIAN • PENGETAHUAN • INOVASI</span></div>
      </section>

      <section className="intro section-wrap" id="tentang">
        <div className="section-kicker">01 / TENTANG KAMI</div>
        <div className="intro-content">
          <h2>Petani muda.<br /><span>Pikiran terbuka.</span><br />Terus bertumbuh.</h2>
          <div className="intro-text">
            {teksTentang.map((teks, i) => <p key={i}>{teks}</p>)}
            <a className="text-link" href="#dokumentasi">Lihat cerita dari kebun <ArrowRight size={16} /></a>
          </div>
        </div>
        <div className="values-row">
          <div><span className="value-icon"><Sprout size={20} /></span><b>Pengalaman nyata</b><p>Berangkat dari apa yang terjadi di lapangan.</p></div>
          <div><span className="value-icon"><FlaskConical size={20} /></span><b>Terus bereksperimen</b><p>Menguji, mengamati, dan belajar dengan terbuka.</p></div>
          <div><span className="value-icon"><Tractor size={20} /></span><b>Melek teknologi</b><p>Mencari cara baru agar praktik tani terus berkembang.</p></div>
        </div>
      </section>

      <section className="education section-wrap" id="edukasi">
        <div className="section-heading">
          <div><div className="section-kicker">02 / RUANG BELAJAR</div><h2>Pengetahuan yang<br /><em>bisa dipraktikkan.</em></h2></div>
          <p>Materi pertanian yang disusun agar mudah dipahami dan dikembangkan dari pengalaman nyata di kebun.</p>
        </div>
        <div className="guide-grid">
          {panduanTerbit.length > 0
            ? panduanTerbit.map((p, i) => (
                <Link
                  className="guide-card"
                  href={`/panduan/${p.slug}`}
                  key={p._id}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="guide-top"><span>{String(i + 1).padStart(2, "0")}</span><Sprout size={22} strokeWidth={1.6} /></div>
                  <div className="guide-body">
                    <span className="card-category">{p.tahap && namaTahap[p.tahap] ? namaTahap[p.tahap].toUpperCase() : "PANDUAN"}</span>
                    <h3>{p.judul}</h3>
                    {p.ringkasan ? <p>{p.ringkasan}</p> : null}
                    <span className="coming-soon">BACA PANDUAN →</span>
                  </div>
                </Link>
              ))
            : guides.map(({number, category, title, description, icon: Icon}) => (
                <article className="guide-card" key={number}>
                  <div className="guide-top"><span>{number}</span><Icon size={22} strokeWidth={1.6} /></div>
                  <div className="guide-body"><span className="card-category">{category}</span><h3>{title}</h3><p>{description}</p><span className="coming-soon">MATERI AKAN DITAMBAHKAN</span></div>
                </article>
              ))}
        </div>
        {panduanTerbit.length > 0 ? (
          <Link className="text-link" href="/panduan">Lihat semua panduan <ArrowRight size={16} /></Link>
        ) : (
          <div className="guide-disclaimer">Catatan: kartu di atas merupakan kategori awal. Materi lengkap akan ditambahkan setelah naskah dan data tersedia.</div>
        )}
      </section>

      <section className="download-band">
        <div className="download-icon"><BookOpen size={26} /></div>
        <div className="download-copy"><span className="section-kicker">PANDUAN GRATIS</span><h2>Belajar kapan saja,<br /><em>langsung dari kebun.</em></h2><p>PDF panduan budidaya akan tersedia di sini untuk diunduh tanpa biaya.</p></div>
        <div className="download-action"><span className="file-label">PDF • GRATIS</span><a className="button button-light" href="#kontak" aria-label="Tanyakan ketersediaan panduan PDF">Panduan segera hadir <ArrowRight size={16} /></a><small>File belum dipasang. Tautan unduhan aktif setelah PDF tersedia.</small></div>
      </section>

      <section className="field-notes section-wrap" id="dokumentasi">
        <div className="section-heading">
          <div><div className="section-kicker">03 / CATATAN LAPANGAN</div><h2>Di balik setiap<br /><em>proses bertani.</em></h2></div>
          <p>Dokumentasi kebun, proses belajar, dan realita pertanian. Cerita akan diisi berdasarkan kegiatan dan foto asli.</p>
        </div>
        <div className="field-grid">
          {dokumentasi.length > 0 ? (
            dokumentasi.map((d, i) => (
              <article className="field-feature" key={d._id}>
                <div className="field-art" style={{ position: "relative", overflow: "hidden", minHeight: 280 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${d.fotoUrl}?w=900&auto=format`} alt={d.fotoAlt || d.judul} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="field-meta">
                  <span>{labelKategori[d.kategori ?? ""] ?? "DOKUMENTASI"}</span>
                  <span>{tanggalIndo(d.tanggal) ?? String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3>{d.judul}</h3>
                {d.keterangan ? <p>{d.keterangan}</p> : null}
              </article>
            ))
          ) : (
            <>
              <article className="field-feature">
                <div className="field-art field-art-one"><div className="sun" /><div className="mountain mountain-back" /><div className="mountain mountain-front" /><div className="field-lines" /><span className="art-label">KISAH DARI KEBUN</span></div>
                <div className="field-meta"><span>JURNAL PETANI</span><span>01</span></div>
                <h3>Setiap musim punya ceritanya sendiri.</h3>
                <p>Ruang untuk berbagi proses, tantangan, dan pelajaran dari kegiatan bertani.</p>
              </article>
              <article className="field-feature">
                <div className="field-art field-art-two"><div className="plant-stem" /><div className="plant-leaf leaf-a" /><div className="plant-leaf leaf-b" /><div className="plant-leaf leaf-c" /><span className="art-label">PENGAMATAN TANAMAN</span></div>
                <div className="field-meta"><span>CATATAN PRAKTIK</span><span>02</span></div>
                <h3>Mengamati sebelum mengambil keputusan.</h3>
                <p>Catatan pengamatan membantu kita belajar dari kondisi nyata, bukan asumsi.</p>
              </article>
            </>
          )}
        </div>
        {dokumentasi.length === 0 ? (
          <p className="placeholder-note">Ilustrasi sementara — ganti dengan dokumentasi asli Bie Bie Farm sebelum dipublikasikan sebagai cerita nyata.</p>
        ) : null}
      </section>

            {kerjaSama.length > 0 ? (
        <section className="section-wrap" id="kerja-sama-aktif">
          <div className="section-heading">
            <div>
              <div className="section-kicker">KERJA SAMA AKTIF</div>
              <h2>Kolaborasi yang<br /><em>sedang berjalan.</em></h2>
            </div>
            <p>Kerja sama dengan pelaku usaha pertanian yang sedang dijalankan Bie Bie Farm, ditampilkan dengan persetujuan perusahaan yang bersangkutan.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {kerjaSama.map((k) => {
              const tautanK = urlAman(k.tautan);
              const mulai = tanggalIndo(k.tanggalMulai);
              return (
                <article key={k._id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {k.logoUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`${k.logoUrl}?w=240&auto=format`} alt={k.logoAlt || `Logo ${k.namaPerusahaan}`} loading="lazy" style={{ width: 56, height: 56, objectFit: "contain", flexShrink: 0 }} />
                      </>
                    ) : null}
                    <div>
                      <h3 style={{ margin: 0 }}>{k.namaPerusahaan}</h3>
                      <span style={{ display: "inline-block", marginTop: 6, fontSize: 10, letterSpacing: 1.3, fontWeight: 700, color: "#1f7a4d" }}>● STATUS AKTIF</span>
                    </div>
                  </div>
                  {k.bentukKolaborasi ? (
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: 1.3, fontWeight: 700, color: "#788994" }}>BENTUK KOLABORASI</div>
                      <p style={{ margin: "4px 0 0", fontWeight: 600 }}>{k.bentukKolaborasi}</p>
                    </div>
                  ) : null}
                  {k.keterangan ? <p style={{ margin: 0 }}>{k.keterangan}</p> : null}
                  {k.fotos && k.fotos.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                      {k.fotos.map((f, i) => (
                        <div key={i} style={{ aspectRatio: "4 / 3", overflow: "hidden", borderRadius: 8 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`${f.url}?w=500&auto=format`} alt={f.alt || `Dokumentasi bersama ${k.namaPerusahaan}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {mulai ? <small style={{ color: "#788994" }}>Sejak {mulai}</small> : null}
                  {tautanK ? (
                    <a className="text-link" href={tautanK} target="_blank" rel="noopener noreferrer">Kunjungi situs perusahaan <ArrowRight size={16} /></a>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="collab" id="kerja-sama">
        <div className="collab-symbol"><Users size={26} /></div>
        <div className="collab-copy"><div className="section-kicker">04 / KOLABORASI</div><h2>Membangun pertanian,<br /><em>bersama lebih banyak pihak.</em></h2><p>{teksKerjaSama}</p></div>
        <div className="collab-contact">
          <span>UNTUK KERJA SAMA</span>
          <a
            href={kontakUtama}
            className="button button-light"
            {...(kontakEksternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            Hubungi Bie Bie Farm <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <footer id="kontak" className="footer">
        <div className="footer-main">
          <a className="brand brand-footer" href="#"><span className="brand-mark"><Sprout size={23} /></span><span className="brand-name">bie bie <b>farm.</b><small>CATATAN PETANI MUDA</small></span></a>
          <p>Belajar dari pengalaman.<br />Tumbuh bersama pertanian.</p>
        </div>
        <div className="footer-links"><span>JELAJAHI</span><a href="#tentang">Tentang</a><a href="#edukasi">Edukasi</a><a href="#dokumentasi">Catatan lapangan</a></div>
        <div className="footer-links">
          <span>TERHUBUNG</span>
          {tautanSosial.length > 0 ? (
            tautanSosial.map((t) => (
              <a
                key={t.label}
                href={t.href}
                {...(t.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              >
                {t.label}
              </a>
            ))
          ) : (
            <p className="footer-muted">Tautan media sosial dan kontak akan ditambahkan setelah alamat resminya tersedia.</p>
          )}
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Bie Bie Farm</span><span>Dibangun dari pengalaman, dikembangkan dengan inovasi.</span></div>
      </footer>
    </main>
  );
}
