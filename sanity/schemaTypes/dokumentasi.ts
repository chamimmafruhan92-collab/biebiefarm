import { defineField, defineType } from "sanity";

export const dokumentasi = defineType({
  name: "dokumentasi",
  title: "Dokumentasi",
  type: "document",
  fields: [
    defineField({
      name: "judul",
      title: "Judul",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kategori",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Jurnal petani", value: "jurnal-petani" },
          { title: "Catatan praktik", value: "catatan-praktik" },
        ],
        layout: "radio",
      },
      initialValue: "jurnal-petani",
    }),
    defineField({
      name: "foto",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Keterangan foto", type: "string" }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tanggal",
      title: "Tanggal",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({
      name: "keterangan",
      title: "Keterangan singkat",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
  ],
  orderings: [
    {
      title: "Terbaru",
      name: "terbaru",
      by: [{ field: "tanggal", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "judul", subtitle: "tanggal", media: "foto" },
  },
});
