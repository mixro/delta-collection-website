export const formatPrice = (n) => `TZS ${Number(n || 0).toLocaleString('en-US')}`

export function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Sized, compressed photo URLs. Unsplash and Supabase both resize on the fly.
export function imageUrl(src, w = 600, h) {
  if (!src) return '/brand/monogram.png'
  if (src.includes('images.unsplash.com')) {
    const base = src.split('?')[0]
    const height = h || Math.round(w * 1.25)
    return `${base}?auto=format&fit=crop&w=${w}&h=${height}&q=72`
  }
  return src
}

export const imageSrcSet = (src, w, h) =>
  src && src.includes('images.unsplash.com')
    ? `${imageUrl(src, w, h)} 1x, ${imageUrl(src, w * 2, h ? h * 2 : undefined)} 2x`
    : undefined
