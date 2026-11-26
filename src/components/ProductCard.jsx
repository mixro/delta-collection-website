import { Link } from 'react-router-dom'
import { useCatalog } from '../lib/catalog'
import { useBag } from '../lib/bag'
import { formatPrice, imageSrcSet, imageUrl } from '../lib/format'
import { BagIcon, CheckIcon } from './Icons'

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
          <button
            className={`btn btn-sm card-order ${inList ? 'btn-gold' : 'btn-outline'}`}
            onClick={() => (inList ? bag.setOpen(true) : bag.add(p))}
            aria-label={inList ? `${p.name} is in your cart, view cart` : `Add ${p.name} to cart`}
          >
            {inList ? <><CheckIcon width={15} height={15} /> In cart</> : <><BagIcon width={15} height={15} /> Add to cart</>}
          </button>
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
