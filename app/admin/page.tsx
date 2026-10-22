'use client';

import { useEffect, useState } from 'react';

/**
 * Bie Bie Farm — Halaman Admin (Tahap 1)
 *
 * PENTING:
 * - Halaman ini BELUM memiliki login. Siapa pun yang tahu alamat /admin bisa membukanya.
 * - Tidak ada database/backend. Satu-satunya fitur yang berfungsi adalah "Catatan kerja",
 *   yang disimpan di browser HP ini saja (localStorage), bukan di server.
 */

type Tab = 'ringkasan' | 'kelola' | 'catatan';

type Task = {
  id: string;
  text: string;
  done: boolean;
};

type Module = {
  title: string;
  description: string;
  icon: string; // path SVG (viewBox 24x24)
};

const STORAGE_KEY = 'bbf-admin-tasks-v1';

const MODULES: Module[] = [
  {
    title: 'Produk',
    description: 'Ubah nama, harga, stok, dan foto produk.',
    icon: 'M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4M3 17l9 4 9-4',
  },
  {
    title: 'Galeri foto',
    description: 'Tambah atau hapus foto kegiatan peternakan.',
    icon: 'M4 5h16v14H4V5zm0 11l4-4 4 4 3-3 5 5M9 9.5h.01',
  },
  {
    title: 'Artikel dan kabar',
    description: 'Tulis pengumuman dan cerita dari kandang.',
    icon: 'M6 3h9l4 4v14H6V3zm8 0v5h5M9 13h7M9 17h7',
  },
  {
    title: 'Pesan masuk',
    description: 'Baca pertanyaan dan pesanan dari pengunjung.',
    icon: 'M3 6h18v12H3V6zm0 0l9 7 9-7',
  },
  {
    title: 'Kontak dan lokasi',
    description: 'Perbarui nomor WhatsApp, alamat, dan jam buka.',
    icon: 'M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  },
  {
    title: 'Pengaturan situs',
    description: 'Judul, deskripsi, dan tampilan umum website.',
    icon: 'M4 7h10M18 7h2M4 17h2M10 17h10M16 4v6M8 14v6',
  },
];

function Icon({ d, className = 'h-5 w-5' }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const TAB_ICONS: Record<Tab, string> = {
  ringkasan: 'M4 13h6V4H4v9zm10 7h6V4h-6v16zM4 20h6v-3H4v3z',
  kelola: 'M4 6h16M4 12h16M4 18h10',
  catatan: 'M5 4h14v16H5V4zm3 5h8M8 13h8M8 17h4',
};

const TAB_LABELS: Record<Tab, string> = {
  ringkasan: 'Ringkasan',
  kelola: 'Kelola',
  catatan: 'Catatan',
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('ringkasan');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [storageOk, setStorageOk] = useState(true);

  // Muat catatan dari browser (hanya berjalan di sisi klien)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (t): t is Task =>
              typeof t === 'object' &&
              t !== null &&
              typeof (t as Task).id === 'string' &&
              typeof (t as Task).text === 'string' &&
              typeof (t as Task).done === 'boolean'
          );
          setTasks(valid);
        }
      }
    } catch {
      setStorageOk(false);
    }
    setLoaded(true);
  }, []);

  // Simpan setiap kali catatan berubah (setelah pemuatan awal selesai)
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      setStorageOk(false);
    }
  }, [tasks, loaded]);

  function addTask() {
    const text = draft.trim();
    if (!text) return;
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    setTasks((prev) => [{ id, text, done: false }, ...prev]);
    setDraft('');
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function clearDone() {
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  const openCount = tasks.filter((t) => !t.done).length;
  const doneCount = tasks.length - openCount;

  return (
    <div className="min-h-screen bg-green-50/60 text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-green-900/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-800 text-sm font-bold text-white">
              BF
            </div>
            <div className="leading-tight">
              <p className="text-base font-semibold text-green-900">Bie Bie Farm</p>
              <p className="text-xs text-slate-500">Panel pengelolaan</p>
            </div>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            Belum terkunci
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-4 pb-28 pt-5">
        {/* Peringatan keamanan: jujur soal status login */}
        <section
          role="note"
          className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <p className="font-semibold">Halaman ini belum dilindungi login</p>
          <p className="mt-1 leading-relaxed">
            Siapa pun yang mengetahui alamat <span className="font-mono">/admin</span> dapat
            membukanya. Jangan menaruh data pribadi atau rahasia di sini sampai sistem login
            dipasang pada tahap berikutnya.
          </p>
        </section>

        {/* Tab: Ringkasan */}
        {tab === 'ringkasan' && (
          <>
            <section className="rounded-2xl bg-green-800 p-5 text-white">
              <h1 className="text-xl font-semibold leading-snug">Selamat datang di panel Bie Bie Farm</h1>
              <p className="mt-2 text-sm leading-relaxed text-green-100">
                Ini kerangka awal untuk mengelola website dari HP. Saat ini tampilan dan catatan
                kerja sudah bisa dipakai. Pengelolaan produk, foto, dan artikel menunggu
                penyimpanan data (backend) dipasang.
              </p>
              <button
                type="button"
                onClick={() => setTab('catatan')}
                className="mt-4 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-green-900 active:bg-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-green-800"
              >
                Buka catatan kerja
              </button>
            </section>

            <section aria-label="Statistik" className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-green-900/10 bg-white p-4">
                <p className="text-xs text-slate-500">Tugas belum selesai</p>
                <p className="mt-1 text-3xl font-semibold text-green-900">{openCount}</p>
                <p className="mt-1 text-xs text-slate-500">Dari catatan kerja di HP ini</p>
              </div>
              <div className="rounded-2xl border border-green-900/10 bg-white p-4">
                <p className="text-xs text-slate-500">Tugas selesai</p>
                <p className="mt-1 text-3xl font-semibold text-green-900">{doneCount}</p>
                <p className="mt-1 text-xs text-slate-500">Dari catatan kerja di HP ini</p>
              </div>
              <div className="col-span-2 rounded-2xl border border-dashed border-green-900/25 bg-white/60 p-4">
                <p className="text-sm font-medium text-slate-700">
                  Jumlah produk, kunjungan, dan pesan masuk
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Belum tersedia. Angka-angka ini butuh database atau layanan analitik yang akan
                  disambungkan di tahap berikutnya.
                </p>
              </div>
            </section>
          </>
        )}

        {/* Tab: Kelola */}
        {tab === 'kelola' && (
          <section aria-labelledby="kelola-title">
            <h2 id="kelola-title" className="text-lg font-semibold text-green-900">
              Yang akan bisa dikelola
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Menu di bawah belum berfungsi karena belum ada backend. Tombolnya sengaja dinonaktifkan
              agar tidak menyesatkan.
            </p>

            <ul className="mt-4 space-y-3">
              {MODULES.map((m) => (
                <li
                  key={m.title}
                  className="flex items-start gap-3 rounded-2xl border border-green-900/10 bg-white p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
                    <Icon d={m.icon} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{m.title}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{m.description}</p>
                  </div>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="shrink-0 cursor-not-allowed rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400"
                  >
                    Segera hadir
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tab: Catatan */}
        {tab === 'catatan' && (
          <section aria-labelledby="catatan-title">
            <h2 id="catatan-title" className="text-lg font-semibold text-green-900">
              Catatan kerja
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Daftar tugas pribadi untuk website. Tersimpan hanya di browser HP ini, jadi tidak
              muncul di perangkat lain dan hilang jika data browser dihapus.
            </p>

            {!storageOk && (
              <p
                role="alert"
                className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800"
              >
                Browser ini menolak penyimpanan lokal (mungkin mode privat). Catatan hanya bertahan
                selama halaman terbuka.
              </p>
            )}

            <div className="mt-4 flex gap-2">
              <label htmlFor="task-input" className="sr-only">
                Tugas baru
              </label>
              <input
                id="task-input"
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTask();
                }}
                placeholder="Contoh: ganti foto beranda"
                maxLength={140}
                className="min-w-0 flex-1 rounded-xl border border-green-900/20 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-600/30"
              />
              <button
                type="button"
                onClick={addTask}
                disabled={!draft.trim()}
                className="rounded-xl bg-green-800 px-4 py-3 text-sm font-semibold text-white active:bg-green-900 disabled:cursor-not-allowed disabled:bg-green-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
              >
                Tambah tugas
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-green-900/25 bg-white/60 p-6 text-center">
                <p className="font-medium text-slate-700">Belum ada tugas</p>
                <p className="mt-1 text-sm text-slate-500">
                  Tulis hal yang ingin diperbaiki atau ditambahkan di website, lalu tekan Tambah
                  tugas.
                </p>
              </div>
            ) : (
              <>
                <ul className="mt-4 space-y-2">
                  {tasks.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center gap-3 rounded-xl border border-green-900/10 bg-white px-3 py-2"
                    >
                      <input
                        id={`task-${t.id}`}
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTask(t.id)}
                        className="h-5 w-5 shrink-0 rounded border-green-900/30 accent-green-700"
                      />
                      <label
                        htmlFor={`task-${t.id}`}
                        className={`min-w-0 flex-1 break-words py-1 text-sm ${
                          t.done ? 'text-slate-400 line-through' : 'text-slate-800'
                        }`}
                      >
                        {t.text}
                      </label>
                      <button
                        type="button"
                        onClick={() => removeTask(t.id)}
                        aria-label={`Hapus tugas: ${t.text}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 active:bg-red-50 active:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <Icon d="M6 6l12 12M18 6L6 18" className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>

                {doneCount > 0 && (
                  <button
                    type="button"
                    onClick={clearDone}
                    className="mt-3 text-sm font-medium text-green-800 underline underline-offset-2"
                  >
                    Hapus {doneCount} tugas selesai
                  </button>
                )}
              </>
            )}
          </section>
        )}
      </main>

      {/* Navigasi bawah, nyaman untuk jempol di HP */}
      <nav
        aria-label="Menu utama admin"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-green-900/10 bg-white/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <ul className="mx-auto grid max-w-3xl grid-cols-3">
          {(Object.keys(TAB_LABELS) as Tab[]).map((key) => {
            const active = tab === key;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setTab(key)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex w-full flex-col items-center gap-1 py-2.5 text-xs font-medium focus:outline-none focus-visible:bg-green-50 ${
                    active ? 'text-green-800' : 'text-slate-500'
                  }`}
                >
                  <span
                    className={`flex h-8 w-14 items-center justify-center rounded-full ${
                      active ? 'bg-green-100' : ''
                    }`}
                  >
                    <Icon d={TAB_ICONS[key]} />
                  </span>
                  {TAB_LABELS[key]}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
