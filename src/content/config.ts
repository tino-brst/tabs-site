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
      videoIDs: z.string().array().optional(),
      isDraft: z.boolean().optional(),
    }),
})

export const collections = {
  tabs,
}
