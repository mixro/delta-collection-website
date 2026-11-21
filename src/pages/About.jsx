import { Link } from 'react-router-dom'
import { useTitle } from '../lib/useTitle'
import { useCatalog } from '../lib/catalog'
import { imageUrl } from '../lib/format'
import { askLink } from '../lib/whatsapp'
import { ArrowRight, WhatsAppIcon } from '../components/Icons'

export default function About() {
  useTitle('About us')
  const { products, brands } = useCatalog()
  return (
    <div className="about">
      <section className="page-hero center">
        <div className="container narrow">
          <p className="eyebrow">Our story</p>
          <h1 className="h1">Beauty you can <em>trust</em>, one tap away</h1>
          <p className="lead muted">
            Delta Collection began on WhatsApp and Instagram status, sharing new skincare, body care and perfume
            arrivals with customers every day. This website brings the whole collection together in one place,
            so you can browse everything, any time, and order in seconds.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="split-media">
            <img src="/brand/logo-circle.webp" alt="Delta Collection logo" width="640" height="646" loading="lazy" />
          </div>
          <div className="split-copy">
            <h2 className="h2">What we stand for</h2>
            <ul className="values">
              <li>
                <h3>Carefully chosen</h3>
                <p>We pick products that our customers love and come back for: from Korean and Indian skincare to Arabian perfumes.</p>
              </li>
              <li>
                <h3>Personal service</h3>
                <p>Every order is handled by a real person on WhatsApp. Ask us anything before you buy.</p>
              </li>
              <li>
                <h3>Always something new</h3>
                <p>New products arrive almost every day. Check the New arrivals section often.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <dl className="about-stats">
            <div><dt>{products.length}+</dt><dd>Products</dd></div>
            <div><dt>{brands.length}+</dt><dd>Brands</dd></div>
            <div><dt>Daily</dt><dd>New arrivals</dd></div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container split reverse">
          <div className="split-media">
            <img src={imageUrl('https://images.unsplash.com/photo-1783905326791-c1fb6b8bc113', 800, 900)} alt="" width="800" height="900" loading="lazy" />
          </div>
          <div className="split-copy">
            <h2 className="h2">Find your favourites</h2>
            <p className="lead muted">Explore serums, moisturizers, sunscreen, body lotions, scrubs, oils and a wide fragrance collection.</p>
            <div className="row-gap">
              <Link to="/shop" className="btn btn-gold">Shop the collection <ArrowRight width={18} height={18} /></Link>
              <a href={askLink()} className="btn btn-outline" target="_blank" rel="noreferrer"><WhatsAppIcon /> Talk to us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
