// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import rehypePrettyCode from 'rehype-pretty-code';

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    dark: 'vesper',
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://danlog.dev',
  integrations: [react(), mdx()],

  markdown: {
    syntaxHighlight: false,
    processor: unified({
      rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
