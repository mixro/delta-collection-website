import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fromRow, IMAGE_BUCKET, isSupabaseReady, supabase, toRow } from '../../lib/supabase'
import { formatPrice, imageUrl, slugify } from '../../lib/format'
import { GROUPS } from '../../config'
import { CloseIcon, PlusIcon, SearchIcon } from '../../components/Icons'
import ThemeToggle from '../../components/ThemeToggle'
import '../../admin.css'

export default function Admin() {
  useEffect(() => {
    document.title = 'Admin | Delta Collection'
  }, [])
  if (!isSupabaseReady) return <SetupNotice />
  return <AdminGate />
}

function Shell({ children, onSignOut, email }) {
  return (
    <div className="admin">
      <header className="admin-top">
        <Link to="/" className="admin-brand">
          <img src="/brand/monogram.png" alt="" width="32" height="32" />
          <span>Delta Collection <em>Admin</em></span>
        </Link>
        <div className="admin-user">
          <ThemeToggle />
        {onSignOut && (
          <>
            <span className="muted small hide-sm">{email}</span>
            <button className="btn btn-ghost btn-sm" onClick={onSignOut}>Sign out</button>
          </>
        )}
        </div>
      </header>
      <div className="admin-body">{children}</div>
    </div>
  )
}

function SetupNotice() {
  return (
    <Shell>
      <div className="admin-card narrow-card">
        <h1 className="h3">Connect the admin panel</h1>
        <p>
          The admin panel needs a free Supabase project to store products and photos. The public website already
          works without it, using the product list built into the site.
        </p>
        <ol className="plain-list">
          <li>Create a free project at supabase.com.</li>
          <li>In the SQL editor, run <code>supabase/schema.sql</code>, then <code>supabase/seed.sql</code> from the repository.</li>
          <li>Add your email to the admins table (instructions are at the end of schema.sql) and create your user under Authentication.</li>
          <li>Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your hosting settings and redeploy.</li>
        </ol>
        <p className="muted small">Full steps are in the README file.</p>
        <Link to="/" className="btn btn-outline btn-sm">Back to the website</Link>
      </div>
    </Shell>
  )
}

function AdminGate() {
  const [session, setSession] = useState(undefined)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])
  if (session === undefined) return <Shell><div className="spinner" /></Shell>
  if (!session) return <Login />
  return <Dashboard email={session.user.email} />
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setBusy(false)
  }
  return (
    <Shell>
      <form className="admin-card narrow-card" onSubmit={submit}>
        <h1 className="h3">Sign in</h1>
        <p className="muted small">Manage your products, prices and stock.</p>
        <label className="field">
          <span>Email</span>
          <input className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="field">
          <span>Password</span>
          <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-gold btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </Shell>
  )
}

function useToast() {
  const [msg, setMsg] = useState('')
  const show = useCallback((m) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 2600)
  }, [])
  const node = msg ? <div className="toast" role="status">{msg}</div> : null
  return [show, node]
}

function Dashboard({ email }) {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, toastNode] = useToast()

  const load = useCallback(async () => {
    const [c, p] = await Promise.all([
      supabase.from('categories').select('*').order('sort'),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
    ])
    if (c.error || p.error) toast((c.error || p.error).message)
    setCategories(c.data || [])
    setProducts((p.data || []).map(fromRow))
    setLoading(false)
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  return (
    <Shell email={email} onSignOut={() => supabase.auth.signOut()}>
      <div className="admin-tabs">
        <button className={tab === 'products' ? 'is-active' : ''} onClick={() => setTab('products')}>Products <span>{products.length}</span></button>
        <button className={tab === 'categories' ? 'is-active' : ''} onClick={() => setTab('categories')}>Categories <span>{categories.length}</span></button>
      </div>
      {loading ? (
        <div className="spinner" />
      ) : tab === 'products' ? (
        <Products products={products} categories={categories} reload={load} toast={toast} />
      ) : (
        <Categories products={products} categories={categories} reload={load} toast={toast} />
      )}
      {toastNode}
    </Shell>
  )
}

const EMPTY = { name: '', brand: '', category: '', price: '', compareAtPrice: '', size: '', description: '', image: '', inStock: true, isNew: true }

function Products({ products, categories, reload, toast }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [editing, setEditing] = useState(null)
  const catName = Object.fromEntries(categories.map((c) => [c.slug, c.name]))

  const list = useMemo(() => {
    const t = q.toLowerCase()
    return products.filter((p) => (!cat || p.category === cat) && (!t || `${p.name} ${p.brand}`.toLowerCase().includes(t)))
  }, [products, q, cat])

  const patch = async (p, fields, msg) => {
    const { error } = await supabase.from('products').update(fields).eq('id', p.id)
    if (error) return toast(error.message)
    toast(msg)
    reload()
  }

  const remove = async (p) => {
    if (!window.confirm(`Delete “${p.name}”? This cannot be undone.`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) return toast(error.message)
    toast('Product deleted')
    reload()
  }

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-search">
          <SearchIcon width={16} height={16} />
          <input className="input" placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="select" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <button className="btn btn-gold" onClick={() => setEditing({ ...EMPTY, category: cat || categories[0]?.slug || '' })}>
          <PlusIcon width={18} height={18} /> Add product
        </button>
      </div>
      <p className="muted small">{list.length} products</p>
      <ul className="admin-list">
        {list.map((p) => (
          <li key={p.id} className={`admin-row ${p.inStock ? '' : 'is-out'}`}>
            <img src={imageUrl(p.image, 112, 112)} alt="" width="56" height="56" loading="lazy" />
            <div className="admin-row-main">
              <button className="admin-row-name" onClick={() => setEditing(p)}>{p.name}</button>
              <span className="muted small">{catName[p.category] || p.category} · {formatPrice(p.price)}</span>
            </div>
            <div className="admin-row-actions">
              <label className="switch small" title="In stock">
                <input type="checkbox" checked={p.inStock} onChange={(e) => patch(p, { in_stock: e.target.checked }, e.target.checked ? 'Marked available' : 'Marked out of stock')} />
                <span className="switch-track" />
                <span className="hide-sm">{p.inStock ? 'Available' : 'Out of stock'}</span>
              </label>
              <button className={`tag-btn ${p.isNew ? 'is-on' : ''}`} onClick={() => patch(p, { is_new: !p.isNew }, p.isNew ? 'Removed New tag' : 'Marked as New')}>New</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(p)}>Edit</button>
              <button className="btn btn-ghost btn-sm danger" onClick={() => remove(p)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {editing && (
        <ProductForm
          initial={editing}
          categories={categories}
          existing={products}
          onClose={() => setEditing(null)}
          onSaved={(msg) => {
            setEditing(null)
            toast(msg)
            reload()
          }}
        />
      )}
    </>
  )
}

// Shrink phone photos before upload so the site stays fast.
async function compressImage(file, max = 1200) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82))
}

function ProductForm({ initial, categories, existing, onClose, onSaved }) {
  const [p, setP] = useState({ ...initial, price: initial.price ?? '', compareAtPrice: initial.compareAtPrice ?? '' })
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const isNew = !initial.id
  const set = (k) => (e) => setP((cur) => ({ ...cur, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const upload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const blob = await compressImage(file)
      const path = `${Date.now()}-${slugify(p.name || 'product')}.webp`
      const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, blob, { contentType: 'image/webp', cacheControl: '31536000' })
      if (error) throw error
      const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
      setP((cur) => ({ ...cur, image: data.publicUrl }))
    } catch (err) {
      setError(`Photo upload failed: ${err.message}`)
    }
    setUploading(false)
  }

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    let slug = initial.slug
    if (isNew) {
      const base = slugify(p.name)
      slug = base
      let n = 2
      while (existing.some((x) => x.slug === slug)) slug = `${base}-${n++}`
    }
    const row = toRow({ ...p, slug, tags: initial.tags || [] })
    const res = isNew ? await supabase.from('products').insert(row) : await supabase.from('products').update(row).eq('id', initial.id)
    setBusy(false)
    if (res.error) return setError(res.error.message)
    onSaved(isNew ? 'Product added' : 'Product saved')
  }

  const grouped = GROUPS.map((g) => ({ ...g, cats: categories.filter((c) => c.group === g.slug) })).filter((g) => g.cats.length)

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />
      <form className="modal-panel" onSubmit={save}>
        <div className="modal-head">
          <h2 className="h3">{isNew ? 'Add product' : 'Edit product'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        <div className="modal-body">
          <div className="photo-field">
            <div className="photo-preview">
              {p.image ? <img src={imageUrl(p.image, 320, 400)} alt="" /> : <span className="muted small">No photo yet</span>}
            </div>
            <div>
              <label className="btn btn-outline btn-sm file-btn">
                {uploading ? 'Uploading…' : p.image ? 'Change photo' : 'Take or choose photo'}
                <input type="file" accept="image/*" onChange={upload} hidden />
              </label>
              <p className="muted small">Tip: a clear photo on a plain, light background looks best.</p>
            </div>
          </div>
          <label className="field">
            <span>Product name *</span>
            <input className="input" value={p.name} onChange={set('name')} required placeholder="e.g. Rayhaan Azul Perfume" />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Brand</span>
              <input className="input" value={p.brand} onChange={set('brand')} placeholder="e.g. Rayhaan" />
            </label>
            <label className="field">
              <span>Category *</span>
              <select className="select" value={p.category} onChange={set('category')} required>
                {grouped.map((g) => (
                  <optgroup key={g.slug} label={g.name}>
                    {g.cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>
          <div className="field-row">
            <label className="field">
              <span>Price (TZS) *</span>
              <input className="input" type="number" inputMode="numeric" min="0" step="500" value={p.price} onChange={set('price')} required />
            </label>
            <label className="field">
              <span>Old price (for Sale)</span>
              <input className="input" type="number" inputMode="numeric" min="0" step="500" value={p.compareAtPrice} onChange={set('compareAtPrice')} placeholder="Leave empty if not on sale" />
            </label>
          </div>
          <label className="field">
            <span>Size</span>
            <input className="input" value={p.size} onChange={set('size')} placeholder="e.g. 30 ml, 100 ml, 400 g" />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea className="input" rows="4" value={p.description} onChange={set('description')} placeholder="What it does, who it is for, how to use it" />
          </label>
          <div className="field-row checks">
            <label className="switch">
              <input type="checkbox" checked={p.inStock} onChange={set('inStock')} />
              <span className="switch-track" />
              <span>Available</span>
            </label>
            <label className="switch">
              <input type="checkbox" checked={p.isNew} onChange={set('isNew')} />
              <span className="switch-track" />
              <span>Show “New” tag</span>
            </label>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold" disabled={busy || uploading}>{busy ? 'Saving…' : isNew ? 'Add product' : 'Save changes'}</button>
        </div>
      </form>
    </div>
  )
}

function Categories({ products, categories, reload, toast }) {
  const [name, setName] = useState('')
  const [group, setGroup] = useState(GROUPS[0].slug)
  const counts = products.reduce((m, p) => ((m[p.category] = (m[p.category] || 0) + 1), m), {})

  const add = async (e) => {
    e.preventDefault()
    const slug = slugify(name)
    if (!slug) return
    if (categories.some((c) => c.slug === slug)) return toast('That category already exists')
    const sort = Math.max(0, ...categories.map((c) => c.sort || 0)) + 1
    const { error } = await supabase.from('categories').insert({ slug, name: name.trim(), group, sort })
    if (error) return toast(error.message)
    setName('')
    toast('Category added')
    reload()
  }

  const rename = async (c) => {
    const next = window.prompt('New name for this category', c.name)
    if (!next || next.trim() === c.name) return
    const { error } = await supabase.from('categories').update({ name: next.trim() }).eq('slug', c.slug)
    if (error) return toast(error.message)
    toast('Category renamed')
    reload()
  }

  const move = async (c, dir) => {
    const sorted = [...categories]
    const i = sorted.findIndex((x) => x.slug === c.slug)
    const j = i + dir
    if (j < 0 || j >= sorted.length) return
    const a = sorted[i]
    const b = sorted[j]
    await supabase.from('categories').update({ sort: b.sort }).eq('slug', a.slug)
    await supabase.from('categories').update({ sort: a.sort }).eq('slug', b.slug)
    reload()
  }

  const changeGroup = async (c, g) => {
    const { error } = await supabase.from('categories').update({ group: g }).eq('slug', c.slug)
    if (error) return toast(error.message)
    toast('Category moved')
    reload()
  }

  const remove = async (c) => {
    if (counts[c.slug]) return toast('Move or delete the products in this category first')
    if (!window.confirm(`Delete the category “${c.name}”?`)) return
    const { error } = await supabase.from('categories').delete().eq('slug', c.slug)
    if (error) return toast(error.message)
    toast('Category deleted')
    reload()
  }

  return (
    <>
      <form className="admin-toolbar" onSubmit={add}>
        <input className="input" placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} required />
        <select className="select" value={group} onChange={(e) => setGroup(e.target.value)}>
          {GROUPS.map((g) => <option key={g.slug} value={g.slug}>{g.name}</option>)}
        </select>
        <button className="btn btn-gold"><PlusIcon width={18} height={18} /> Add category</button>
      </form>
      <ul className="admin-list">
        {categories.map((c, i) => (
          <li key={c.slug} className="admin-row">
            <div className="admin-row-main">
              <span className="admin-row-name static">{c.name}</span>
              <span className="muted small">{counts[c.slug] || 0} products</span>
            </div>
            <div className="admin-row-actions">
              <select className="select select-sm" value={c.group} onChange={(e) => changeGroup(c, e.target.value)}>
                {GROUPS.map((g) => <option key={g.slug} value={g.slug}>{g.name}</option>)}
              </select>
              <button className="btn btn-ghost btn-sm" onClick={() => move(c, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button className="btn btn-ghost btn-sm" onClick={() => move(c, 1)} disabled={i === categories.length - 1} aria-label="Move down">↓</button>
              <button className="btn btn-ghost btn-sm" onClick={() => rename(c)}>Rename</button>
              <button className="btn btn-ghost btn-sm danger" onClick={() => remove(c)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
