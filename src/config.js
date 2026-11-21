// Business details shown across the site. Edit these in one place.
// Values marked "TODO" are placeholders until Delta Collection confirms them.
export const BUSINESS = {
  name: 'Delta Collection',
  tagline: 'Skincare · Body care · Perfumes',
  // International format without "+" or spaces, used for WhatsApp links.
  whatsapp: '255692722441',
  phoneDisplay: '+255 692 722 441',
  instagram: '', // TODO: add Instagram handle without @, e.g. 'deltacollection'
  email: '', // TODO: add an email address if you have one
  location: 'Tanzania', // TODO: add your area, e.g. 'Kariakoo, Dar es Salaam'
  hours: '', // TODO: e.g. 'Monday to Saturday, 9:00 AM to 8:00 PM'
  delivery: 'We deliver to you. Message us on WhatsApp with your location and we will confirm the delivery fee and time before you pay.', // TODO: add areas and fees
  payment: 'Mobile money and other payment options are confirmed with you on WhatsApp when you order.', // TODO: list exact methods
  returns: 'If an item arrives damaged or is not what you ordered, message us on WhatsApp as soon as you receive it and we will make it right.', // TODO: confirm policy
  currency: 'TZS',
}

export const GROUPS = [
  { slug: 'face-care', name: 'Face Care', blurb: 'Serums, moisturizers, sunscreen and treatments for clear, glowing skin.' },
  { slug: 'body-care', name: 'Body Care', blurb: 'Lotions, oils, scrubs and shower gels for soft, even, radiant skin.' },
  { slug: 'fragrance', name: 'Fragrance', blurb: 'Arabian and designer-inspired perfumes and body mists.' },
  { slug: 'personal-care', name: 'Personal Care', blurb: 'Deodorants, hair care, hair removal and lip gloss.' },
  { slug: 'wellness', name: 'Wellness', blurb: 'Beauty drinks to support your glow from within.' },
]

// Quick "shop by concern" links on the home page; each runs a search.
export const CONCERNS = [
  { label: 'Glow & brightening', q: 'glow' },
  { label: 'Dark spots', q: 'dark spot' },
  { label: 'Vitamin C', q: 'vitamin c' },
  { label: 'Niacinamide', q: 'niacinamide' },
  { label: 'Kojic acid', q: 'kojic' },
  { label: 'Sun protection', q: 'sunscreen' },
  { label: 'Hydration', q: 'hydrat' },
  { label: 'Calming CICA', q: 'cica' },
]

export const PRICE_RANGES = [
  { id: 'u15', label: 'Under 15,000', min: 0, max: 14999 },
  { id: '15-30', label: '15,000 – 30,000', min: 15000, max: 30000 },
  { id: '30-50', label: '30,001 – 50,000', min: 30001, max: 50000 },
  { id: '50+', label: 'Above 50,000', min: 50001, max: Infinity },
]
