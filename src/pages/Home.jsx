import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useCatalog } from '../lib/catalog'
import { imageUrl } from '../lib/format'
import { askLink } from '../lib/whatsapp'
import { useTitle } from '../lib/useTitle'
import { CONCERNS } from '../config'
import ProductCard, { CardSkeleton } from '../components/ProductCard'
import { SectionHead } from '../components/Section'
import { ArrowRight, ChatIcon, ShieldIcon, SparkleIcon, TruckIcon, WhatsAppIcon } from '../components/Icons'

const FEATURED_TILES = [
  { to: '/category/serums', label: 'Serums', cat: 'serums', img: 'https://images.unsplash.com/photo-1788968512533-13bd9aac2243' },
  { to: '/category/moisturizers', label: 'Moisturizers & Creams', cat: 'moisturizers', img: 'https://images.unsplash.com/photo-1764694071508-e4b1efcd39bc' },
  { to: '/category/sunscreen', label: 'Sunscreen', cat: 'sunscreen', img: 'https://images.unsplash.com/photo-1594055103006-7871176f1a7e' },
  { to: '/shop/body-care', label: 'Body Care', group: 'body-care', img: 'https://images.unsplash.com/photo-1748543668676-ea8241cb3886' },
  { to: '/category/perfumes', label: 'Perfumes', cat: 'perfumes', img: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75' },
]

const PERFUME_HOUSES = ['Rayhaan', 'Lattafa', 'An Abiyedh', 'Khair', 'Taskeen', 'Qaed Al Fursan']

export default function Home() {
  useTitle()
  const { loading, products, newest, countByCat, groups } = useCatalog()

  const fresh = useMemo(() => newest.filter((p) => p.inStock).slice(0, 8), [newest])
  const perfumes = useMemo(
    () => products.filter((p) => p.category === 'perfumes' && p.inStock).sort((a, b) => b.price - a.price).slice(0, 10),
    [products],
  )
  const value = useMemo(() => products.filter((p) => p.price <= 15000 && p.inStock).slice(0, 8), [products])
  const groupCount = (slug) => groups.find((g) => g.slug === slug)?.count || 0

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" aria-hidden />
        <div className="container hero-inner">
          <div className="hero-copy reveal">
            <p className="eyebrow">Skincare · Body care · Perfumes</p>
            <h1 className="display">
              Glow with <em>confidence</em>
            </h1>
            <p className="lead">
              Serums, moisturizers, sunscreen, body care and fine perfumes, hand-picked for you. Browse the full
              collection and order in one tap on WhatsApp.
            </p>
            <div className="hero-ctas">
              <Link to="/shop" className="btn btn-gold btn-lg">
                Shop the collection <ArrowRight width={18} height={18} />
              </Link>
              <a href={askLink()} className="btn btn-outline btn-lg" target="_blank" rel="noreferrer">
                <WhatsAppIcon /> Order on WhatsApp
              </a>
            </div>
            <dl className="hero-stats">
              <div><dt>{products.length || '180'}+</dt><dd>Products</dd></div>
              <div><dt>{Object.keys(countByCat).length || 17}</dt><dd>Categories</dd></div>
              <div><dt>1 tap</dt><dd>To order</dd></div>
            </dl>
          </div>
          <div className="hero-visual reveal delay-1" aria-hidden>
            <div className="orbit orbit-1" />
            <div className="orbit orbit-2" />
            <img className="hero-logo" src="/brand/logo-circle.webp" alt="" width="640" height="646" fetchpriority="high" />
            <img className="hero-float hero-float-a" src={imageUrl('https://images.unsplash.com/photo-1608528577891-eb055944f2e7', 240, 300)} alt="" />
            <img className="hero-float hero-float-b" src={imageUrl('https://images.unsplash.com/photo-1781346325200-61cef7b29d76', 240, 300)} alt="" />
          </div>
        </div>
      </section>

      {/* PROMISES */}
      <section className="promises">
        <div className="container promises-inner">
          <div className="promise"><ShieldIcon /><span><strong>Trusted brands</strong>Carefully selected products</span></div>
          <div className="promise"><SparkleIcon /><span><strong>New arrivals daily</strong>Fresh stock every week</span></div>
          <div className="promise"><ChatIcon /><span><strong>Order on WhatsApp</strong>Fast, friendly replies</span></div>
          <div className="promise"><TruckIcon /><span><strong>Delivered to you</strong>Fee confirmed before you pay</span></div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Explore" title="Shop by category" link="/shop" linkLabel="All products" />
          <div className="tiles">
            {FEATURED_TILES.map((t) => (
              <Link key={t.label} to={t.to} className="tile">
                <img src={imageUrl(t.img, 480, 600)} alt="" loading="lazy" width="480" height="600" />
                <span className="tile-shade" />
                <span className="tile-text">
                  <span className="tile-name">{t.label}</span>
                  <span className="tile-count">{t.cat ? countByCat[t.cat] || 0 : groupCount(t.group)} products</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="section section-tint">
        <div className="container">
          <SectionHead eyebrow="Just in" title="New arrivals" link="/shop?sort=new" />
          <div className="grid">
            {loading
              ? Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)
              : fresh.map((p, i) => <ProductCard key={p.slug} product={p} eager={i < 4} />)}
          </div>
        </div>
      </section>

      {/* FRAGRANCE HOUSE */}
      <section className="fragrance always-dark">
        <div className="container fragrance-inner">
          <div className="fragrance-copy">
            <p className="eyebrow">The fragrance house</p>
            <h2 className="h2 big">Scents that <em>linger</em></h2>
            <p className="lead">
              Rich ouds, sweet gourmands and fresh florals from the most loved Arabian perfume houses.
              {countByCat.perfumes ? ` ${countByCat.perfumes} perfumes to choose from.` : ''}
            </p>
            <div className="chips">
              {PERFUME_HOUSES.map((b) => (
                <Link key={b} className="chip chip-gold" to={`/category/perfumes?brand=${encodeURIComponent(b)}`}>{b}</Link>
              ))}
            </div>
            <Link to="/category/perfumes" className="btn btn-gold">
              Explore perfumes <ArrowRight width={18} height={18} />
            </Link>
          </div>
          <div className="rail" role="list">
            {perfumes.map((p) => (
              <div className="rail-item" role="listitem" key={p.slug}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONCERNS */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Find your routine" title="Shop by concern & ingredient" />
          <div className="concerns">
            {CONCERNS.map((c) => (
              <Link key={c.q} to={`/shop?q=${encodeURIComponent(c.q)}`} className="concern">
                <span>{c.label}</span>
                <ArrowRight width={16} height={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PICKS */}
      {value.length > 0 && (
        <section className="section section-tint">
          <div className="container">
            <SectionHead eyebrow="Beauty on a budget" title="Under TZS 15,000" link="/shop?price=u15" />
            <div className="grid">
              {value.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* HOW TO ORDER */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Simple & quick" title="How to order" />
          <ol className="steps">
            <li>
              <span className="step-no">01</span>
              <h3>Browse</h3>
              <p>Find what you love by category, brand or search. Add several items to your cart if you like.</p>
            </li>
            <li>
              <span className="step-no">02</span>
              <h3>Tap “Order on WhatsApp”</h3>
              <p>A message with the product name and price opens in WhatsApp, ready to send to us.</p>
            </li>
            <li>
              <span className="step-no">03</span>
              <h3>We confirm & deliver</h3>
              <p>We confirm availability, delivery fee and payment, then send your order to you.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container cta-inner">
          <img src="/brand/monogram.png" alt="" width="72" height="72" className="cta-mark" />
          <h2 className="h2 big">Need help choosing?</h2>
          <p className="lead">Tell us your skin type or the scent you love and we’ll recommend the right products.</p>
          <a className="btn btn-gold btn-lg" href={askLink('choosing a product')} target="_blank" rel="noreferrer">
            <WhatsAppIcon /> Ask us on WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}
