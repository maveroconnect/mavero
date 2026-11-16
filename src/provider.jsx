import { useState } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import { api, useData, act, fmt } from './lib'
import { useAuth } from './auth'
import { Title, Stat, Badge, Empty, Stars, avg } from './ui'

export function ProviderDash() {
  const { user, setUser } = useAuth()
  const [all] = useData('/bookings'), [rs] = useData('/reviews')
  const mine = all.filter((b) => b.provider === user.id), done = mine.filter((b) => b.status === 'completed'), mr = rs.filter((r) => r.provider === user.id)
  const toggle = () => act(async () => { const { data } = await api.patch(`/users/${user.id}`, { online: !user.online }); setUser({ ...data }) }, user.online ? 'You are offline' : 'You are online')
  return (<>
    <Title sub="Your business at a glance">Dashboard</Title>
    <div className="card mb-5 flex items-center justify-between"><div><p className="font-bold">{user.online ? 'You are online' : 'You are offline'}</p><p className="text-xs text-slate-500">Clients can see your availability</p></div>
      <button onClick={toggle} className={`relative h-7 w-12 rounded-full transition ${user.online ? 'bg-brand-500' : 'bg-slate-300'}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${user.online ? 'left-6' : 'left-1'}`} /></button></div>
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4"><Stat label="Earnings" value={fmt(done.reduce((a, b) => a + b.price, 0))} /><Stat label="Completed" value={done.length} />
      <Stat label="New requests" value={mine.filter((b) => b.status === 'pending').length} /><Stat label="Rating" value={mr.length ? avg(mr).toFixed(1) : '—'} /></div>
    <h2 className="mb-3 font-bold">Recent requests</h2><div className="mb-6 space-y-2">{mine.slice(0, 4).map((b) => <div key={b.id} className="card flex items-center justify-between"><div><p className="font-semibold">{b.service}</p><p className="text-xs text-slate-500">{b.date} · {b.time}</p></div><Badge s={b.status} /></div>)}{!mine.length && <Empty>No requests yet.</Empty>}</div>
    <h2 className="mb-3 font-bold">Latest reviews</h2><div className="space-y-2">{mr.slice(0, 3).map((r) => <div key={r.id} className="card"><div className="flex justify-between"><p className="text-sm font-semibold">{r.name}</p><Stars v={r.rating} /></div><p className="text-sm text-slate-600">{r.text}</p></div>)}{!mr.length && <Empty>No reviews yet.</Empty>}</div>
  </>)
}

export function MyServices() {
  const { user } = useAuth()
  const [all, load] = useData('/services'), [cats] = useData('/categories')
  const blank = { name: '', cat: '', price: '', desc: '' }
  const [f, setF] = useState(blank), [edit, setEdit] = useState(null)
  const mine = all.filter((s) => s.provider === user.id)
  const submit = (e) => {
    e.preventDefault(); const icon = cats.find((c) => c.name === f.cat)?.icon || '🛠️', body = { ...f, price: Number(f.price), icon }
    act(() => (edit ? api.patch(`/services/${edit}`, body) : api.post('/services', { ...body, provider: user.id })), edit ? 'Service updated' : 'Service added', () => { setF(blank); setEdit(null); load() })
  }
  return (<>
    <Title sub="Manage what you offer">My services</Title>
    <form onSubmit={submit} className="card mb-5 space-y-3"><input className="input" placeholder="Service name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
      <div className="grid grid-cols-2 gap-3"><select className="input" value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })} required><option value="">Category</option>{cats.map((c) => <option key={c.id}>{c.name}</option>)}</select>
        <input className="input" type="number" min="1" placeholder="Price ($)" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} required /></div>
      <textarea className="input" rows={2} placeholder="Description" value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} required />
      <div className="flex gap-2">{edit && <button type="button" className="btn btn-ghost" onClick={() => { setEdit(null); setF(blank) }}>Cancel</button>}<button className="btn btn-primary flex-1">{edit ? 'Save changes' : 'Add service'}</button></div></form>
    <div className="space-y-2">{mine.map((s) => <div key={s.id} className="card flex items-center gap-3"><span className="text-2xl">{s.icon}</span><div className="flex-1"><p className="font-semibold">{s.name}</p><p className="text-xs text-slate-500">{s.cat} · {fmt(s.price)}</p></div>
      <button className="btn btn-ghost !p-2" onClick={() => { setEdit(s.id); setF({ name: s.name, cat: s.cat, price: s.price, desc: s.desc }) }}><Pencil size={16} /></button>
      <button className="btn btn-ghost !p-2 !text-rose-600" onClick={() => act(() => api.delete(`/services/${s.id}`), 'Service removed', load)}><Trash2 size={16} /></button></div>)}{!mine.length && <Empty>Add your first service.</Empty>}</div>
  </>)
}

export function Earnings() {
  const { user } = useAuth()
  const [all] = useData('/bookings')
  const done = all.filter((b) => b.provider === user.id && b.status === 'completed'), total = done.reduce((a, b) => a + b.price, 0), fee = Math.round(total * 0.1)
  return (<>
    <Title sub="Completed jobs and payouts">Earnings</Title>
    <div className="mb-5 grid grid-cols-3 gap-3"><Stat label="Gross" value={fmt(total)} /><Stat label="Fee (10%)" value={fmt(fee)} /><Stat label="Net" value={fmt(total - fee)} /></div>
    <div className="space-y-2">{done.map((b) => <div key={b.id} className="card flex justify-between"><div><p className="font-semibold">{b.service}</p><p className="text-xs text-slate-500">{b.date} · {b.payment}</p></div><p className="font-extrabold text-emerald-600">+{fmt(b.price)}</p></div>)}{!done.length && <Empty>No completed jobs yet.</Empty>}</div>
  </>)
}
