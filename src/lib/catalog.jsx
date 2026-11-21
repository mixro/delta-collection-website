import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import bundled from '../data/products.json'
import { GROUPS } from '../config'
import { fromRow, supabase } from './supabase'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [state, setState] = useState(() =>
    supabase
      ? { loading: true, products: [], categories: [] }
      : { loading: false, products: bundled.products, categories: bundled.categories },
  )

  const load = useCallback(async () => {
    if (!supabase) return
    const [cats, prods] = await Promise.all([
      supabase.from('categories').select('*').order('sort'),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
    ])
    if (cats.error || prods.error) {
      console.warn('Supabase unavailable, using bundled catalogue', cats.error || prods.error)
      setState({ loading: false, products: bundled.products, categories: bundled.categories })
      return
    }
    setState({ loading: false, products: prods.data.map(fromRow), categories: cats.data })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const value = useMemo(() => {
    const { products, categories } = state
    const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]))
    const groupOf = (p) => catBySlug[p.category]?.group
    const groups = GROUPS.map((g) => ({
      ...g,
      categories: categories.filter((c) => c.group === g.slug),
      count: products.filter((p) => groupOf(p) === g.slug).length,
    })).filter((g) => g.count > 0 || g.categories.length > 0)
    const countByCat = products.reduce((m, p) => ((m[p.category] = (m[p.category] || 0) + 1), m), {})
    const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b))
    // Newest first: database order, or highest id for the bundled list.
    const newest = supabase ? products : [...products].sort((a, b) => b.id - a.id)
    return { ...state, catBySlug, groupOf, groups, countByCat, brands, newest, reload: load }
  }, [state, load])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export const useCatalog = () => useContext(CatalogContext)

const escape = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function searchProducts(products, q, catBySlug = {}) {
  const phrase = q.toLowerCase().trim()
  const terms = phrase.split(/\s+/).filter(Boolean)
  if (!terms.length) return products
  // Short terms ("c" in "vitamin c") must match a whole word, longer ones any part of a word.
  const matchers = terms.map((t) => (t.length <= 2 ? new RegExp(`(^|[^a-z0-9])${escape(t)}($|[^a-z0-9])`) : { test: (h) => h.includes(t) }))
  return products
    .map((p) => {
      const hay = `${p.name} ${p.brand} ${catBySlug[p.category]?.name || ''} ${(p.tags || []).join(' ')}`.toLowerCase()
      if (!matchers.every((m) => m.test(hay))) return null
      const name = p.name.toLowerCase()
      let score = terms.reduce((s, t) => s + (name.startsWith(t) ? 3 : name.includes(t) ? 2 : 1), 0)
      if (name.includes(phrase)) score += 5
      return { p, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p)
}
