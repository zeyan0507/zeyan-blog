import { getCollection, type CollectionEntry } from 'astro:content'

type PostCollectionKey = 'blog'
type PostData = {
  publishDate?: Date
  updatedDate?: Date
  tags: string[]
  draft?: boolean
  pin?: boolean
}
type Collections = CollectionEntry<PostCollectionKey>[]

export const prod = import.meta.env.PROD

/** Note: this function filters out draft posts based on the environment */
export function getBlogCollection(): Promise<CollectionEntry<'blog'>[]>
export async function getBlogCollection() {
  return getCollection('blog', ({ data }) => (prod ? !data.draft : true))
}

function getYearFromCollection<T extends PostCollectionKey>(
  collection: CollectionEntry<T>
): number | undefined {
  const data = collection.data as PostData
  const dateStr = data.updatedDate ?? data.publishDate
  return dateStr ? new Date(dateStr).getFullYear() : undefined
}
export function groupCollectionsByYear<T extends PostCollectionKey>(
  collections: CollectionEntry<T>[]
): [number, CollectionEntry<T>[]][] {
  const collectionsByYear = collections.reduce((acc, collection) => {
    const year = getYearFromCollection(collection)
    if (year !== undefined) {
      if (!acc.has(year)) {
        acc.set(year, [])
      }
      acc.get(year)?.push(collection)
    }
    return acc
  }, new Map<number, CollectionEntry<T>[]>())

  return Array.from(
    collectionsByYear.entries() as IterableIterator<[number, CollectionEntry<T>[]]>
  ).sort((a, b) => b[0] - a[0])
}

export function sortMDByDate<T extends PostCollectionKey>(
  collections: CollectionEntry<T>[]
): CollectionEntry<T>[] {
  return collections.sort((a, b) => {
    const aData = a.data as PostData
    const bData = b.data as PostData
    const aPin = aData.pin === true
    const bPin = bData.pin === true
    if (aPin !== bPin) {
      return Number(bPin) - Number(aPin)
    }

    const aDate = new Date(aData.publishDate ?? 0).valueOf()
    const bDate = new Date(bData.publishDate ?? 0).valueOf()
    return bDate - aDate
  })
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getAllTags(collections: Collections) {
  return collections.flatMap((collection) => [...(collection.data as PostData).tags])
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTags(collections: Collections) {
  return [...new Set(getAllTags(collections))]
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTagsWithCount(collections: Collections): [string, number][] {
  return [
    ...getAllTags(collections).reduce(
      (acc, t) => acc.set(t, (acc.get(t) || 0) + 1),
      new Map<string, number>()
    )
  ].sort((a, b) => b[1] - a[1])
}
