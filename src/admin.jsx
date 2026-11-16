import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { api, useData, act, fmt } from './lib'
import { Title, Stat, Badge, Empty } from './ui'

export function AdminDash() {
  const [users] = useData('/users'), [bk] = useData('/bookings'), [sv] = useData('/services')
  const rev = bk.filter((b) => b.status === 'completed').reduce((a, b) => a + b.price, 0)
  return (<>
    <Title sub="Platform overview">Admin overview</Title>
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3"><Stat label="Users" value={users.length} /><Stat label="Pending providers" value={users.filter((u) => u.status === 'pending').length} /><Stat label="Services" value={sv.length} />
      <Stat label="Bookings" value={bk.length} /><Stat label="Gross volume" value={fmt(rev)} /><Stat label="Commission (10%)" value={fmt(Math.round(rev * 0.1))} /></div>
    <h2 className="mb-3 font-bold">Latest bookings</h2><div className="space-y-2">{bk.slice(0, 5).map((b) => <div key={b.id} className="card flex items-center justify-between"><div><p className="font-semibold">{b.service}</p><p className="text-xs text-slate-500">{b.date} · {fmt(b.price)}</p></div><Badge s={b.status} /></div>)}</div>
  </>)
}

export function AdminUsers() {
  const [users, load] = useData('/users'), [role, setRole] = useState('all')
  const set = (u, status, m) => act(() => api.patch(`/users/${u.id}`, { status }), m, load)
  const list = users.filter((u) => role === 'all' || u.role === role)
  return (<>
    <Title sub="Approve providers and manage accounts">Users</Title>
    <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">{['all', 'client', 'provider', 'admin'].map((r) => <button key={r} onClick={() => setRole(r)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold capitalize ${role === r ? 'bg-brand-500 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>{r}</button>)}</div>
    <div className="space-y-3">{list.map((u) => (
      <div key={u.id} className="card flex flex-wrap items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-brand-50 font-bold text-brand-600">{u.name[0]}</div>
        <div className="min-w-0 flex-1"><p className="font-semibold">{u.name}</p><p className="truncate text-xs capitalize text-slate-500">{u.role} · {u.email}</p></div><Badge s={u.status} />
        {u.role !== 'admin' && <div className="flex gap-2">{u.status === 'pending' && <button className="btn btn-primary !py-1.5" onClick={() => set(u, 'active', 'Provider approved')}>Approve</button>}
          {u.status === 'active' && <button className="btn btn-ghost !py-1.5" onClick={() => set(u, 'suspended', 'User suspended')}>Suspend</button>}{u.status === 'suspended' && <button className="btn btn-ghost !py-1.5" onClick={() => set(u, 'active', 'User activated')}>Activate</button>}
          <button className="btn btn-ghost !p-2 !text-rose-600" onClick={() => act(() => api.delete(`/users/${u.id}`), 'User deleted', load)}><Trash2 size={16} /></button></div>}</div>))}</div>
  </>)
}

export function Catalog() {
  const [cats, lc] = useData('/categories'), [sv, ls] = useData('/services'), [f, setF] = useState({ name: '', icon: '' })
  const add = (e) => { e.preventDefault(); act(() => api.post('/categories', { name: f.name, icon: f.icon || '🛠️' }), 'Category added', () => { setF({ name: '', icon: '' }); lc() }) }
  return (<>
    <Title sub="Categories and listed services">Catalog</Title>
    <form onSubmit={add} className="card mb-4 flex gap-2"><input className="input !w-20 text-center" placeholder="🛠️" value={f.icon} onChange={(e) => setF({ ...f, icon: e.target.value })} /><input className="input" placeholder="New category" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /><button className="btn btn-primary">Add</button></form>
    <div className="mb-6 flex flex-wrap gap-2">{cats.map((c) => <span key={c.id} className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold shadow-sm">{c.icon} {c.name}<button onClick={() => act(() => api.delete(`/categories/${c.id}`), 'Category removed', lc)} className="text-rose-500">×</button></span>)}</div>
    <h2 className="mb-3 font-bold">Services</h2><div className="space-y-2">{sv.map((s) => <div key={s.id} className="card flex items-center gap-3"><span className="text-2xl">{s.icon}</span><div className="flex-1"><p className="font-semibold">{s.name}</p><p className="text-xs text-slate-500">{s.cat} · {fmt(s.price)}</p></div>
      <button className="btn btn-ghost !p-2 !text-rose-600" onClick={() => act(() => api.delete(`/services/${s.id}`), 'Service removed', ls)}><Trash2 size={16} /></button></div>)}{!sv.length && <Empty>No services.</Empty>}</div>
  </>)
}
