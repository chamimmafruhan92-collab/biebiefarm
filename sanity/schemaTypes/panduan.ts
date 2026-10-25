import { defineArrayMember, defineField, defineType } from "sanity";

export const panduan = defineType({
  name: "panduan",
  title: "Panduan",
  type: "document",
  fields: [
    defineField({
      name: "judul",
      title: "Judul",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Tautan (slug)",
      description: "Klik Generate untuk membuat tautan otomatis dari judul.",
      type: "slug",
      options: { source: "judul", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tahap",
      title: "Tahap budidaya",
      type: "string",
      options: {
        list: [
          { title: "1. Persiapan lahan", value: "persiapan-lahan" },
          { title: "2. Persemaian", value: "persemaian" },
          { title: "3. Penanaman", value: "penanaman" },
          { title: "4. Perawatan", value: "perawatan" },
          { title: "5. Pemupukan", value: "pemupukan" },
          { title: "6. Hama dan penyakit", value: "hama-penyakit" },
          { title: "7. Panen", value: "panen" },
          { title: "8. Evaluasi", value: "evaluasi" },
        ],
      },
    }),
    defineField({
      name: "jenisIsi",
      title: "Jenis isi",
      description: "Bantu pembaca membedakan pengalaman pribadi dan acuan umum.",
      type: "string",
      options: {
        list: [
          { title: "Pengalaman lapangan pribadi", value: "pengalaman" },
          { title: "Acuan umum / referensi", value: "umum" },
        ],
        layout: "radio",
      },
      initialValue: "pengalaman",
    }),
    defineField({
      name: "ringkasan",
      title: "Ringkasan singkat",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "fotoSampul",
      title: "Foto sampul",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Keterangan foto", type: "string" }),
      ],
    }),
    defineField({
      name: "kondisiKebun",
      title: "Kondisi kebun saat itu",
      description: "Contoh: ketinggian, musim, jenis tanah, varietas.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "diperbarui",
      title: "Tanggal diperbarui",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "isi",
      title: "Isi panduan",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Keterangan foto", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "judul", subtitle: "tahap", media: "fotoSampul" },
  },
});
