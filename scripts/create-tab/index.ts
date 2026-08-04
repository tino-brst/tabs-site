import {
  cancel,
  intro,
  isCancel,
  log,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts'
import * as v from 'valibot'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createItunesClient } from './utils/itunes'
import slugify from '@sindresorhus/slugify'
import { existsSync } from 'node:fs'
import {
  fetchBytes,
  formatLyrics,
  getArtistImageUrl,
  getGeniusLyrics,
  resizeMzStaticImageUrl,
} from './utils/misc'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { loadEnv } from './utils/env'
import { createSpotifyClient } from './utils/spotify'
import { createGeniusClient } from './utils/genius'
import { styleText } from 'node:util'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '../..')

const SearchTermSchema = v.pipe(
  v.optional(v.string(), ''),
  v.trim(),
  v.nonEmpty('Enter a song name'),
)

const TuningSchema = v.pipe(
  v.optional(v.string(), ''),
  v.trim(),
  v.check(
    (input) =>
      input === '' || input === 'Standard' || /^([A-G][#b]?){6}$/.test(input),
    'Use "Standard" or a note per string notation (e.g. DADGAD, case-sensitive)',
  ),
)

const CapoSchema = v.pipe(
  v.optional(v.string(), ''),
  v.trim(),
  v.check(
    (input) => input === '' || input === 'none' || /^\d+$/.test(input),
    'Use "none" or a number',
  ),
)

try {
  await main()
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  cancel(message)
  process.exit(1)
}

async function main() {
  intro(
    `${styleText('bold', `tino's tabs`)} ${styleText('dim', `/ create-tab`)}`,
  )

  const env = loadEnv()

  const itunes = createItunesClient()

  const searchTerm = await ask(
    text({
      message: 'What song are we writing a tab for?',
      placeholder: 'who says john mayer',
      validate: SearchTermSchema,
    }),
  )

  const spin = spinner()

  spin.start('Searching iTunes')

  const songs = await itunes.search({
    term: searchTerm,
    entity: 'song',
  })

  spin.stop('iTunes search completed')

  const song = await ask(
    select({
      message: 'Select iTunes match',
      maxItems: 10,
      options: songs.results.map((song) => ({
        value: song,
        label: `${song.trackName} - ${song.artistName} (${song.collectionName})`,
      })),
    }),
  )

  const tuning = await ask(
    text({
      message: 'Tuning',
      placeholder: 'Standard',
      defaultValue: 'Standard',
      validate: TuningSchema,
    }),
  )

  const capo = await ask(
    text({
      message: 'Capo',
      placeholder: 'none',
      defaultValue: 'none',
      validate: CapoSchema,
    }),
  )

  const songSlug = slugify(song.trackName)
  const albumSlug = slugify(song.collectionName)
  const artistSlug = slugify(song.artistName)

  const tabsFolder = join(repoRoot, 'src/content/tabs')
  const tabPath = join(tabsFolder, `${artistSlug}/${songSlug}.md`)

  if (existsSync(tabPath)) {
    cancel('This tab already exists')
    process.exit(0)
  }

  const artistImagesFolder = join(repoRoot, 'src/assets/images/artists')
  const artistImagePath = join(artistImagesFolder, `${artistSlug}.jpg`)
  const isArtistImageAvailable = existsSync(artistImagePath)

  let downloadedArtistImage: Uint8Array<ArrayBuffer> | null = null

  if (isArtistImageAvailable) {
    log.step('Using existing artist image')
  } else {
    spin.start('Downloading artist image')

    const artistImageUrl = await getArtistImageUrl({
      artistId: song.artistId,
      imageSize: 600,
      country: itunes.country,
    })

    downloadedArtistImage = await fetchBytes(artistImageUrl)

    spin.stop('Artist image downloaded')
  }

  log.message(styleText('dim', relative(repoRoot, artistImagePath)), {
    spacing: 0,
  })

  const albumImagesFolder = join(repoRoot, 'src/assets/images/albums')
  const albumImagePath = join(albumImagesFolder, `${albumSlug}.jpg`)
  const isAlbumImageAvailable = existsSync(albumImagePath)

  let downloadedAlbumImage: Uint8Array<ArrayBuffer> | null = null

  if (isAlbumImageAvailable) {
    log.step('Using existing album image')
  } else {
    spin.start('Downloading album image')

    const albumImageUrl = resizeMzStaticImageUrl({
      url: song.artworkUrl100,
      size: 600,
    })

    downloadedAlbumImage = await fetchBytes(albumImageUrl)

    spin.stop('Album image downloaded')
  }

  log.message(styleText('dim', relative(repoRoot, albumImagePath)), {
    spacing: 0,
  })

  const appleMusicUrl = song.trackViewUrl
    .replace(/music\.apple\.com\/[a-z]{2}\//, 'music.apple.com/')
    .replace(/&uo=\d+$/, '')

  log.step('Apple Music link found')
  log.message(styleText('dim', appleMusicUrl), { spacing: 0 })

  const spotify = createSpotifyClient({
    clientId: env.SPOTIFY_CLIENT_ID,
    clientSecret: env.SPOTIFY_CLIENT_SECRET,
  })

  spin.start('Searching Spotify')

  const spotifyTracks = await spotify.search({
    query: `track:${song.trackName} album:${song.collectionName} artist:${song.artistName}`,
    type: 'track',
  })

  let spotifyUrl: string | null = null

  const spotifyTracksCount = spotifyTracks.length

  if (spotifyTracksCount === 0) {
    spin.stop('No Spotify link found, skipping…')
  }

  if (spotifyTracksCount === 1) {
    spin.stop('Spotify link found')

    spotifyUrl = spotifyTracks[0].external_urls.spotify
  }

  if (spotifyTracksCount > 1) {
    spin.stop('Spotify search completed')

    const spotifyTrack = await ask(
      select({
        message: 'Select matching Spotify track',
        options: spotifyTracks.map((track) => ({
          value: track,
          label: `${track.name} - ${track.artists.map((artist) => artist.name).join(', ')} (${track.album.name})`,
        })),
      }),
    )

    spotifyUrl = spotifyTrack.external_urls.spotify
  }

  if (spotifyUrl) {
    log.message(styleText('dim', spotifyUrl), { spacing: 0 })
  }

  const genius = createGeniusClient({ token: env.GENIUS_ACCESS_TOKEN })

  spin.start('Searching lyrics')

  const geniusSearchResults = await genius.search({
    query: `${song.trackName} ${song.artistName}`,
  })

  const geniusSongResults = geniusSearchResults.response.hits.filter(
    (hit) => hit.type === 'song',
  )

  const geniusSongResultsCount = geniusSongResults.length

  let geniusLyrics: string | null = null

  if (geniusSongResultsCount === 0) {
    spin.stop('No lyrics found, skipping…')
  }

  if (geniusSongResultsCount === 1) {
    spin.stop('Lyrics found')

    spin.start('Scraping lyrics')

    geniusLyrics = await getGeniusLyrics({
      url: geniusSongResults[0].result.url,
    })

    spin.stop('Lyrics scraped')
  }

  if (geniusSongResultsCount > 1) {
    spin.stop('Lyrics search completed')

    const geniusResult = await ask(
      select({
        message: 'Select matching lyrics',
        options: geniusSongResults.map((result) => ({
          value: result.result,
          label: `${result.result.title} - ${result.result.artist_names}`,
        })),
      }),
    )

    spin.start('Scraping lyrics')

    geniusLyrics = await getGeniusLyrics({ url: geniusResult.url })

    spin.stop('Lyrics scraped')
  }

  if (geniusLyrics) {
    log.message(
      styleText(
        'dim',
        `${geniusLyrics.split('\n').filter(Boolean).join(' ').slice(0, 80).trim()}…`,
      ),
      { spacing: 0 },
    )
  }

  const frontmatter: string = [
    `title: '${song.trackName}'`,
    `tuning: '${tuning}'`,
    ...(capo !== 'none' ? [`capo: ${capo}`] : []),
    `album: '${song.collectionName}'`,
    `artist: '${song.artistName}'`,
    `albumImageURL: '${relative(dirname(tabPath), albumImagePath)}'`,
    `artistImageURL: '${relative(dirname(tabPath), artistImagePath)}'`,
    `appleMusicURL: '${appleMusicUrl}'`,
    spotifyUrl
      ? `spotifyURL: '${spotifyUrl}'`
      : `# spotifyURL: 'https://open.spotify.com/track/...'`,
    `videos: ['dQw4w9WgXcQ']`,
    `# ultimateGuitarURL: 'https://tabs.ultimate-guitar.com/tab/john-doe/foo-123123'`,
    `# isNew: true`,
  ].join('\n')

  const template = await readFile(join(__dirname, 'template.md'), {
    encoding: 'utf-8',
  })

  const content = geniusLyrics
    ? template.replace(
        /^## Lyrics\s*$[\s\S]*/m,
        `## Lyrics\n\n${formatLyrics(geniusLyrics)}\n`,
      )
    : template

  const tab = `---\n${frontmatter}\n---\n\n${content}`

  await mkdir(dirname(tabPath), { recursive: true })
  await writeFile(tabPath, tab)

  if (downloadedArtistImage) {
    await writeFile(artistImagePath, downloadedArtistImage)
  }

  if (downloadedAlbumImage) {
    await writeFile(albumImagePath, downloadedAlbumImage)
  }

  log.step('Draft created')
  log.message(styleText('dim', relative(repoRoot, tabPath)), { spacing: 0 })

  outro('All set!')
}

async function ask<T>(prompt: Promise<T | symbol>): Promise<T> {
  const answer = await prompt

  if (isCancel(answer)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  return answer
}
