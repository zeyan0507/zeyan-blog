import type { CollectionEntry } from 'astro:content'

export function collectionPosts(collection: CollectionEntry<'collections'>, posts: CollectionEntry<'blog'>[]) {
  return posts
    .filter((post) => !post.data.draft && (
      post.data.collection === collection.id ||
      collection.data.posts.includes(post.id) ||
      (post.data.translationKey ? collection.data.posts.includes(post.data.translationKey) : false)
    ))
    .sort((first, second) => {
      const firstIndex = collection.data.posts.indexOf(first.data.translationKey || first.id)
      const secondIndex = collection.data.posts.indexOf(second.data.translationKey || second.id)
      if (firstIndex >= 0 || secondIndex >= 0) {
        return (firstIndex < 0 ? Infinity : firstIndex) - (secondIndex < 0 ? Infinity : secondIndex)
      }
      return first.data.publishDate.valueOf() - second.data.publishDate.valueOf()
    })
}
