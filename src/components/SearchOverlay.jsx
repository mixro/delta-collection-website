import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { searchProducts, useCatalog } from '../lib/catalog'
import { formatPrice, imageUrl } from '../lib/format'
import { CONCERNS } from '../config'
import { ArrowRight, CloseIcon, SearchIcon } from './Icons'

export default function SearchOverlay({ open, onClose, onOpen }) {
  const { products, catBySlug } = useCatalog()
  const [q, setQ] = useState('')
  const input = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === '/' && !open && !/input|textarea|select/i.test(document.activeElement?.tagName)) {
        e.preventDefault()
        onOpen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onOpen])

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 50)
    document.body.classList.toggle('no-scroll', open)
  }, [open])

  const results = useMemo(() => (q.trim() ? searchProducts(products, q, catBySlug).slice(0, 6) : []), [q, products, catBySlug])
  const total = useMemo(() => (q.trim() ? searchProducts(products, q, catBySlug).length : 0), [q, products, catBySlug])

  const submit = (e) => {
    e.preventDefault()
    if (q.trim()) navigate(`/shop?q=${encodeURIComponent(q.trim())}`)
  }

  if (!open) return null
  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search">
      <div className="search-backdrop" onClick={onClose} />
      <div className="search-panel">
        <form className="search-field" onSubmit={submit}>
          <SearchIcon />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search serums, perfumes, brands…"
            aria-label="Search products"
            enterKeyHint="search"
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search">
            <CloseIcon />
          </button>
        </form>
        {!q.trim() && (
          <div className="search-suggest">
            <p className="eyebrow">Popular searches</p>
            <div className="chips">
              {['Rayhaan', 'Vitamin C', 'Sunscreen', 'Body scrub', 'Lattafa', 'Niacinamide', 'Body oil', 'Dot & Key'].map((t) => (
                <button key={t} className="chip" onClick={() => setQ(t)}>{t}</button>
              ))}
            </div>
            <p className="eyebrow">Shop by concern</p>
            <div className="chips">
              {CONCERNS.slice(0, 6).map((c) => (
                <Link key={c.q} className="chip" to={`/shop?q=${encodeURIComponent(c.q)}`}>{c.label}</Link>
              ))}
            </div>
          </div>
        )}
        {q.trim() && (
          <div className="search-results">
            {results.length === 0 && <p className="muted pad">No products match “{q}”. Try a brand or product type.</p>}
            {results.map((p) => (
              <Link key={p.slug} to={`/product/${p.slug}`} className="search-row">
                <img src={imageUrl(p.image, 96, 96)} alt="" width="48" height="48" loading="lazy" />
                <span className="search-row-text">
                  <span className="search-row-name">{p.name}</span>
                  <span className="muted small">{catBySlug[p.category]?.name}</span>
                </span>
                <span className="search-row-price">{formatPrice(p.price)}</span>
              </Link>
            ))}
            {total > results.length && (
              <button className="search-all" onClick={submit}>
                See all {total} results <ArrowRight width={16} height={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
