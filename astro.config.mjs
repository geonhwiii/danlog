// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://danlog.dev",
  integrations: [react(), mdx()],

  markdown: {
    shikiConfig: {
      // Dual theme: light + dark. The dark variant is activated via CSS
      // (see [data-theme="dark"] .astro-code rules in global.css).
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
