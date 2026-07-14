---
name: converting-md-to-ug
description: Convert site tabs from src/content/tabs/ to Ultimate Guitar format in ug/. Use when the user wants to create a UG version of an existing tab, or mentions "ug tab", "ultimate guitar", or converting a tab.
---

# Converting Markdown tabs to Ultimate Guitar format

Convert a tab from `src/content/tabs/<artist>/<song>.md` to `ug/<artist>/<song>.md`.

## Prerequisites

- The source tab must already exist in `src/content/tabs/`
- Read the source tab fully before starting
- Read the reference files in this skill's `references/` directory for formatting rules

## Git flow

### Branch

Create a branch named after the song slug (e.g. `derrumbe`) if needed (it may already exist, probably already checked-out).

### Commits

Each step below is one commit. Follow this order strictly.

#### 1. `add <song> ug tab`

- Create the artist folder under `ug/` if it doesn't exist
- Copy the source tab file as-is into `ug/<artist>/<song>.md`
- No modifications at all — raw duplicate

#### 2. `add metadata block`

Replace the YAML frontmatter (`---` fenced block) with a UG metadata code block:

```
\`\`\`
Artist: <artist>
Song: <title>
Tuning: <tuning>
Capo: <capo or "None">
\`\`\`
```

Take values from the source frontmatter. If there's no `capo` field, use `None`.

#### 3. `add video references & notes`

Add these sections between the metadata block and the first tab section:

**Video references** — convert the `videos` array from the source frontmatter into labeled links. Use placeholder labels for the user to fill in:

```
Video References

- TODO Live at Some Place https://www.youtube.com/watch?v=<videoId>
```

For video IDs that contain `?start=<seconds>`, convert to `&t=<seconds>s` format (since it goes after `watch?v=`):

- Source: `xrPEB3ASbDI?start=1350`
- Result: `https://www.youtube.com/watch?v=xrPEB3ASbDI&t=1350s`

**Author notes** — if the source tab has any author notes (free-form playing tips inside the code block, not section headers or tab lines), preserve them as-is.

**Disclaimer** — always add, after author notes (if any) or video references:

- With author notes: `PS As usual, if you find any mistakes or missing bits, do let me know! Leave a comment down below and I'll look into it.`
- Without author notes: `If you find any mistakes or missing bits, do let me know! Leave a comment down below and I'll look into it.`

#### 4. `update lyrics format`

Clean up the Lyrics section at the bottom:

- `## Lyrics` heading → just `Lyrics` (plain text)
- `` `[Section]` `` (backtick-wrapped) → `[Section]` (plain)
- Remove trailing double spaces from lyric lines
- Remove any markdown-specific formatting

#### 5. `update tab format`

- Remove the opening and closing ` ``` ` backticks that wrap the tab content in the source
- The tab content itself (section headers, lyrics quotes, tab lines, repeat notation, arrows) should stay as-is

#### 6. `update symbols format` (optional — skip if no symbols are used)

Only do this commit if the source tab had a symbols/legend table.

Remove the markdown table format (`| Symbol | Meaning |` and its rows) and replace with UG legend format using `****` borders:

```
**********************************************************************

| /   Slide up
| h   Hammer-on
| ()  Notes that may not be played but complete the shape of the chord

**********************************************************************
```

Place it after the last tab section and before the Lyrics section. Only include symbols that were in the source tab's legend.

#### 7. `add white space`

Apply the whitespace rules from [the personal conventions reference](references/ug-personal-conventions.md).

## Reference files

- [ug-tab-guide.md](references/ug-tab-guide.md) — official UG formatting rules
- [ug-personal-conventions.md](references/ug-personal-conventions.md) — personal conventions on top of the official guide (document structure, section ordering, repeat notation, arrow annotations, etc.)
