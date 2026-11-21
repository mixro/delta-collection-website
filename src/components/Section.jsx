import { Link } from 'react-router-dom'
import { ArrowRight } from './Icons'

export function SectionHead({ eyebrow, title, link, linkLabel = 'View all', children }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="h2">{title}</h2>
        {children}
      </div>
      {link && (
        <Link to={link} className="link-arrow">
          {linkLabel} <ArrowRight width={16} height={16} />
        </Link>
      )}
    </div>
  )
}
