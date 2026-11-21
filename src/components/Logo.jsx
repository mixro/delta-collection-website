import { Link } from 'react-router-dom'

export default function Logo({ onClick }) {
  return (
    <Link to="/" className="logo" onClick={onClick} aria-label="Delta Collection home">
      <img src="/brand/monogram.png" alt="" width="40" height="40" className="logo-mark" />
      <span className="logo-text">
        <span className="logo-name">Delta</span>
        <span className="logo-sub">Collection</span>
      </span>
    </Link>
  )
}
