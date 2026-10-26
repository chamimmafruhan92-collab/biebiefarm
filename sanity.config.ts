import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { panduan } from "./sanity/schemaTypes/panduan";
import { pengaturanBeranda } from "./sanity/schemaTypes/pengaturanBeranda";

export default defineConfig({
  name: "default",
  title: "Bie Bie Farm",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xkdoje8z",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Isi website")
          .items([
            S.documentTypeListItem("panduan").title("Panduan"),
            S.listItem()
              .title("Pengaturan Beranda")
              .id("pengaturanBeranda")
              .child(
                S.document()
                  .schemaType("pengaturanBeranda")
                  .documentId("pengaturanBeranda")
              ),
          ]),
    }),
  ],
  schema: { types: [panduan, pengaturanBeranda] },
});
