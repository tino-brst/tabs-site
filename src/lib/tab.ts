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
  // e|---2---|---(3)---|
  const STRING: Mode = {
    className: 'string',
    variants: [
      {
        // e|---2---|--(3)--|
        // └────────────────┘
        begin: /^(?=[A-Ga-g]#?\|)/,
        end: /\|\s/,
        contains: [
          // Tuning (e.g. E, D, C#, etc)
          {
            className: 'tuning',
            // e|---2---|--(3)--|
            // ↑
            begin: /[A-Ga-g]#?/,
          },
          // Dash groups
          {
            className: 'dash',
            // e|---2---|--(3)--|
            //   └─┘ └─┘ └┘   └┘
            begin: /(?:-)+/,
          },
          // Notes completing the chord
          {
            className: 'chord-note-parens',
            // e|---2---|--(3)--|
            //             ↑ ↑
            begin: /\(/,
            end: /\)/,
            contains: [
              {
                className: 'chord-note-fret',
                // e|---2---|--(3)--|
                //              ↑
                begin: /\d{1,2}/,
              },
            ],
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
