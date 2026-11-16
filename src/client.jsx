import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Search, Heart, ChevronLeft } from 'lucide-react'
import { api, useData, act, notify, fmt } from './lib'
import { useAuth } from './auth'
import { Title, Stars, Empty, avg } from './ui'

function Card({ s, users, reviews }) {
  const r = reviews.filter((x) => x.service === s.id)
  return (
    <Link to={`/client/service/${s.id}`} className="card flex items-center gap-4 transition hover:shadow-md">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-3xl">{s.icon}</div>
      <div className="flex-1"><p className="font-bold">{s.name}</p><p className="text-xs text-slate-500">{users.find((u) => u.id === s.provider)?.name}</p>
        <div className="flex items-center gap-1 text-xs text-slate-500"><Stars v={avg(r)} />{r.length ? avg(r).toFixed(1) : 'New'}</div></div>
      <p className="font-extrabold text-brand-600">{fmt(s.price)}</p>
    </Link>
  )
}

export function ClientHome() {
  const { user } = useAuth()
  const [services] = useData('/services'), [cats] = useData('/categories'), [users] = useData('/users'), [reviews] = useData('/reviews')
  const [q, setQ] = useState(''), [cat, setCat] = useState('All')
  const list = services.filter((s) => (cat === 'All' || s.cat === cat) && s.name.toLowerCase().includes(q.toLowerCase()))
  return (<>
    <div className="mb-5 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white">
      <p className="text-sm opacity-80">Hello, {user.name.split(' ')[0]} 👋</p><h1 className="mb-4 text-2xl font-extrabold">What do you need today?</h1>
      <div className="relative"><Search className="absolute left-4 top-3.5 text-slate-400" size={18} /><input className="input !pl-11 !border-0" placeholder="Search services" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
    <div className="mb-5 grid grid-cols-4 gap-3">{[{ name: 'All', icon: '✨' }, ...cats].slice(0, 8).map((c) => (
      <button key={c.name} onClick={() => setCat(c.name)} className={`flex flex-col items-center gap-1 rounded-2xl p-3 text-xs font-semibold ${cat === c.name ? 'bg-brand-500 text-white' : 'bg-white text-slate-600 shadow-sm'}`}><span className="text-2xl">{c.icon}</span>{c.name}</button>))}</div>
    <div className="mb-5 flex items-center justify-between rounded-2xl bg-brand-50 p-4"><div><p className="font-extrabold text-brand-700">20% off your first booking</p><p className="text-xs text-brand-600">Applied automatically at checkout</p></div><span className="text-3xl">🎁</span></div>
    <h2 className="mb-3 font-bold">{cat === 'All' ? 'Popular services' : cat}</h2>
    <div className="grid gap-3 sm:grid-cols-2">{list.map((s) => <Card key={s.id} s={s} users={users} reviews={reviews} />)}</div>
    {!list.length && <Empty>No services found.</Empty>}
  </>)
}

export function ServiceDetail() {
  const { id } = useParams(), { user } = useAuth(), nav = useNavigate()
  const [services] = useData('/services'), [users] = useData('/users'), [reviews] = useData('/reviews'), [favs, load] = useData('/favorites')
  const s = services.find((x) => x.id == id)
  if (!s) return null
  const p = users.find((u) => u.id === s.provider), rs = reviews.filter((r) => r.service === s.id), fav = favs.find((f) => f.user === user.id && f.service === s.id)
  return (<>
    <div className="mb-4 flex items-center justify-between"><button className="btn btn-ghost !p-2" onClick={() => nav(-1)}><ChevronLeft size={20} /></button>
      <button className="btn btn-ghost !p-2" onClick={() => act(() => (fav ? api.delete(`/favorites/${fav.id}`) : api.post('/favorites', { user: user.id, service: s.id })), fav ? 'Removed from favorites' : 'Saved to favorites', load)}><Heart size={20} className={fav ? 'fill-rose-500 text-rose-500' : ''} /></button></div>
    <div className="card mb-4 text-center"><div className="mx-auto mb-3 grid h-24 w-24 place-items-center rounded-3xl bg-brand-50 text-6xl">{s.icon}</div>
      <h1 className="text-2xl font-extrabold">{s.name}</h1><p className="text-sm text-slate-500">{s.cat}</p><div className="mt-2 flex items-center justify-center gap-2"><Stars v={avg(rs)} /><span className="text-sm text-slate-500">{rs.length} reviews</span></div></div>
    <div className="card mb-4"><h2 className="mb-1 font-bold">About</h2><p className="text-sm text-slate-600">{s.desc}</p></div>
    <div className="card mb-4 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-full bg-brand-500 font-bold text-white">{p?.name[0]}</div>
      <div className="flex-1"><p className="font-bold">{p?.name}</p><p className="text-xs text-slate-500">{p?.address || 'Service provider'}</p></div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p?.online ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{p?.online ? 'Available' : 'Offline'}</span></div>
    <h2 className="mb-2 font-bold">Reviews</h2><div className="mb-24 space-y-2 md:mb-4">{rs.map((r) => <div key={r.id} className="card"><div className="flex justify-between"><p className="text-sm font-semibold">{r.name}</p><Stars v={r.rating} /></div><p className="text-sm text-slate-600">{r.text}</p></div>)}{!rs.length && <Empty>No reviews yet.</Empty>}</div>
    <div className="fixed inset-x-0 bottom-[60px] z-10 border-t border-slate-100 bg-white p-3 md:static md:border-0 md:p-0"><div className="mx-auto flex max-w-3xl items-center justify-between gap-4"><div><p className="text-xs text-slate-400">Starting at</p><p className="text-xl font-extrabold text-brand-600">{fmt(s.price)}</p></div>
      <Link to={`/client/book/${s.id}`} className="btn btn-primary flex-1 md:flex-none md:px-10">Book now</Link></div></div>
  </>)
}

const SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00']
export function BookFlow() {
  const { id } = useParams(), { user } = useAuth(), nav = useNavigate()
  const [services] = useData('/services')
  const s = services.find((x) => x.id == id)
  const [f, setF] = useState({ date: new Date(Date.now() + 864e5).toISOString().slice(0, 10), time: '10:00', address: user.address || '', note: '', payment: 'Card' })
  if (!s) return null
  const discount = Math.round(s.price * 0.2), submit = (e) => {
    e.preventDefault()
    act(async () => {
      await api.post('/bookings', { ...f, service: s.name, serviceId: s.id, client: user.id, provider: s.provider, price: s.price, status: 'pending' })
      notify(s.provider, `New booking request: ${s.name} on ${f.date} at ${f.time}`)
      nav('/client/bookings')
    }, 'Booking request sent')
  }
  return (<>
    <Title sub={s.name}>Confirm booking</Title>
    <form onSubmit={submit} className="space-y-4">
      <div className="card space-y-3"><label className="text-sm font-semibold">Date</label><input type="date" className="input" min={new Date().toISOString().slice(0, 10)} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} required />
        <label className="text-sm font-semibold">Time</label><div className="grid grid-cols-3 gap-2">{SLOTS.map((t) => <button type="button" key={t} onClick={() => setF({ ...f, time: t })} className={`btn ${f.time === t ? 'btn-primary' : 'btn-ghost'}`}>{t}</button>)}</div></div>
      <div className="card space-y-3"><input className="input" placeholder="Service address" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} required /><textarea className="input" rows={2} placeholder="Notes for the provider (optional)" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></div>
      <div className="card"><p className="mb-2 text-sm font-semibold">Payment method</p><div className="grid grid-cols-3 gap-2">{['Card', 'Cash', 'Wallet'].map((p) => <button type="button" key={p} onClick={() => setF({ ...f, payment: p })} className={`btn ${f.payment === p ? 'btn-primary' : 'btn-ghost'}`}>{p}</button>)}</div></div>
      <div className="card space-y-1 text-sm"><div className="flex justify-between"><span>Service</span><span>{fmt(s.price)}</span></div><div className="flex justify-between text-emerald-600"><span>First booking promo (20%)</span><span>-{fmt(discount)}</span></div>
        <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-extrabold"><span>Total</span><span className="text-brand-600">{fmt(s.price - discount)}</span></div></div>
      <button className="btn btn-primary w-full">Confirm booking</button>
    </form>
  </>)
}

export function Favorites() {
  const { user } = useAuth()
  const [favs] = useData('/favorites'), [services] = useData('/services'), [users] = useData('/users'), [reviews] = useData('/reviews')
  const list = favs.filter((f) => f.user === user.id).map((f) => services.find((s) => s.id === f.service)).filter(Boolean)
  return (<><Title sub="Your saved services">Favorites</Title><div className="grid gap-3 sm:grid-cols-2">{list.map((s) => <Card key={s.id} s={s} users={users} reviews={reviews} />)}</div>{!list.length && <Empty>Tap the heart on a service to save it.</Empty>}</>)
}
