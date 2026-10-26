import { defineArrayMember, defineField, defineType } from "sanity";

export const tentangKerjaSama = defineType({
  name: "tentangKerjaSama",
  title: "Tentang & Kerja Sama",
  type: "document",
  fields: [
    defineField({
      name: "tentangParagraf",
      title: "Teks bagian Tentang",
      description:
        "Satu kotak = satu paragraf. Kalau dikosongkan, website memakai teks bawaan.",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
    }),
    defineField({
      name: "kerjaSamaTeks",
      title: "Teks ajakan Kerja Sama",
      description: "Kalau dikosongkan, website memakai teks bawaan.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "whatsapp",
      title: "Nomor WhatsApp",
      description:
        "Angka saja dengan kode negara, tanpa spasi atau tanda +. Contoh: 6281234567890. Akan tampil ke publik, jadi pakai nomor khusus bisnis.",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      description: "Akan tampil ke publik.",
      type: "string",
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      description: "Tempel tautan profil lengkap, diawali https://",
      type: "url",
    }),
    defineField({
      name: "tiktok",
      title: "TikTok",
      description: "Tempel tautan profil lengkap, diawali https://",
      type: "url",
    }),
    defineField({
      name: "facebook",
      title: "Facebook",
      description: "Tempel tautan profil lengkap, diawali https://",
      type: "url",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Tentang & Kerja Sama" }),
  },
});
