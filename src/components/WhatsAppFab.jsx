import { askLink } from '../lib/whatsapp'
import { WhatsAppIcon } from './Icons'

export default function WhatsAppFab() {
  return (
    <a className="wa-fab" href={askLink()} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp">
      <WhatsAppIcon width={26} height={26} />
    </a>
  )
}
