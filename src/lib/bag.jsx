import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// Cart: products a customer collects to send in one WhatsApp message.
const BagContext = createContext(null)
const KEY = 'dc-list-v1'

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function BagProvider({ children }) {
  const [items, setItems] = useState(read) // [{ product, qty }]
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* private mode */
    }
  }, [items])

  const value = useMemo(
    () => ({
      items,
      open,
      setOpen,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.product.price * i.qty, 0),
      add(product, qty = 1) {
        setItems((cur) => {
          const found = cur.find((i) => i.product.slug === product.slug)
          if (found) return cur.map((i) => (i === found ? { ...i, qty: i.qty + qty } : i))
          return [...cur, { product, qty }]
        })
      },
      setQty(slug, qty) {
        setItems((cur) =>
          qty <= 0 ? cur.filter((i) => i.product.slug !== slug) : cur.map((i) => (i.product.slug === slug ? { ...i, qty } : i)),
        )
      },
      clear: () => setItems([]),
      has: (slug) => items.some((i) => i.product.slug === slug),
    }),
    [items, open],
  )
  return <BagContext.Provider value={value}>{children}</BagContext.Provider>
}

export const useBag = () => useContext(BagContext)
