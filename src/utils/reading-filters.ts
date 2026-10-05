import type { ReadingEntry } from './paper-reading'

export interface ReadingFilters {
  query: string
  topic: string
  year: string
  sort: 'updated' | 'published' | 'year'
  page: number
}

export const matchesReadingQuery = (entry: ReadingEntry, query: string) => {
  const terms = query.normalize('NFKC').toLowerCase().trim().split(/\s+/u).filter(Boolean)
  return terms.every((term) => entry.searchText.includes(term))
}

export const selectReadingEntries = (
  entries: ReadingEntry[],
  filters: ReadingFilters,
  fullTextMatches = new Set<string>()
) =>
  entries
    .filter(
      (entry) =>
        (!filters.query ||
          matchesReadingQuery(entry, filters.query) ||
          fullTextMatches.has(entry.id)) &&
        (!filters.topic ||
          (filters.topic === 'unclassified'
            ? entry.topics.length === 0
            : entry.topics.includes(filters.topic))) &&
        (!filters.year || entry.year === filters.year)
    )
    .sort((first, second) => {
      const comparison =
        filters.sort === 'year'
          ? (Number(second.year) || 0) - (Number(first.year) || 0)
          : second[filters.sort].localeCompare(first[filters.sort])
      return (
        comparison ||
        second.updated.localeCompare(first.updated) ||
        first.id.localeCompare(second.id)
      )
    })
