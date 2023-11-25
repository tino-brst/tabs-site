import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const tabs = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tuning: z.string(),
      capo: z.number().positive().optional(),
      album: z.string(),
      artist: z.string(),
      albumImageURL: image().optional(),
      artistImageURL: image().optional(),
      spotifyURL: z.string().url().optional(),
      appleMusicURL: z.string().url().optional(),
      /** YouTube video IDs, with support for timestamps using the format `{id}?start={timestamp}` (e.g. `abc123?start=30`, which starts on second 30) */
      videos: z.string().array().optional(),
      isDraft: z.boolean().optional(),
      isNew: z.boolean().optional(),
      ultimateGuitarURL: z.string().url().optional(),
    }),
})

export const collections = {
  tabs,
}
