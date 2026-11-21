import { Link } from 'react-router-dom'
import { useTitle } from '../lib/useTitle'

export default function NotFound() {
  useTitle('Page not found')
  return (
    <div className="container pad-xl center notfound">
      <p className="eyebrow">404</p>
      <h1 className="h1">We couldn’t find that page</h1>
      <p className="lead muted">The product may have been removed or the link is incorrect.</p>
      <div className="row-gap center-row">
        <Link to="/shop" className="btn btn-gold">Browse products</Link>
        <Link to="/" className="btn btn-outline">Go home</Link>
      </div>
    </div>
  )
}
