// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import rehypePrettyCode from "rehype-pretty-code";

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "ayu-dark",
  },
};

// https://astro.build/config
export default defineConfig({
  site: "https://danlog.dev",
  integrations: [react(), mdx()],

  markdown: {
    // Disable Astro's built-in Shiki; rehype-pretty-code handles highlighting,
    // titles (title="…"), and line highlighting ({1,5-7}).
    syntaxHighlight: false,
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
