'use client';

import { useEffect, useState } from 'react';

/**
 * Bie Bie Farm — Halaman Admin (Tahap 1, tampilan versi 2)
 *
 * PENTING:
 * - Halaman ini BELUM memiliki login. Siapa pun yang tahu alamat /admin bisa membukanya.
 * - Belum ada database/backend. Satu-satunya fitur yang berfungsi adalah "Catatan Kerja",
 *   yang disimpan di browser HP ini saja (localStorage), bukan di server.
 * - Menu Kelola Artikel dan Galeri hanyalah rencana pengembangan, belum berfungsi.
 */

type Tab = 'ringkasan' | 'artikel' | 'galeri' | 'catatan' | 'pengaturan';

type Task = {
  id: string;
  text: string;
  done: boolean;
};

const STORAGE_KEY = 'bbf-admin-tasks-v1';

const TAB_LABELS: Record<Tab, string> = {
  ringkasan: 'Ringkasan',
  artikel: 'Artikel',
  galeri: 'Galeri',
  catatan: 'Catatan',
  pengaturan: 'Pengaturan',
};

const TAB_ICONS: Record<Tab, string> = {
  ringkasan: 'M4 13h6V4H4v9zm10 7h6V4h-6v16zM4 20h6v-3H4v3z',
  artikel: 'M6 3h9l4 4v14H6V3zm8 0v5h5M9 13h7M9 17h7',
  galeri: 'M4 5h16v14H4V5zm0 11l4-4 4 4 3-3 5 5M9 9.5h.01',
  catatan: 'M5 4h14v16H5V4zm3 5h8M8 13h8M8 17h4',
  pengaturan: 'M4 7h10M18 7h2M4 17h2M10 17h10M16 4v6M8 14v6',
};

type MenuCard = {
  tab: Tab;
  title: string;
  desc: string;
  status: 'aktif' | 'rencana';
};

const MENU_CARDS: MenuCard[] = [
  {
    tab: 'artikel',
    title: 'Kelola Artikel',
    desc: 'Tulis kabar dan cerita dari peternakan.',
    status: 'rencana',
  },
  {
    tab: 'galeri',
    title: 'Galeri Foto dan Video',
    desc: 'Atur foto dan video kegiatan.',
    status: 'rencana',
  },
  {
    tab: 'catatan',
    title: 'Catatan Kerja',
    desc: 'Daftar tugas untuk website.',
    status: 'aktif',
  },
  {
    tab: 'pengaturan',
    title: 'Pengaturan',
    desc: 'Status keamanan dan data di HP ini.',
    status: 'aktif',
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

function StatusBadge({ status }: { status: 'aktif' | 'rencana' }) {
  return status === 'aktif' ? (
    <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-medium text-green-800">
      Bisa dipakai
    </span>
  ) : (
    <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
      Akan dikembangkan
    </span>
  );
}

function greetingFor(hour: number): string {
  if (hour < 4) return 'Selamat malam';
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 19) return 'Selamat sore';
  return 'Selamat malam';
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('ringkasan');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [greeting, setGreeting] = useState('Halo');
  const [confirmReset, setConfirmReset] = useState(false);

  // Sapaan memakai jam di HP; dihitung di sisi klien agar tidak bentrok dengan server
  useEffect(() => {
    setGreeting(greetingFor(new Date().getHours()));
  }, []);

  // Muat catatan dari browser
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

  // Kembali ke atas halaman saat berpindah tab
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab]);

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

  function resetAll() {
    setTasks([]);
    setConfirmReset(false);
  }

  const openCount = tasks.filter((t) => !t.done).length;
  const doneCount = tasks.length - openCount;

  const card = 'rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5';

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100 text-slate-800">
      {/* Header ringkas */}
      <header className="sticky top-0 z-20 bg-green-800 text-white shadow-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-bold text-green-800">
              BF
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-base font-semibold">Bie Bie Farm</p>
              <p className="truncate text-xs text-green-100">Panel Admin</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
            Belum terkunci
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-4 pb-32 pt-5">
        {/* Peringatan keamanan, tampil di semua tab */}
        <section
          role="note"
          className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <p className="font-semibold">Halaman ini belum dilindungi login</p>
          <p className="mt-1 leading-relaxed">
            Siapa pun yang mengetahui alamat <span className="font-mono">/admin</span> dapat
            membukanya. Jangan menaruh data pribadi atau rahasia di sini sampai sistem login
            dipasang.
          </p>
        </section>

        {/* ===== Ringkasan ===== */}
        {tab === 'ringkasan' && (
          <>
            <section className="rounded-3xl bg-gradient-to-br from-green-700 to-green-900 p-5 text-white shadow-sm">
              <p className="text-sm text-green-100">{greeting}</p>
              <h1 className="mt-1 text-2xl font-semibold leading-snug">Kelola Bie Bie Farm dari HP</h1>
              <p className="mt-2 text-sm leading-relaxed text-green-100">
                Ini panel tahap awal. Catatan Kerja sudah bisa dipakai. Fitur lain menunggu
                penyimpanan data dipasang.
              </p>
            </section>

            <section aria-labelledby="stat-title">
              <h2 id="stat-title" className="mb-3 text-base font-semibold text-slate-900">
                Ringkasan data
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className={card}>
                  <p className="text-xs text-slate-500">Tugas belum selesai</p>
                  <p className="mt-1 text-3xl font-semibold text-green-800">{openCount}</p>
                  <p className="mt-1 text-xs text-slate-400">Catatan di HP ini</p>
                </div>
                <div className={card}>
                  <p className="text-xs text-slate-500">Tugas selesai</p>
                  <p className="mt-1 text-3xl font-semibold text-green-800">{doneCount}</p>
                  <p className="mt-1 text-xs text-slate-400">Catatan di HP ini</p>
                </div>
                <div className={`${card} bg-gray-50`}>
                  <p className="text-xs text-slate-500">Artikel</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-300">-</p>
                  <p className="mt-1 text-xs text-slate-400">Belum terhubung</p>
                </div>
                <div className={`${card} bg-gray-50`}>
                  <p className="text-xs text-slate-500">Foto dan video</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-300">-</p>
                  <p className="mt-1 text-xs text-slate-400">Belum terhubung</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Angka artikel, foto, video, dan kunjungan baru bisa tampil setelah ada database
                atau layanan penyimpanan. Tidak ada angka contoh di sini.
              </p>
            </section>

            <section aria-labelledby="menu-title">
              <h2 id="menu-title" className="mb-3 text-base font-semibold text-slate-900">
                Menu utama
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {MENU_CARDS.map((m) => (
                  <button
                    key={m.tab}
                    type="button"
                    onClick={() => setTab(m.tab)}
                    className="flex min-w-0 flex-col items-start rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-black/5 transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-800">
                      <Icon d={TAB_ICONS[m.tab]} className="h-6 w-6" />
                    </span>
                    <span className="mt-3 text-sm font-semibold leading-snug text-slate-900">
                      {m.title}
                    </span>
                    <span className="mt-1 text-xs leading-relaxed text-slate-500">{m.desc}</span>
                    <span className="mt-3">
                      <StatusBadge status={m.status} />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ===== Kelola Artikel ===== */}
        {tab === 'artikel' && (
          <section className={`${card} space-y-4`} aria-labelledby="artikel-title">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-800">
                <Icon d={TAB_ICONS.artikel} className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h2 id="artikel-title" className="text-lg font-semibold text-slate-900">
                  Kelola Artikel
                </h2>
                <StatusBadge status="rencana" />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Fitur ini belum dibuat. Menulis dan menerbitkan artikel dari HP membutuhkan tempat
              menyimpan data (database) dan sistem login, yang belum dipasang.
            </p>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm font-medium text-slate-800">Rencana ke depan</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Menulis artikel baru</li>
                <li>Mengubah dan menghapus artikel</li>
                <li>Menyimpan sebagai draf sebelum terbit</li>
              </ul>
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-full cursor-not-allowed rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-400"
            >
              Tulis artikel (belum tersedia)
            </button>
          </section>
        )}

        {/* ===== Galeri ===== */}
        {tab === 'galeri' && (
          <section className={`${card} space-y-4`} aria-labelledby="galeri-title">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-800">
                <Icon d={TAB_ICONS.galeri} className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h2 id="galeri-title" className="text-lg font-semibold text-slate-900">
                  Galeri Foto dan Video
                </h2>
                <StatusBadge status="rencana" />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Fitur ini belum dibuat. Mengunggah foto dan video membutuhkan layanan penyimpanan
              file dan sistem login, yang belum dipasang.
            </p>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm font-medium text-slate-800">Rencana ke depan</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Mengunggah foto dan video dari HP</li>
                <li>Memberi keterangan dan mengatur urutan</li>
                <li>Menghapus media yang tidak dipakai</li>
              </ul>
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-full cursor-not-allowed rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-400"
            >
              Unggah media (belum tersedia)
            </button>
          </section>
        )}

        {/* ===== Catatan Kerja ===== */}
        {tab === 'catatan' && (
          <section aria-labelledby="catatan-title" className="space-y-4">
            <div>
              <h2 id="catatan-title" className="text-lg font-semibold text-slate-900">
                Catatan Kerja
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                Daftar tugas pribadi untuk website. Tersimpan hanya di browser HP ini, jadi tidak
                muncul di perangkat lain dan hilang jika data browser dihapus.
              </p>
            </div>

            {!storageOk && (
              <p role="alert" className="rounded-2xl bg-red-50 p-3 text-sm text-red-800">
                Browser ini menolak penyimpanan lokal (mungkin mode privat). Catatan hanya bertahan
                selama halaman terbuka.
              </p>
            )}

            <div className={`${card} flex flex-col gap-3 sm:flex-row`}>
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
                className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-green-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/30"
              />
              <button
                type="button"
                onClick={addTask}
                disabled={!draft.trim()}
                className="rounded-2xl bg-green-700 px-5 py-3 text-sm font-semibold text-white active:bg-green-900 disabled:cursor-not-allowed disabled:bg-green-700/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
              >
                Tambah tugas
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-green-800/25 bg-white/60 p-6 text-center">
                <p className="font-medium text-slate-700">Belum ada tugas</p>
                <p className="mt-1 text-sm text-slate-500">
                  Tulis hal yang ingin diperbaiki atau ditambahkan di website, lalu tekan Tambah
                  tugas.
                </p>
              </div>
            ) : (
              <>
                <ul className="space-y-2">
                  {tasks.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-black/5"
                    >
                      <input
                        id={`task-${t.id}`}
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTask(t.id)}
                        className="h-5 w-5 shrink-0 rounded border-gray-300 accent-green-700"
                      />
                      <label
                        htmlFor={`task-${t.id}`}
                        className={`min-w-0 flex-1 break-words py-1.5 text-sm ${
                          t.done ? 'text-slate-400 line-through' : 'text-slate-800'
                        }`}
                      >
                        {t.text}
                      </label>
                      <button
                        type="button"
                        onClick={() => removeTask(t.id)}
                        aria-label={`Hapus tugas: ${t.text}`}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 active:bg-red-50 active:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
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
                    className="text-sm font-medium text-green-800 underline underline-offset-2"
                  >
                    Hapus {doneCount} tugas selesai
                  </button>
                )}
              </>
            )}
          </section>
        )}

        {/* ===== Pengaturan ===== */}
        {tab === 'pengaturan' && (
          <section aria-labelledby="set-title" className="space-y-4">
            <h2 id="set-title" className="text-lg font-semibold text-slate-900">
              Pengaturan
            </h2>

            <div className={`${card} space-y-3`}>
              <p className="text-sm font-semibold text-slate-900">Status sistem</p>
              <dl className="divide-y divide-gray-100 text-sm">
                <div className="flex items-start justify-between gap-3 py-2.5">
                  <dt className="text-slate-600">Login admin</dt>
                  <dd className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                    Belum ada
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 py-2.5">
                  <dt className="text-slate-600">Database dan penyimpanan file</dt>
                  <dd className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                    Belum ada
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 py-2.5">
                  <dt className="text-slate-600">Catatan Kerja</dt>
                  <dd className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Tersimpan di HP ini
                  </dd>
                </div>
              </dl>
            </div>

            <div className={`${card} space-y-3`}>
              <p className="text-sm font-semibold text-slate-900">Data di HP ini</p>
              <p className="text-sm leading-relaxed text-slate-600">
                Menghapus semua catatan kerja yang tersimpan di browser ini. Tindakan ini tidak
                bisa dibatalkan.
              </p>
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  disabled={tasks.length === 0}
                  className="w-full rounded-2xl border border-red-200 px-4 py-3 text-sm font-medium text-red-700 active:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-slate-400"
                >
                  Hapus semua catatan
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white active:bg-red-700"
                  >
                    Ya, hapus semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 rounded-2xl bg-gray-100 px-4 py-3 text-sm font-medium text-slate-700 active:bg-gray-200"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Navigasi bawah */}
      <nav
        aria-label="Menu utama admin"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <ul className="mx-auto grid max-w-3xl grid-cols-5">
          {(Object.keys(TAB_LABELS) as Tab[]).map((key) => {
            const active = tab === key;
            return (
              <li key={key} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setTab(key)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex w-full min-w-0 flex-col items-center gap-0.5 px-1 py-2 text-[11px] font-medium focus:outline-none focus-visible:bg-green-50 ${
                    active ? 'text-green-800' : 'text-slate-500'
                  }`}
                >
                  <span
                    className={`flex h-8 w-12 items-center justify-center rounded-full transition ${
                      active ? 'bg-green-100' : ''
                    }`}
                  >
                    <Icon d={TAB_ICONS[key]} />
                  </span>
                  <span className="w-full truncate text-center">{TAB_LABELS[key]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
