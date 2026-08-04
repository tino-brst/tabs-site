import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel'
import { unified } from '@astrojs/markdown-remark'
import rehypeHighlight from 'rehype-highlight'
import { tab } from './src/lib/tab'

import tailwindcss from '@tailwindcss/vite'

// Config file docs
// https://docs.astro.build/en/guides/configuring-astro/#the-astro-config-file

export default defineConfig({
  prefetch: {
    prefetchAll: true,
  },
  markdown: {
    // Disables default shiki-based syntax highlighting
    syntaxHighlight: false,
    // Keep the remark/rehype pipeline so rehype-highlight (and our custom
    // "tab" language) keep working. Astro 7 defaults to Sätteri instead.
    // https://docs.astro.build/en/guides/markdown-content/#switching-to-the-unified-processor
    processor: unified({
      rehypePlugins: [
        [
          rehypeHighlight,
          {
            // Languages supported
            languages: { tab },
            // Enables auto detecting the only language available ("tab") on
            // code-blocks, which avoids having to be explicit about it on every
            // code-block (e.g. ```tab)
            detect: true,
          },
        ],
      ],
    }),
  },
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
})
