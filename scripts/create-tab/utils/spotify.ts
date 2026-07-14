import * as v from 'valibot'

const TokenResponseSchema = v.object({
  access_token: v.string(),
})

const SearchResponseSchema = v.object({
  tracks: v.object({
    items: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        album: v.object({ name: v.string() }),
        artists: v.array(v.object({ name: v.string() })),
        external_urls: v.object({ spotify: v.string() }),
      }),
    ),
  }),
})

function createSpotifyClient({
  clientId,
  clientSecret,
}: {
  clientId: string
  clientSecret: string
}) {
  return {
    async getToken() {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`,
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ grant_type: 'client_credentials' }),
      })

      if (!response.ok) {
        throw new Error(
          `Spotify token request failed: ${response.status} - ${response.statusText}`,
        )
      }

      const result = v.safeParse(TokenResponseSchema, await response.json())

      if (!result.success) {
        throw new Error(
          `Unexpected Spotify response\n${v.summarize(result.issues)}`,
        )
      }

      return result.output.access_token
    },

    async search({ query, type }: { query: string; type: 'track' }) {
      const token = await this.getToken()

      const params = new URLSearchParams({
        q: query,
        type,
      })

      const url = `https://api.spotify.com/v1/search?${params}`

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error(
          `Spotify search failed for '${url}': ${response.status} - ${response.statusText}`,
        )
      }

      const result = v.safeParse(SearchResponseSchema, await response.json())

      if (!result.success) {
        throw new Error(
          `Unexpected Spotify response\n${v.summarize(result.issues)}`,
        )
      }

      return result.output.tracks.items
    },
  }
}

export { createSpotifyClient }
