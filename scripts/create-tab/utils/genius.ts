import * as v from 'valibot'

const SearchResponseSchema = v.object({
  response: v.object({
    hits: v.array(
      v.object({
        type: v.string(),
        result: v.object({
          id: v.number(),
          title: v.string(),
          url: v.string(),
          artist_names: v.optional(v.string()),
          lyrics_state: v.optional(v.string()),
        }),
      }),
    ),
  }),
})

function createGeniusClient({ token }: { token: string }) {
  const baseUrl = 'https://api.genius.com'

  return {
    async search({ query }: { query: string }) {
      const params = new URLSearchParams({ q: query })

      const url = `${baseUrl}/search?${params}`
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(
          `Genius search failed for '${url}': ${response.status} - ${response.statusText}`,
        )
      }

      const result = v.safeParse(SearchResponseSchema, await response.json())

      if (!result.success) {
        throw new Error(
          `Unexpected Genius response\n${v.summarize(result.issues)}`,
        )
      }

      return result.output
    },
  }
}

export { createGeniusClient }
