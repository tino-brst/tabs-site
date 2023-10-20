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
      albumImageURL: image(),
      artistImageURL: image(),
    }),
})

export const collections = {
  tabs,
}
