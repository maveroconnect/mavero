import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LogOut, Send, MessageCircle } from 'lucide-react'
import { api, useData, act, notify, fmt, db } from './lib'
import { useAuth } from './auth'
import { Badge, Title, Empty, Stars } from './ui'

export function Onboarding({ done }) {
  const [i, setI] = useState(0)
  const S = [['🔍', 'Find trusted pros', 'Browse verified providers for every home and personal service.'], ['📅', 'Book in seconds', 'Pick a date, time and payment method that suit you.'], ['⭐', 'Rate and rebook', 'Chat with providers, track bookings and leave reviews.']]
  const next = async () => { if (i < 2) return setI(i + 1); await db.setItem('onboarded', true); done() }
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white p-8 text-center">
      <button className="self-end text-sm font-semibold text-slate-400" onClick={() => { setI(2); next() }}>Skip</button>
      <div className="flex flex-1 flex-col items-center justify-center"><div className="mb-8 grid h-44 w-44 place-items-center rounded-full bg-brand-50 text-7xl">{S[i][0]}</div>
        <h1 className="text-2xl font-extrabold text-brand-700">{S[i][1]}</h1><p className="mt-2 text-slate-500">{S[i][2]}</p>
        <div className="mt-6 flex gap-2">{S.map((_, k) => <span key={k} className={`h-2 rounded-full transition-all ${k === i ? 'w-6 bg-brand-500' : 'w-2 bg-brand-200'}`} />)}</div></div>
      <button className="btn btn-primary w-full" onClick={next}>{i < 2 ? 'Next' : 'Get started'}</button>
    </div>
  )
}

function AuthFrame({ title, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-500 to-brand-700 md:grid md:place-items-center">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-end md:min-h-0 md:justify-center">
        <div className="px-8 pb-8 pt-14 text-white"><div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl font-extrabold text-brand-600">M</div>
          <h1 className="text-3xl font-extrabold">Mavero</h1><p className="mt-1 text-brand-100">Trusted services, booked in seconds.</p></div>
        <div className="space-y-3 rounded-t-3xl bg-white p-6 md:rounded-3xl"><h2 className="text-lg font-bold">{title}</h2>{children}</div>
      </div>
    </div>
  )
}

export function Login() {
  const { login } = useAuth()
  const [f, setF] = useState({ email: '', password: '' }), [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setBusy(true)
    try { const { data } = await api.post('/login', f); toast.success(`Welcome, ${data.name}`); login(data) } catch (err) { toast.error(err.message) }
    setBusy(false)
  }
  return (
    <AuthFrame title="Sign in">
      <form onSubmit={submit} className="space-y-3">
        <input className="input" type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
        <input className="input" type="password" placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="pt-1 text-center text-xs text-slate-400">Demo accounts (password: <b>password</b>)</p>
        <div className="grid grid-cols-3 gap-2">{[['Client', 'client'], ['Provider', 'provider'], ['Admin', 'admin']].map(([l, e]) => <button type="button" key={l} className="btn btn-ghost !px-2" onClick={() => setF({ email: `${e}@mavero.app`, password: 'password' })}>{l}</button>)}</div>
        <p className="text-center text-sm text-slate-500">New here? <Link to="/register" className="font-semibold text-brand-600">Create account</Link></p>
      </form>
    </AuthFrame>
  )
}

export function Register() {
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'client' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data: us } = await api.get('/users')
      if (us.some((u) => u.email === f.email)) throw new Error('Email already registered')
      await api.post('/users', { ...f, phone: '', address: '', online: true, status: f.role === 'provider' ? 'pending' : 'active' })
      toast.success(f.role === 'provider' ? 'Account created. Awaiting admin approval' : 'Account created. Please sign in'); nav('/login')
    } catch (err) { toast.error(err.message) }
  }
  return (
    <AuthFrame title="Create account">
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">{['client', 'provider'].map((r) => <button type="button" key={r} onClick={() => setF({ ...f, role: r })} className={`btn capitalize ${f.role === r ? 'btn-primary' : 'btn-ghost'}`}>{r === 'client' ? 'I need services' : 'I offer services'}</button>)}</div>
        <input className="input" placeholder="Full name" value={f.name} onChange={set('name')} required />
        <input className="input" type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
        <input className="input" type="password" placeholder="Password" minLength={6} value={f.password} onChange={set('password')} required />
        <button className="btn btn-primary w-full">Sign up</button>
        <p className="text-center text-sm text-slate-500">Have an account? <Link to="/login" className="font-semibold text-brand-600">Sign in</Link></p>
      </form>
    </AuthFrame>
  )
}

function ReviewBox({ b, done }) {
  const { user } = useAuth()
  const [r, setR] = useState(5), [t, setT] = useState('')
  const send = () => act(async () => {
    await api.post('/reviews', { service: b.serviceId, provider: b.provider, client: user.id, name: user.name, rating: r, text: t })
    await api.patch(`/bookings/${b.id}`, { reviewed: true }); notify(b.provider, `${user.name} rated ${b.service} ${r}★`)
  }, 'Thanks for your review', done)
  return <div className="mt-3 space-y-2 rounded-xl bg-brand-50 p-3"><Stars v={r} onPick={setR} /><input className="input" placeholder="Share your experience" value={t} onChange={(e) => setT(e.target.value)} /><button className="btn btn-primary w-full" onClick={send}>Submit review</button></div>
}

const TABS = { Upcoming: ['pending', 'accepted'], Completed: ['completed'], Cancelled: ['cancelled', 'declined'] }
export function Bookings({ scope }) {
  const { user } = useAuth()
  const [all, load] = useData('/bookings'), [users] = useData('/users')
  const [tab, setTab] = useState('Upcoming'), [rate, setRate] = useState(null)
  const name = (id) => users.find((u) => u.id === id)?.name || '—'
  const items = (scope === 'admin' ? all : all.filter((b) => b[scope] === user.id)).filter((b) => TABS[tab].includes(b.status))
  const set = (b, status, msg) => act(async () => { await api.patch(`/bookings/${b.id}`, { status }); notify(b.client, `Your ${b.service} booking was ${status}`) }, msg, load)
  return (<>
    <Title>{scope === 'provider' ? 'Jobs' : scope === 'admin' ? 'All bookings' : 'My bookings'}</Title>
    <div className="mb-4 grid grid-cols-3 rounded-xl bg-slate-100 p-1">{Object.keys(TABS).map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-lg py-2 text-sm font-semibold ${tab === t ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}>{t}</button>)}</div>
    <div className="space-y-3">{items.map((b) => (
      <div key={b.id} className="card"><div className="flex items-start justify-between"><div><p className="font-bold">{b.service}</p>
        <p className="text-xs text-slate-500">{scope === 'provider' ? `Client: ${name(b.client)}` : `Provider: ${name(b.provider)}`}</p>
        <p className="text-xs text-slate-500">{b.date} · {b.time} · {b.payment}</p><p className="text-xs text-slate-400">{b.address}</p></div><Badge s={b.status} /></div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><span className="font-extrabold text-brand-600">{fmt(b.price)}</span>
          <div className="flex flex-wrap gap-2">
            {scope !== 'admin' && ['pending', 'accepted'].includes(b.status) && <Link className="btn btn-ghost !py-1.5" to={`/${scope}/chat/${b.id}`}><MessageCircle size={15} />Chat</Link>}
            {scope === 'client' && b.status === 'pending' && <button className="btn btn-ghost !py-1.5" onClick={() => set(b, 'cancelled', 'Booking cancelled')}>Cancel</button>}
            {scope === 'client' && b.status === 'completed' && !b.reviewed && <button className="btn btn-primary !py-1.5" onClick={() => setRate(rate === b.id ? null : b.id)}>Rate</button>}
            {scope === 'provider' && b.status === 'pending' && <><button className="btn btn-ghost !py-1.5" onClick={() => set(b, 'declined', 'Declined')}>Decline</button><button className="btn btn-primary !py-1.5" onClick={() => set(b, 'accepted', 'Accepted')}>Accept</button></>}
            {scope === 'provider' && b.status === 'accepted' && <button className="btn btn-primary !py-1.5" onClick={() => set(b, 'completed', 'Marked complete')}>Mark complete</button>}
          </div></div>{rate === b.id && <ReviewBox b={b} done={() => { setRate(null); load() }} />}</div>))}
      {!items.length && <Empty>No {tab.toLowerCase()} bookings.</Empty>}</div>
  </>)
}

export function Chat() {
  const { id } = useParams(), { user } = useAuth()
  const [bks] = useData('/bookings'), [msgs, load] = useData('/messages', 3000), [txt, setTxt] = useState('')
  const b = bks.find((x) => x.id == id)
  const to = b && (user.id === b.client ? b.provider : b.client)
  const send = (e) => { e.preventDefault(); if (!txt.trim()) return; const t = txt; setTxt(''); act(async () => { await api.post('/messages', { booking: b.id, from: user.id, text: t, time: new Date().toISOString() }); notify(to, `New message about ${b.service}`) }, null, load) }
  return (<>
    <Title sub={b && `${b.service} · ${b.date}`}>Chat</Title>
    <div className="card flex h-[60vh] flex-col"><div className="flex-1 space-y-2 overflow-y-auto">
      {msgs.filter((m) => m.booking == id).reverse().map((m) => <div key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === user.id ? 'ml-auto bg-brand-500 text-white' : 'bg-slate-100'}`}>{m.text}</div>)}
      {!msgs.some((m) => m.booking == id) && <Empty>Say hello 👋</Empty>}</div>
      <form onSubmit={send} className="mt-3 flex gap-2"><input className="input" placeholder="Type a message" value={txt} onChange={(e) => setTxt(e.target.value)} /><button className="btn btn-primary"><Send size={18} /></button></form></div>
  </>)
}

export function Notifications() {
  const { user } = useAuth()
  const [ns, load] = useData('/notifications')
  const mine = ns.filter((n) => n.user === user.id)
  const markAll = () => act(() => Promise.all(mine.filter((n) => !n.read).map((n) => api.patch(`/notifications/${n.id}`, { read: true }))), null, load)
  return (<>
    <Title sub={`${mine.filter((n) => !n.read).length} unread`}>Notifications</Title>
    {mine.some((n) => !n.read) && <button className="btn btn-ghost mb-3" onClick={markAll}>Mark all as read</button>}
    <div className="space-y-2">{mine.map((n) => <div key={n.id} className={`card flex items-start gap-3 ${n.read ? '' : 'border-brand-200 bg-brand-50'}`}><span>🔔</span><div><p className="text-sm font-semibold">{n.text}</p><p className="text-xs text-slate-400">{new Date(n.time).toLocaleString()}</p></div></div>)}
      {!mine.length && <Empty>You're all caught up.</Empty>}</div>
  </>)
}

export function Profile() {
  const { user, logout, setUser } = useAuth()
  const [f, setF] = useState({ name: user.name, phone: user.phone || '', address: user.address || '' })
  const save = (e) => { e.preventDefault(); act(async () => { const { data } = await api.patch(`/users/${user.id}`, f); setUser({ ...data }); await db.setItem('session', data) }, 'Profile updated') }
  return (<>
    <Title>Profile</Title>
    <div className="card mb-4 flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-full bg-brand-500 text-2xl font-bold text-white">{user.name[0]}</div>
      <div><p className="text-lg font-bold">{user.name}</p><p className="text-sm text-slate-500">{user.email}</p><span className="mt-1 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-brand-600">{user.role}</span></div></div>
    <form onSubmit={save} className="card mb-4 space-y-3"><input className="input" placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
      <input className="input" placeholder="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      <input className="input" placeholder="Address" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /><button className="btn btn-primary w-full">Save changes</button></form>
    <button className="btn btn-ghost w-full !text-rose-600" onClick={logout}><LogOut size={18} />Log out</button>
  </>)
}
