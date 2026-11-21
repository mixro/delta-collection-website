import { Link } from 'react-router-dom'
import { BUSINESS } from '../config'
import { useCatalog } from '../lib/catalog'
import { askLink } from '../lib/whatsapp'
import { InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from './Icons'

export default function Footer() {
  const { groups } = useCatalog()
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/brand/logo-wordmark.webp" alt="Delta Collection" width="300" height="84" loading="lazy" />
          <p className="muted">Quality skincare, body care and perfumes, chosen for you and delivered to your door.</p>
          <a className="btn btn-gold btn-sm" href={askLink()} target="_blank" rel="noreferrer">
            <WhatsAppIcon width={16} height={16} /> Chat on WhatsApp
          </a>
        </div>
        <div>
          <h4 className="footer-h">Shop</h4>
          <ul className="footer-links">
            {groups.map((g) => (
              <li key={g.slug}><Link to={`/shop/${g.slug}`}>{g.name}</Link></li>
            ))}
            <li><Link to="/shop?sort=new">New arrivals</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-h">Help</h4>
          <ul className="footer-links">
            <li><Link to="/contact#how-to-order">How to order</Link></li>
            <li><Link to="/contact#delivery">Delivery & payment</Link></li>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-h">Contact</h4>
          <ul className="footer-links footer-contact">
            <li><WhatsAppIcon width={16} height={16} /> <a href={askLink()} target="_blank" rel="noreferrer">{BUSINESS.phoneDisplay}</a></li>
            <li><PhoneIcon width={16} height={16} /> <a href={`tel:+${BUSINESS.whatsapp}`}>Call us</a></li>
            {BUSINESS.instagram && (
              <li><InstagramIcon width={16} height={16} /> <a href={`https://instagram.com/${BUSINESS.instagram}`} target="_blank" rel="noreferrer">@{BUSINESS.instagram}</a></li>
            )}
            <li><PinIcon width={16} height={16} /> {BUSINESS.location}</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</span>
        <span className="muted">Prices in Tanzanian Shillings (TZS)</span>
      </div>
    </footer>
  )
}
