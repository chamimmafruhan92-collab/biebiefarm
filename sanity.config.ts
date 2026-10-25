import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { panduan } from "./sanity/schemaTypes/panduan";

export default defineConfig({
  name: "default",
  title: "Bie Bie Farm",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xkdoje8z",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: { types: [panduan] },
});
