import type { LanguageFn } from 'lowlight'
import type { Mode } from 'highlight.js'

// Custom highlight.js language grammar for tabs, used to de-emphasize the
// "strings" (---), highlight sections ([Verse]), etc

// References:
// - rehype-highlight: https://github.com/rehypejs/rehype-highlight
// - highlight.js grammar guide: https://highlightjs.readthedocs.io/en/latest/language-guide.html
// - grammar example: https://github.com/highlightjs/highlight.js/blob/main/src/languages/markdown.js

const tab: LanguageFn = () => {
  // Lyrics
  // "Hello world ..."
  const LYRICS: Mode = {
    className: 'lyrics',
    variants: [
      {
        begin: /\"/,
        end: /\"/,
      },
    ],
  }

  // Section titles
  // [Chorus 1]
  const SECTION: Mode = {
    className: 'section',
    variants: [
      {
        begin: /\[/,
        end: /\]/,
      },
    ],
  }

  // Each string
  // e|---2---|---3---|
  const STRING: Mode = {
    className: 'string',
    variants: [
      {
        begin: /^.{1}\|/,
        end: /\|\s/,
        contains: [
          // Dash groups
          // e|---2---|---3---|
          //   └─┘ └─┘ └─┘ └─┘
          {
            className: 'dash',
            begin: /(?:-)+/,
          },
        ],
      },
    ],
  }

  return {
    name: 'Tab',
    contains: [LYRICS, SECTION, STRING],
  }
}

export { tab }
