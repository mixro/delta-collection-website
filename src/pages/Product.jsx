import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCatalog } from '../lib/catalog'
import { useBag } from '../lib/bag'
import { formatPrice, imageSrcSet, imageUrl } from '../lib/format'
import { askLink, productOrderLink } from '../lib/whatsapp'
import { useTitle } from '../lib/useTitle'
import { BUSINESS, GROUPS } from '../config'
import ProductCard from '../components/ProductCard'
import { SectionHead } from '../components/Section'
import { CheckIcon, MinusIcon, PlusIcon, ShareIcon, ShieldIcon, TruckIcon, WhatsAppIcon, ChatIcon } from '../components/Icons'
import NotFound from './NotFound'

export default function Product() {
  const { slug } = useParams()
  const { loading, products, catBySlug } = useCatalog()
  const bag = useBag()
  const [qty, setQty] = useState(1)
  const [copied, setCopied] = useState(false)
  const [added, setAdded] = useState(false)
  const p = products.find((x) => x.slug === slug)
  useTitle(p?.name)

  const related = useMemo(() => {
    if (!p) return []
    const same = products.filter((x) => x.slug !== p.slug && x.category === p.category && x.inStock)
    const brand = same.filter((x) => p.brand && x.brand === p.brand)
    const rest = same.filter((x) => !brand.includes(x)).sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
    return [...brand, ...rest].slice(0, 4)
  }, [p, products])

  if (loading) return <div className="container pad-xl"><div className="spinner" /></div>
  if (!p) return <NotFound />

  const cat = catBySlug[p.category]
  const group = GROUPS.find((g) => g.slug === cat?.group)
  const onSale = p.compareAtPrice && p.compareAtPrice > p.price

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: p.name, text: `${p.name} – ${formatPrice(p.price)}`, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* cancelled */
    }
  }

  const addToList = () => {
    bag.add(p, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <div className="product-page">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {group && (<><span>/</span><Link to={`/shop/${group.slug}`}>{group.name}</Link></>)}
          {cat && (<><span>/</span><Link to={`/category/${cat.slug}`}>{cat.name}</Link></>)}
        </nav>

        <div className="pdp">
          <div className="pdp-media">
            <div className="pdp-frame">
              <img
                src={imageUrl(p.image, 900, 1100)}
                srcSet={imageSrcSet(p.image, 900, 1100)}
                alt={p.name}
                width="900"
                height="1100"
                fetchpriority="high"
              />
              <div className="card-badges">
                {p.isNew && <span className="badge badge-gold">New</span>}
                {onSale && <span className="badge badge-sale">Sale</span>}
              </div>
            </div>
            <p className="muted small photo-note">Photo for illustration. Ask us on WhatsApp for a picture of the actual product.</p>
          </div>

          <div className="pdp-info">
            {p.brand && <p className="eyebrow">{p.brand}</p>}
            <h1 className="pdp-title">{p.name}</h1>
            <p className="pdp-price">
              {formatPrice(p.price)}
              {onSale && <s>{formatPrice(p.compareAtPrice)}</s>}
            </p>
            <div className="pdp-meta">
              <span className={`stock ${p.inStock ? 'in' : 'out'}`}>
                <span className="stock-dot" /> {p.inStock ? 'In stock' : 'Sold out'}
              </span>
              {p.size && <span className="muted">Size: {p.size}</span>}
              {cat && <Link to={`/category/${cat.slug}`} className="muted">{cat.name}</Link>}
            </div>

            <p className="pdp-desc">{p.description}</p>

            {p.inStock ? (
              <div className="pdp-actions">
                <div className="qty" aria-label="Quantity">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Less"><MinusIcon width={16} height={16} /></button>
                  <span aria-live="polite">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} aria-label="More"><PlusIcon width={16} height={16} /></button>
                </div>
                <a className="btn btn-gold btn-lg grow" href={productOrderLink(p, qty)} target="_blank" rel="noreferrer">
                  <WhatsAppIcon /> Order on WhatsApp
                </a>
                <button className="btn btn-outline btn-lg btn-block" onClick={addToList}>
                  {added ? (<><CheckIcon /> Added to your list</>) : (<><PlusIcon /> Add to my list</>)}
                </button>
              </div>
            ) : (
              <div className="pdp-actions">
                <a className="btn btn-outline btn-lg btn-block" href={askLink(`${p.name} (sold out)`)} target="_blank" rel="noreferrer">
                  <WhatsAppIcon /> Ask when it’s back
                </a>
              </div>
            )}

            <button className="link-btn share" onClick={share}>
              <ShareIcon width={16} height={16} /> {copied ? 'Link copied' : 'Share this product'}
            </button>

            <div className="pdp-perks">
              <div><ChatIcon /><span>Fast replies on WhatsApp</span></div>
              <div><TruckIcon /><span>Delivery fee confirmed before you pay</span></div>
              <div><ShieldIcon /><span>Carefully selected products</span></div>
            </div>

            <div className="accordion">
              <details open>
                <summary>How to order</summary>
                <p>Tap “Order on WhatsApp”. A message with this product and price opens in WhatsApp; just press send. We reply to confirm availability, delivery and payment.</p>
              </details>
              <details>
                <summary>Delivery</summary>
                <p>{BUSINESS.delivery}</p>
              </details>
              <details>
                <summary>Payment</summary>
                <p>{BUSINESS.payment}</p>
              </details>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead eyebrow="More to love" title="You may also like" link={cat ? `/category/${cat.slug}` : '/shop'} />
            <div className="grid">
              {related.map((r) => <ProductCard key={r.slug} product={r} />)}
            </div>
          </div>
        </section>
      )}

      {p.inStock && (
        <div className="sticky-order only-mobile">
          <div>
            <span className="small muted">{p.name}</span>
            <strong className="gold">{formatPrice(p.price * qty)}</strong>
          </div>
          <a className="btn btn-gold" href={productOrderLink(p, qty)} target="_blank" rel="noreferrer">
            <WhatsAppIcon width={18} height={18} /> Order
          </a>
        </div>
      )}
    </div>
  )
}
