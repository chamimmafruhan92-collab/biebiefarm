import { defineField, defineType } from "sanity";

export const pengaturanBeranda = defineType({
  name: "pengaturanBeranda",
  title: "Pengaturan Beranda",
  type: "document",
  fields: [
    defineField({
      name: "fotoHero",
      title: "Foto utama beranda",
      description:
        "Foto mendatar dari kebun. Jangan taruh objek penting di sudut kanan atas dan kiri bawah, karena tertutup kotak teks.",
      type: "image",
      fields: [
        defineField({ name: "alt", title: "Keterangan foto", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Pengaturan Beranda" }),
  },
});
