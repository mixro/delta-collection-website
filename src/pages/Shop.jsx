import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { searchProducts, useCatalog } from '../lib/catalog'
import { useTitle } from '../lib/useTitle'
import { GROUPS, PRICE_RANGES } from '../config'
import ProductCard, { CardSkeleton } from '../components/ProductCard'
import { CloseIcon, FilterIcon, SearchIcon } from '../components/Icons'

const PAGE = 24
const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'new', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name', label: 'Name A–Z' },
]

export default function Shop() {
  const { group: groupParam, slug: catParam } = useParams()
  const [params, setParams] = useSearchParams()
  const { loading, products, newest, catBySlug, groups, brands, countByCat } = useCatalog()
  const [shown, setShown] = useState(PAGE)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [brandFilter, setBrandFilter] = useState('')

  const q = params.get('q') || ''
  const sort = params.get('sort') || (q ? 'featured' : 'featured')
  const price = params.get('price') || ''
  const brand = params.get('brand') || ''
  const inStockOnly = params.get('stock') === '1'
  const cat = catParam || params.get('cat') || ''
  const groupSlug = groupParam || (cat ? catBySlug[cat]?.group : '') || ''
  const group = GROUPS.find((g) => g.slug === groupSlug)
  const category = catBySlug[cat]

  const title = q ? `Results for “${q}”` : category?.name || group?.name || 'All products'
  useTitle(q ? `Search: ${q}` : category?.name || group?.name || 'Shop')

  const set = (key, val) => {
    const next = new URLSearchParams(params)
    if (val) next.set(key, val)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  useEffect(() => {
    setShown(PAGE)
  }, [q, sort, price, brand, cat, groupSlug, inStockOnly])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', filtersOpen)
  }, [filtersOpen])

  // Products in the current scope (search + group/category), before brand/price filters.
  const scoped = useMemo(() => {
    let list = sort === 'new' ? newest : products
    if (cat) list = list.filter((p) => p.category === cat)
    else if (groupSlug) list = list.filter((p) => catBySlug[p.category]?.group === groupSlug)
    if (q) list = searchProducts(list, q, catBySlug)
    return list
  }, [products, newest, sort, cat, groupSlug, q, catBySlug])

  const filtered = useMemo(() => {
    let list = scoped
    if (brand) list = list.filter((p) => p.brand === brand)
    const range = PRICE_RANGES.find((r) => r.id === price)
    if (range) list = list.filter((p) => p.price >= range.min && p.price <= range.max)
    if (inStockOnly) list = list.filter((p) => p.inStock)
    const sorted = [...list]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'featured' && !q) return featuredOrder(sorted)
    return sorted
  }, [scoped, brand, price, inStockOnly, sort, q])

  const scopedBrands = useMemo(() => {
    const set = new Set(scoped.map((p) => p.brand).filter(Boolean))
    return brands.filter((b) => set.has(b) && b.toLowerCase().includes(brandFilter.toLowerCase()))
  }, [scoped, brands, brandFilter])

  const activeFilters = [
    brand && { key: 'brand', label: brand },
    price && { key: 'price', label: PRICE_RANGES.find((r) => r.id === price)?.label },
    inStockOnly && { key: 'stock', label: 'In stock' },
    q && { key: 'q', label: `“${q}”` },
  ].filter(Boolean)

  const subcats = group ? groups.find((g) => g.slug === group.slug)?.categories || [] : []

  const filterPanel = (
    <div className="filters">
      <div className="filter-block">
        <h3 className="filter-h">Category</h3>
        <ul className="filter-list">
          <li><Link className={!groupSlug ? 'is-active' : ''} to={{ pathname: '/shop', search: q ? `?q=${encodeURIComponent(q)}` : '' }}>All products</Link></li>
          {groups.map((g) => (
            <li key={g.slug}>
              <Link className={groupSlug === g.slug && !cat ? 'is-active' : ''} to={`/shop/${g.slug}`}>
                {g.name} <span className="muted">{g.count}</span>
              </Link>
              {groupSlug === g.slug && (
                <ul className="filter-sub">
                  {g.categories.map((c) => (
                    <li key={c.slug}>
                      <Link className={cat === c.slug ? 'is-active' : ''} to={`/category/${c.slug}`}>
                        {c.name} <span className="muted">{countByCat[c.slug] || 0}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="filter-block">
        <h3 className="filter-h">Price (TZS)</h3>
        <div className="radio-list">
          {PRICE_RANGES.map((r) => (
            <label key={r.id} className="radio">
              <input type="radio" name="price" checked={price === r.id} onChange={() => set('price', price === r.id ? '' : r.id)} onClick={() => price === r.id && set('price', '')} />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>
      {scopedBrands.length > 0 || brandFilter ? (
        <div className="filter-block">
          <h3 className="filter-h">Brand</h3>
          <input className="input input-sm" placeholder="Find a brand" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} />
          <div className="brand-list">
            {scopedBrands.map((b) => (
              <label key={b} className="radio">
                <input type="radio" name="brand" checked={brand === b} onChange={() => set('brand', b)} onClick={() => brand === b && set('brand', '')} />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>
      ) : null}
      <div className="filter-block">
        <label className="switch">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => set('stock', e.target.checked ? '1' : '')} />
          <span className="switch-track" />
          <span>In stock only</span>
        </label>
      </div>
    </div>
  )

  return (
    <div className="shop">
      <section className="page-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            {group ? <Link to={`/shop/${group.slug}`}>{group.name}</Link> : <Link to="/shop">Shop</Link>}
            {category && (<><span>/</span><span>{category.name}</span></>)}
          </nav>
          <h1 className="h1">{title}</h1>
          {!q && (group || category) && <p className="lead muted">{category ? group?.blurb : group?.blurb}</p>}
          {!group && !q && (
            <div className="chips subcat-chips">
              <Link to="/shop" className="chip is-active">All</Link>
              {groups.map((g) => (
                <Link key={g.slug} to={`/shop/${g.slug}`} className="chip">{g.name}</Link>
              ))}
            </div>
          )}
          {subcats.length > 0 && (
            <div className="chips subcat-chips">
              <Link to={`/shop/${group.slug}`} className={`chip ${!cat ? 'is-active' : ''}`}>All</Link>
              {subcats.map((c) => (
                <Link key={c.slug} to={`/category/${c.slug}`} className={`chip ${cat === c.slug ? 'is-active' : ''}`}>
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container shop-layout">
        <aside className="shop-side only-desktop">{filterPanel}</aside>
        <div className="shop-main">
          <div className="toolbar">
            <span className="muted">{loading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'}`}</span>
            <div className="toolbar-right">
              <button className="btn btn-ghost btn-sm only-mobile" onClick={() => setFiltersOpen(true)}>
                <FilterIcon width={16} height={16} /> Filters{activeFilters.length ? ` (${activeFilters.length})` : ''}
              </button>
              <label className="select-wrap">
                <span className="sr-only">Sort by</span>
                <select className="select" value={sort} onChange={(e) => set('sort', e.target.value === 'featured' ? '' : e.target.value)}>
                  {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="chips active-chips">
              {activeFilters.map((f) => (
                <button key={f.key} className="chip chip-gold" onClick={() => set(f.key, '')}>
                  {f.label} <CloseIcon width={12} height={12} />
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-3">{Array.from({ length: 9 }, (_, i) => <CardSkeleton key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <SearchIcon width={34} height={34} />
              <h2 className="h3">Nothing found</h2>
              <p className="muted">Try another search or clear the filters. You can also ask us on WhatsApp, we may have it in stock.</p>
              <Link className="btn btn-outline" to="/shop">See all products</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-3">
                {filtered.slice(0, shown).map((p, i) => <ProductCard key={p.slug} product={p} eager={i < 6} />)}
              </div>
              {shown < filtered.length && (
                <div className="load-more">
                  <p className="muted small">Showing {shown} of {filtered.length}</p>
                  <button className="btn btn-outline" onClick={() => setShown((s) => s + PAGE)}>Load more</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className={`drawer-backdrop ${filtersOpen ? 'is-open' : ''}`} onClick={() => setFiltersOpen(false)} />
      <aside className={`filter-sheet ${filtersOpen ? 'is-open' : ''}`} aria-hidden={!filtersOpen}>
        <div className="drawer-head">
          <h2 className="drawer-title">Filters</h2>
          <button className="icon-btn" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><CloseIcon /></button>
        </div>
        <div className="sheet-body">{filterPanel}</div>
        <div className="sheet-foot">
          <button className="btn btn-gold btn-block" onClick={() => setFiltersOpen(false)}>Show {filtered.length} products</button>
        </div>
      </aside>
    </div>
  )
}

// Mix categories so the first screen shows variety, in-stock items first.
function featuredOrder(list) {
  const buckets = new Map()
  for (const p of list) {
    if (!buckets.has(p.category)) buckets.set(p.category, [])
    buckets.get(p.category).push(p)
  }
  const queues = [...buckets.values()].sort((a, b) => b.length - a.length).map((b) => [...b].sort((a, c) => Number(c.inStock) - Number(a.inStock) || c.id - a.id))
  const out = []
  while (out.length < list.length) {
    for (const q of queues) if (q.length) out.push(q.shift())
  }
  return out.sort((a, b) => Number(b.inStock) - Number(a.inStock))
}
