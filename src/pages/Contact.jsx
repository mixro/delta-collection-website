import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BUSINESS } from '../config'
import { askLink } from '../lib/whatsapp'
import { useTitle } from '../lib/useTitle'
import { ClockIcon, InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '../components/Icons'

export default function Contact() {
  useTitle('Contact')
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])

  return (
    <div className="contact">
      <section className="page-hero center">
        <div className="container narrow">
          <p className="eyebrow">We’re here to help</p>
          <h1 className="h1">Contact us</h1>
          <p className="lead muted">The fastest way to reach us is WhatsApp. Send a message any time and we’ll reply as soon as we can.</p>
          <a className="btn btn-gold btn-lg" href={askLink()} target="_blank" rel="noreferrer"><WhatsAppIcon /> Chat on WhatsApp</a>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <a className="contact-card" href={askLink()} target="_blank" rel="noreferrer">
            <WhatsAppIcon width={26} height={26} />
            <h3>WhatsApp</h3>
            <p>{BUSINESS.phoneDisplay}</p>
          </a>
          <a className="contact-card" href={`tel:+${BUSINESS.whatsapp}`}>
            <PhoneIcon width={26} height={26} />
            <h3>Call</h3>
            <p>{BUSINESS.phoneDisplay}</p>
          </a>
          {BUSINESS.instagram && (
            <a className="contact-card" href={`https://instagram.com/${BUSINESS.instagram}`} target="_blank" rel="noreferrer">
              <InstagramIcon width={26} height={26} />
              <h3>Instagram</h3>
              <p>@{BUSINESS.instagram}</p>
            </a>
          )}
          <div className="contact-card">
            <PinIcon width={26} height={26} />
            <h3>Location</h3>
            <p>{BUSINESS.location}</p>
          </div>
          {BUSINESS.hours && (
            <div className="contact-card">
              <ClockIcon width={26} height={26} />
              <h3>Opening hours</h3>
              <p>{BUSINESS.hours}</p>
            </div>
          )}
        </div>
      </section>

      <section className="section section-tint">
        <div className="container narrow info-blocks">
          <div id="how-to-order" className="info-block">
            <h2 className="h3">How to order</h2>
            <ol className="plain-list">
              <li>Find the product you want and tap <strong>Order on WhatsApp</strong>, or add several products to <strong>My list</strong> and send them together.</li>
              <li>WhatsApp opens with your order written for you. Press send.</li>
              <li>We confirm availability, the delivery fee and payment, then send your order.</li>
            </ol>
          </div>
          <div id="delivery" className="info-block">
            <h2 className="h3">Delivery</h2>
            <p>{BUSINESS.delivery}</p>
          </div>
          <div className="info-block">
            <h2 className="h3">Payment</h2>
            <p>{BUSINESS.payment}</p>
          </div>
          <div className="info-block">
            <h2 className="h3">Returns & exchanges</h2>
            <p>{BUSINESS.returns}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
