import * as cheerio from 'cheerio'

async function getArtistImageUrl({
  artistId,
  imageSize = 600,
  country,
}: {
  artistId: number
  imageSize?: number
  country: string
}): Promise<string> {
  const url = `https://music.apple.com/${country}/artist/${artistId}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load artist page '${url}'`)
  }

  const html = await response.text()

  const $ = cheerio.load(html)
  const imageUrl = $('meta[property="og:image"]').attr('content')

  if (!imageUrl) {
    throw new Error(`No artist image found on '${url}'`)
  }

  return resizeMzStaticImageUrl({ url: imageUrl, size: imageSize })
}

/**
 * Rewrites an mzstatic image URL to a square crop at the given size.
 *
 * @example
 * // Before: .../100x100bb.jpg
 * // After:  .../600x600bb.jpg
 * resizeMzStaticImageUrl({
 *   url: 'https://is1-ssl.mzstatic.com/image/.../100x100bb.jpg',
 *   size: 600,
 * })
 */
function resizeMzStaticImageUrl({
  url,
  size,
}: {
  url: string
  size: number
}): string {
  return url.replace(
    /\/\d+x\d+\w*\.(?:jpg|png|webp)/i,
    `/${size}x${size}bb.jpg`,
  )
}

const getGeniusLyrics = async ({ url }: { url: string }) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to load lyrics page '${url}'`)
  }

  const html = await response.text()

  const $ = cheerio.load(html)

  // There might be multiple lyric blocks (Genius shows ads mid-lyric for long
  // songs), so we work on each, and then join them together
  const lyrics = $('[data-lyrics-container="true"]')
    .toArray()
    .map((element) => {
      const block = $(element)

      block.find('[data-exclude-from-selection="true"]').remove()
      block.find('br').replaceWith('\n')

      return block.text()
    })
    .join('\n')

  return lyrics
}

const formatLyrics = (lyrics: string): string => {
  // Two trailing spaces (markdown hard break) keep the lines of a section from
  // collapsing into a single paragraph. Lines are joined with it, so a
  // section's last line never gets one (redundant before a blank line)
  const hardBreak = '  \n'

  // [Verse 1] → `[Verse 1]`
  const formatLine = (line: string): string =>
    /^\[[^\]]+\]$/.test(line) ? `\`${line}\`` : line

  const formatSection = (section: string): string =>
    section
      .split('\n')
      .map((line) => formatLine(line.trim()))
      .join(hardBreak)

  return lyrics
    .split(/\n\s*\n/)
    .map((section) => section.trim())
    .filter((section) => section !== '')
    .map(formatSection)
    .join('\n\n')
}

async function fetchBytes(...args: Parameters<typeof fetch>) {
  const response = await fetch(...args)

  if (!response.ok) {
    throw new Error(`Failed to load '${args[0]}'`)
  }

  return await response.bytes()
}

export {
  getArtistImageUrl,
  resizeMzStaticImageUrl,
  getGeniusLyrics,
  formatLyrics,
  fetchBytes,
}
