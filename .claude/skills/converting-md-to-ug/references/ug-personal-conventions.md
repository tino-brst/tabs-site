# Personal Ultimate Guitar Tab Conventions

Personal conventions for UG tabs that go beyond the standard UG tab guide.

## Document structure

The document should always follow this order:

1. Metadata codeblock
2. Video References
3. Author notes (if any, from the source tab)
4. Disclaimer
5. Tab sections
6. Legend
7. Lyrics

## 1. Metadata codeblock

Always present at the top of the file, inside a fenced code block:

```
Artist: Jorge Drexler
Song: Sanar
Tuning: Standard
Capo: None
```

## 2. Video References

Always present. Each entry is a labeled link describing the performance context:

```
Video References

- Live on Perros de la Calle https://www.youtube.com/watch?v=Jp61xnO49Bo&t=660s
- Live at Studio J Sessions https://www.youtube.com/watch?v=KBZuAaxEJxM
```

## 3. Author notes

Free-form playing tips or context, included only if the source tab has them. Placed before the disclaimer.

```
Once you get the [Intro] down, you're pretty much almost there, it's reused quite a bit. In that section,
there are a few spots where one would be tempted to use hammer-ons, but they are just well-timed chord changes
in-sync with the strums.
```

## 4. Disclaimer

Always present. The format depends on whether author notes are included:

**With author notes:**

```
PS As usual, if you find any mistakes or missing bits, do let me know! Leave a comment down below and I'll look into it.
```

**Without author notes:**

```
If you find any mistakes or missing bits, do let me know! Leave a comment down below and I'll look into it.
```

## 5. Tab sections

### Section order

Each section follows this order:

1. Section header (e.g., `[Verse 2]`)
2. Parenthetical relationship note if applicable (e.g., `(same as first)`)
3. Descriptive comments (if any, e.g., "Nothing new here" or "Same as before, without the bass notes run")
4. Lyric quote
5. Tab

### Section headers

Use square brackets: `[Intro]`, `[Verse 1]`, `[Pre-Chorus]`, `[Chorus 1]`, `[Post-Chorus]`, `[Bridge]`, `[Instrumental]`, `[Outro]`.

Number sections only when there are multiple of the same type. Section names and numbering should match the Lyrics section at the bottom.

Always use `[Outro]` (not `[Ending]`).

### Inline lyrics

Always quote the full first line of the section's lyrics (matching the Lyrics section at the bottom), in double quotes with `...` at the end:

```
"Sacaste apenas un naipe ..."
```

### Repeating sections

Always write out the tab for every section, even when identical to a previous one. Add a parenthetical note in the header and/or a descriptive comment to signal that sections are the same:

```
[Verse 2] (same as first)

"No recuerdo bien lo que paso ..."

e|---5---------------------------------|
...
```

### Repeat notation

There are two types of repeats:

**Whole section repeats** — placed on the 3rd string (G in the example below), in the format `| xN`:

```
e|---0---0---|
B|---0---0---|
G|---8---6---| x2
D|---6---7---|
A|---7---0---|
E|---0-------|
```

**Partial repeats** (repeat from last `|`) — placed on a new line below, aligned with the `|` columns:

```
e|---3---3---|---3---0---|
B|---1---1---|---1---1---|
G|---2---0---|---2---2---|
D|---3---2---|---3---2---|
A|-------3---|-------0---|
E|---1-------|---1-------|
           x2|
```

### Arrow annotations

Use `↑` or `↓` arrows to point to specific notes, with explanatory text nearby. Use whichever direction makes sense to point at the note:

```
E|---6---------6--6-----------x-------------------------------------|
                              ↑
                These muted strings happen often throughout the song
```

```
                     ↓
e|-------------------0---------------|
B|--(1)--1-----------1---------1-----|
```

## 6. Legend

Placed after the last tab section. Only include symbols that are actually used in the tab.

Use `****` borders with blank lines between borders and content:

```
**********************************************************************

| /   Slide up
| h   Hammer-on
| ()  Notes that may not be played but complete the shape of the chord

**********************************************************************
```

The `()` symbol (notes that complete the chord shape but may not be played) is treated as any other symbol — only include it in the legend when used.

## 7. Lyrics

Always present at the bottom, after the legend. Section headers match the tab sections:

```
Lyrics

[Intro]

[Verse 1]
Sacaste apenas un naipe
Pero era el que sostenía el castillo

[Chorus 1]
Las cartas caían, el tiempo sangraba
Y toda estructura de toda poesía
Se desmoronaba
```
