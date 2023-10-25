import type { CollectionEntry } from 'astro:content'

export function toTabGroups(tabs: Array<CollectionEntry<'tabs'>>) {
  // 'Foo': [tab, tab, ...]
  // 'Bar': [tab, tab, ...]
  const tabsByArtistMap = tabs.reduce<
    Map<string, Array<CollectionEntry<'tabs'>>>
  >((map, tab) => {
    map.set(tab.data.artist, [...(map.get(tab.data.artist) ?? []), tab])
    return map
  }, new Map())

  // [
  //   {
  //     artist: {
  //       name: 'Foo'
  //       imageURL: '...'
  //     }
  //     tabs: [tab, tab, ...]
  //   },
  //   {
  //     artist: {
  //       name: 'Bar'
  //       imageURL: '...'
  //     }
  //     tabs: [tab, tab, ...]
  //   }
  // ]
  const tabGroups = [...tabsByArtistMap.entries()].map(([_, tabs]) => ({
    artist: {
      name: tabs[0].data.artist,
      imageURL: tabs[0].data.artistImageURL,
    },
    tabs,
  }))

  // Sort groups by artist, and their tabs by title
  return tabGroups
    .map((group) => ({
      ...group,
      tabs: group.tabs.sort((a, b) => a.data.title.localeCompare(b.data.title)),
    }))
    .sort((a, b) => a.artist.name.localeCompare(b.artist.name))
}

export function formatNumberWithOrdinalSuffix(value: number): string {
  const suffix = ['th', 'st', 'nd', 'rd']
  const units = value % 100
  return value + (suffix[(units - 20) % 10] ?? suffix[units] ?? suffix[0])
}

export const isNotDraft = (tab: CollectionEntry<'tabs'>) => !tab.data.isDraft
