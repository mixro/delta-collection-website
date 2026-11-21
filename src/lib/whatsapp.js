import { BUSINESS } from '../config'
import { formatPrice } from './format'

const site = () => (typeof window !== 'undefined' ? window.location.origin : '')

export function waLink(text) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`
}

export function productOrderLink(p, qty = 1) {
  const lines = [
    `Hello ${BUSINESS.name}, I would like to order:`,
    `• ${p.name}${qty > 1 ? ` × ${qty}` : ''} (${formatPrice(p.price * qty)})`,
    `${site()}/product/${p.slug}`,
  ]
  return waLink(lines.join('\n'))
}

export function listOrderLink(items) {
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)
  const lines = [
    `Hello ${BUSINESS.name}, I would like to order:`,
    ...items.map((i) => `• ${i.product.name} × ${i.qty} (${formatPrice(i.product.price * i.qty)})`),
    `Total: ${formatPrice(total)}`,
  ]
  return waLink(lines.join('\n'))
}

export const askLink = (topic) =>
  waLink(topic ? `Hello ${BUSINESS.name}, I have a question about ${topic}.` : `Hello ${BUSINESS.name}!`)
