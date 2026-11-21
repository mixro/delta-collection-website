import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import BagDrawer from './components/BagDrawer'
import WhatsAppFab from './components/WhatsAppFab'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

const Admin = lazy(() => import('./pages/admin/Admin'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<div className="container pad-xl"><div className="spinner" /></div>}>
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </Suspense>
    )
  }
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:group" element={<Shop />} />
          <Route path="/category/:slug" element={<Shop />} />
          <Route path="/search" element={<SearchRedirect />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BagDrawer />
      <WhatsAppFab />
    </>
  )
}

function SearchRedirect() {
  const { search } = useLocation()
  return <Navigate to={`/shop${search}`} replace />
}
