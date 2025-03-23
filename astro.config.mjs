import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import vercel from '@astrojs/vercel'
import rehypeHighlight from 'rehype-highlight'
import { tab } from './src/lib/tab'

import tailwindcss from '@tailwindcss/vite'

// Config file docs
// https://docs.astro.build/en/guides/configuring-astro/#the-astro-config-file

export default defineConfig({
  integrations: [react(), mdx()],
  markdown: {
    // Disables default shiki-based syntax highlighting
    syntaxHighlight: false,
    // Customizing plugins
    // https://docs.astro.build/en/guides/markdown-content/#customizing-a-plugin
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
