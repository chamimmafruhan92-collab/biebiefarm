import { defineArrayMember, defineField, defineType } from "sanity";

export const kerjaSamaAktif = defineType({
  name: "kerjaSamaAktif",
  title: "Kerja Sama Aktif",
  type: "document",
  fields: [
    defineField({
      name: "namaPerusahaan",
      title: "Nama perusahaan",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status kerja sama",
      description: "Hanya yang berstatus Aktif yang bisa tampil di website.",
      type: "string",
      options: {
        list: [
          { title: "Aktif", value: "aktif" },
          { title: "Selesai", value: "selesai" },
          { title: "Dalam pembahasan", value: "pembahasan" },
        ],
        layout: "radio",
      },
      initialValue: "pembahasan",
    }),
    defineField({
      name: "izinTayang",
      title: "Boleh ditayangkan di website",
      description:
        "Nyalakan HANYA jika perusahaan sudah setuju nama, logo, dan foto ini ditampilkan. Kalau mati, kerja sama ini tidak tampil di website.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "bentukKolaborasi",
      title: "Bentuk kolaborasi",
      description:
        "Tulis apa adanya, misalnya: uji coba produk di lahan sendiri, dokumentasi penggunaan produk.",
      type: "string",
    }),
    defineField({
      name: "keterangan",
      title: "Keterangan singkat",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "logo",
      title: "Logo perusahaan",
      description: "Pakai logo hanya dengan izin perusahaan.",
      type: "image",
      fields: [
        defineField({ name: "alt", title: "Keterangan logo", type: "string" }),
      ],
    }),
    defineField({
      name: "dokumentasi",
      title: "Foto dokumentasi",
      description: "Foto kegiatan yang relevan. Maksimal 6 foto.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Keterangan foto", type: "string" }),
          ],
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "tautan",
      title: "Tautan resmi (opsional)",
      description: "Alamat situs atau halaman perusahaan, diawali https://",
      type: "url",
    }),
    defineField({
      name: "tanggalMulai",
      title: "Mulai kerja sama",
      type: "date",
    }),
  ],
  preview: {
    select: {
      title: "namaPerusahaan",
      status: "status",
      izin: "izinTayang",
      media: "logo",
    },
    prepare({ title, status, izin, media }) {
      const label =
        status === "aktif" ? "Aktif" : status === "selesai" ? "Selesai" : "Dalam pembahasan";
      return { title, subtitle: `${label} • ${izin ? "Tayang" : "Tidak tayang"}`, media };
    },
  },
});
