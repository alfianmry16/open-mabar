/**
 * Generate a URL-safe slug from a string
 * @param text - The text to slugify
 * @returns A URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 * Generate a unique slug by appending a random string
 * @param text - The text to slugify
 * @returns A unique URL-safe slug
 */
export function generateUniqueSlug(text: string): string {
  const baseSlug = slugify(text)
  const randomString = Math.random().toString(36).substring(2, 7)
  return `${baseSlug}-${randomString}`
}
