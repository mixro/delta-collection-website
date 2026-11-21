import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useBag } from '../lib/bag'
import { useCatalog } from '../lib/catalog'
import { BUSINESS } from '../config'
import Logo from './Logo'
import SearchOverlay from './SearchOverlay'
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, WhatsAppIcon } from './Icons'
import { askLink } from '../lib/whatsapp'

export default function Header() {
  const bag = useBag()
  const { groups } = useCatalog()
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenu(false)
    setSearch(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menu)
  }, [menu])

  const mainGroups = groups.filter((g) => ['face-care', 'body-care', 'fragrance'].includes(g.slug))

  return (
    <>
      <div className="announce">
        <span>New arrivals every day</span>
        <span className="dot hide-sm" aria-hidden>◆</span>
        <span className="hide-sm">Order in one tap on WhatsApp</span>
      </div>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <button className="icon-btn only-mobile" onClick={() => setMenu(true)} aria-label="Open menu">
            <MenuIcon />
          </button>
          <Logo />
          <nav className="nav only-desktop" aria-label="Main">
            <NavLink to="/shop" end>Shop all</NavLink>
            {mainGroups.map((g) => (
              <NavLink key={g.slug} to={`/shop/${g.slug}`}>{g.name}</NavLink>
            ))}
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          <div className="header-actions">
            <button className="search-trigger only-desktop" onClick={() => setSearch(true)}>
              <SearchIcon width={17} height={17} />
              <span>Search products</span>
              <kbd>/</kbd>
            </button>
            <button className="icon-btn only-mobile" onClick={() => setSearch(true)} aria-label="Search">
              <SearchIcon />
            </button>
            <button className="icon-btn bag-btn" onClick={() => bag.setOpen(true)} aria-label={`My list, ${bag.count} items`}>
              <BagIcon />
              {bag.count > 0 && <span className="bag-count">{bag.count}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer-backdrop ${menu ? 'is-open' : ''}`} onClick={() => setMenu(false)} />
      <aside className={`menu-drawer ${menu ? 'is-open' : ''}`} aria-hidden={!menu} aria-label="Menu">
        <div className="drawer-head">
          <Logo onClick={() => setMenu(false)} />
          <button className="icon-btn" onClick={() => setMenu(false)} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>
        <nav className="menu-links">
          <Link to="/shop">Shop all</Link>
          {groups.map((g) => (
            <details key={g.slug}>
              <summary>
                {g.name} <span className="muted">{g.count}</span>
              </summary>
              <div className="menu-sub">
                <Link to={`/shop/${g.slug}`}>All {g.name.toLowerCase()}</Link>
                {g.categories.map((c) => (
                  <Link key={c.slug} to={`/category/${c.slug}`}>{c.name}</Link>
                ))}
              </div>
            </details>
          ))}
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <a className="btn btn-gold btn-block" href={askLink()} target="_blank" rel="noreferrer">
          <WhatsAppIcon /> Chat with us
        </a>
        <p className="menu-foot muted">{BUSINESS.phoneDisplay}</p>
      </aside>

      <SearchOverlay open={search} onClose={() => setSearch(false)} onOpen={() => setSearch(true)} />
    </>
  )
}
