import { useEffect } from 'react'

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Delta Collection` : 'Delta Collection | Skincare, Body Care & Perfumes in Tanzania'
  }, [title])
}
