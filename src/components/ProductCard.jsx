import { Link } from 'react-router-dom'
import { useCatalog } from '../lib/catalog'
import { useBag } from '../lib/bag'
import { formatPrice, imageSrcSet, imageUrl } from '../lib/format'
import { productOrderLink } from '../lib/whatsapp'
import { CheckIcon, PlusIcon, WhatsAppIcon } from './Icons'

export default function ProductCard({ product: p, eager = false }) {
  const { catBySlug } = useCatalog()
  const bag = useBag()
  const inList = bag.has(p.slug)
  const onSale = p.compareAtPrice && p.compareAtPrice > p.price
  return (
    <article className={`card ${p.inStock ? '' : 'is-out'}`}>
      <Link to={`/product/${p.slug}`} className="card-media" aria-label={p.name}>
        <img
          src={imageUrl(p.image, 400)}
          srcSet={imageSrcSet(p.image, 400)}
          alt={p.name}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          width="400"
          height="500"
        />
        <div className="card-badges">
          {p.isNew && <span className="badge badge-gold">New</span>}
          {onSale && <span className="badge badge-sale">Sale</span>}
          {!p.inStock && <span className="badge badge-muted">Sold out</span>}
        </div>
      </Link>
      <button
        className={`card-add ${inList ? 'is-added' : ''}`}
        onClick={() => (inList ? bag.setOpen(true) : bag.add(p))}
        aria-label={inList ? 'In your list' : `Add ${p.name} to your list`}
        title={inList ? 'In your list' : 'Add to list'}
        disabled={!p.inStock}
      >
        {inList ? <CheckIcon width={16} height={16} /> : <PlusIcon width={16} height={16} />}
      </button>
      <div className="card-body">
        <p className="eyebrow">{p.brand || catBySlug[p.category]?.name}</p>
        <h3 className="card-title">
          <Link to={`/product/${p.slug}`}>{p.name}</Link>
        </h3>
        <p className="card-price">
          {formatPrice(p.price)}
          {onSale && <s>{formatPrice(p.compareAtPrice)}</s>}
        </p>
        {p.inStock ? (
          <a className="btn btn-outline btn-sm card-order" href={productOrderLink(p)} target="_blank" rel="noreferrer">
            <WhatsAppIcon width={15} height={15} /> Order
          </a>
        ) : (
          <span className="btn btn-ghost btn-sm card-order is-disabled">Sold out</span>
        )}
      </div>
    </article>
  )
}

export function CardSkeleton() {
  return (
    <div className="card skeleton" aria-hidden>
      <div className="card-media" />
      <div className="card-body">
        <span className="sk-line w40" />
        <span className="sk-line w80" />
        <span className="sk-line w30" />
      </div>
    </div>
  )
}
