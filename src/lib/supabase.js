import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// The site works without Supabase (it uses src/data/products.json);
// the admin panel needs it.
export const supabase = url && key ? createClient(url, key) : null
export const isSupabaseReady = Boolean(supabase)
export const IMAGE_BUCKET = 'product-images'

// Database rows use snake_case; the app uses camelCase.
export function fromRow(r) {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand || '',
    category: r.category,
    price: r.price,
    compareAtPrice: r.compare_at_price || null,
    size: r.size || '',
    image: r.image || '',
    description: r.description || '',
    inStock: r.in_stock,
    isNew: r.is_new,
    tags: r.tags || [],
    createdAt: r.created_at,
  }
}

export function toRow(p) {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand || null,
    category: p.category,
    price: Number(p.price),
    compare_at_price: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    size: p.size || null,
    image: p.image || null,
    description: p.description || null,
    in_stock: Boolean(p.inStock),
    is_new: Boolean(p.isNew),
    tags: p.tags || [],
  }
}
