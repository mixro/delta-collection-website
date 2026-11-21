import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBag } from '../lib/bag'
import { formatPrice, imageUrl } from '../lib/format'
import { listOrderLink } from '../lib/whatsapp'
import { BagIcon, CloseIcon, MinusIcon, PlusIcon, WhatsAppIcon } from './Icons'

export default function BagDrawer() {
  const bag = useBag()
  useEffect(() => {
    document.body.classList.toggle('no-scroll', bag.open)
  }, [bag.open])

  return (
    <>
      <div className={`drawer-backdrop ${bag.open ? 'is-open' : ''}`} onClick={() => bag.setOpen(false)} />
      <aside className={`bag-drawer ${bag.open ? 'is-open' : ''}`} aria-hidden={!bag.open} aria-label="My list">
        <div className="drawer-head">
          <div>
            <h2 className="drawer-title">My list</h2>
            <p className="muted small">Collect products, then send them to us in one WhatsApp message.</p>
          </div>
          <button className="icon-btn" onClick={() => bag.setOpen(false)} aria-label="Close list">
            <CloseIcon />
          </button>
        </div>
        {bag.items.length === 0 ? (
          <div className="bag-empty">
            <BagIcon width={36} height={36} />
            <p>Your list is empty.</p>
            <Link to="/shop" className="btn btn-outline" onClick={() => bag.setOpen(false)}>Browse the collection</Link>
          </div>
        ) : (
          <>
            <ul className="bag-items">
              {bag.items.map(({ product: p, qty }) => (
                <li key={p.slug} className="bag-item">
                  <img src={imageUrl(p.image, 120, 150)} alt="" width="60" height="75" />
                  <div className="bag-item-info">
                    <Link to={`/product/${p.slug}`} onClick={() => bag.setOpen(false)} className="bag-item-name">{p.name}</Link>
                    <span className="gold">{formatPrice(p.price * qty)}</span>
                    <div className="qty qty-sm">
                      <button onClick={() => bag.setQty(p.slug, qty - 1)} aria-label="Less"><MinusIcon width={14} height={14} /></button>
                      <span>{qty}</span>
                      <button onClick={() => bag.setQty(p.slug, qty + 1)} aria-label="More"><PlusIcon width={14} height={14} /></button>
                    </div>
                  </div>
                  <button className="link-btn small" onClick={() => bag.setQty(p.slug, 0)}>Remove</button>
                </li>
              ))}
            </ul>
            <div className="bag-foot">
              <div className="bag-total">
                <span>Total</span>
                <strong>{formatPrice(bag.total)}</strong>
              </div>
              <p className="muted small">Delivery fee is confirmed on WhatsApp.</p>
              <a className="btn btn-gold btn-block btn-lg" href={listOrderLink(bag.items)} target="_blank" rel="noreferrer">
                <WhatsAppIcon /> Send order on WhatsApp
              </a>
              <button className="link-btn small center" onClick={bag.clear}>Clear list</button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
