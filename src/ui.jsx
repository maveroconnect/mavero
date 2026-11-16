import { Star } from 'lucide-react'
const TONE = { pending: 'bg-amber-50 text-amber-600', accepted: 'bg-brand-50 text-brand-600', completed: 'bg-emerald-50 text-emerald-600', cancelled: 'bg-slate-100 text-slate-500', declined: 'bg-rose-50 text-rose-600', active: 'bg-emerald-50 text-emerald-600', suspended: 'bg-rose-50 text-rose-600' }
export const Badge = ({ s }) => <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${TONE[s] || TONE.cancelled}`}>{s}</span>
export const Title = ({ children, sub }) => <div className="mb-5"><h1 className="text-2xl font-extrabold text-slate-900">{children}</h1>{sub && <p className="text-sm text-slate-500">{sub}</p>}</div>
export const Stat = ({ label, value }) => <div className="card"><p className="text-xs font-semibold text-slate-400">{label}</p><p className="mt-1 text-2xl font-extrabold text-brand-600">{value}</p></div>
export const Empty = ({ children }) => <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">{children}</p>
export const Stars = ({ v, onPick }) => <span className="inline-flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={onPick ? 26 : 13} onClick={() => onPick && onPick(i)} className={`${i <= Math.round(v) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} ${onPick ? 'cursor-pointer' : ''}`} />)}</span>
export const avg = (rs) => (rs.length ? rs.reduce((a, r) => a + r.rating, 0) / rs.length : 0)
