import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const tabs = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.md',
    base: './src/content/tabs',
    // The default ids come from the base path + folder + filename
    // (.../tabs/[artist]/[song].md → id: [artist]/[song]). If we wanna keep the
    // routes flat, which come from pages/[id].astro, we need to extract the
    // filename so we get id: [song] and thus the routes: /[song].
    generateId: ({ entry }) => entry.split('/').pop()!.replace(/\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tuning: z.string(),
      /** Only required if using a capo */
      capo: z.number().positive().optional(),
      album: z.string(),
      artist: z.string(),
      albumImageURL: image().optional(),
      artistImageURL: image().optional(),
      spotifyURL: z.url().optional(),
      appleMusicURL: z.url().optional(),
      /** YouTube video IDs, with support for timestamps using the format `{id}?start={timestamp}` (e.g. `abc123?start=30`, which starts on second 30) */
      videos: z.string().array().optional(),
      isDraft: z.boolean().optional(),
      isNew: z.boolean().optional(),
      ultimateGuitarURL: z.url().optional(),
    }),
})

export const collections = {
  tabs,
}
