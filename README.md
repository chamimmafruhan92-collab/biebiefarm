# Bie Bie Farm

Website awal Bie Bie Farm dengan Next.js, React, TypeScript, dan CSS.

## Jalankan secara lokal

Perlu Node.js versi LTS yang kompatibel.

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

## Build untuk produksi

```bash
npm run build
npm start
```

## Deploy ke Vercel

1. Unggah proyek ini ke repositori GitHub.
2. Buka Vercel dan pilih **Add New → Project**.
3. Impor repositori GitHub tersebut.
4. Gunakan pengaturan Next.js yang terdeteksi otomatis.
5. Klik **Deploy**.

## Menambahkan PDF panduan

Taruh file PDF di `public/downloads/`, misalnya:
`public/downloads/panduan-budidaya-tomat.pdf`

Setelah file siap, ubah tombol di `app/page.tsx` agar mengarah ke:
`/downloads/panduan-budidaya-tomat.pdf`

## Sebelum website dipublikasikan

- Ganti ilustrasi sementara dengan foto asli Bie Bie Farm.
- Tambahkan tautan media sosial dan kontak yang benar.
- Isi materi edukasi dan PDF yang sudah diverifikasi.
- Jangan mempublikasikan placeholder seolah-olah data nyata.
