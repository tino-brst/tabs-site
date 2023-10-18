import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const tabs = defineCollection({
  type: 'content',
  schema: ({image}) => z.object({
    title: z.string(),
    albumImage: image(),
  }),
})

export const collections = {
  tabs,
}
