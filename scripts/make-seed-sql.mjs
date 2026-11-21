// Builds supabase/seed.sql from src/data/products.json.
// Run: npm run seed-sql
import { readFileSync, writeFileSync } from 'node:fs'

const data = JSON.parse(readFileSync(new URL('../src/data/products.json', import.meta.url)))
const q = (v) => (v === null || v === undefined || v === '' ? 'null' : `'${String(v).replace(/'/g, "''")}'`)

let sql = '-- Loads the Delta Collection price list. Safe to run more than once.\n\n'
sql += 'insert into public.categories (slug, name, "group", sort) values\n'
sql += data.categories.map((c) => `  (${q(c.slug)}, ${q(c.name)}, ${q(c.group)}, ${c.sort})`).join(',\n')
sql += '\non conflict (slug) do update set name = excluded.name, "group" = excluded."group", sort = excluded.sort;\n\n'

// Older products get older timestamps so "newest first" matches the price list order.
const base = Date.parse('2026-11-01T00:00:00Z')
sql += 'insert into public.products (slug, name, brand, category, price, image, description, in_stock, is_new, created_at) values\n'
sql += data.products
  .map((p) => {
    const created = new Date(base + p.id * 60000).toISOString()
    return `  (${q(p.slug)}, ${q(p.name)}, ${q(p.brand)}, ${q(p.category)}, ${p.price}, ${q(p.image)}, ${q(p.description)}, ${p.inStock}, ${p.isNew}, '${created}')`
  })
  .join(',\n')
sql += '\non conflict (slug) do nothing;\n'

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql)
console.log(`supabase/seed.sql: ${data.categories.length} categories, ${data.products.length} products`)
