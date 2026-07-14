import * as v from 'valibot'

const SearchResponseSchema = v.object({
  results: v.array(
    v.object({
      wrapperType: v.literal('track'),
      trackId: v.number(),
      trackName: v.string(),
      trackViewUrl: v.string(),
      artistId: v.number(),
      artistName: v.string(),
      collectionId: v.number(),
      collectionName: v.string(),
      artworkUrl100: v.string(),
    }),
  ),
})

function createItunesClient({ country = 'us' }: { country?: string } = {}) {
  const baseUrl = 'https://itunes.apple.com'

  return {
    country,
    async search({ term, entity }: { term: string; entity: 'song' }) {
      const params = new URLSearchParams({
        term,
        entity,
        country,
      })

      const url = `${baseUrl}/search?${params}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(
          `iTunes search failed for '${url}': ${response.status} - ${response.statusText}`,
        )
      }

      const result = v.safeParse(SearchResponseSchema, await response.json())

      if (!result.success) {
        throw new Error(
          `Unexpected iTunes response\n${v.summarize(result.issues)}`,
        )
      }

      return result.output
    },
  }
}

export { createItunesClient }
