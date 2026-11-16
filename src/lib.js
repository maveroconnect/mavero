import axios from 'axios'
import localforage from 'localforage'
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
export const db = localforage.createInstance({ name: 'mavero' })
export const fmt = (n) => `$${Number(n).toLocaleString()}`
const day = (d) => new Date(Date.now() + 864e5 * d).toISOString().slice(0, 10)

const seed = {
  users: [
    { id: 1, name: 'Admin Mavero', email: 'admin@mavero.app', role: 'admin', status: 'active', phone: '', address: '' },
    { id: 2, name: 'Ada Okafor', email: 'provider@mavero.app', role: 'provider', status: 'active', online: true, phone: '+234 801 000 0001', address: 'Lekki, Lagos' },
    { id: 3, name: 'Tunde Bello', email: 'tunde@mavero.app', role: 'provider', status: 'active', online: true, phone: '+234 801 000 0002', address: 'Yaba, Lagos' },
    { id: 4, name: 'Chika Eze', email: 'client@mavero.app', role: 'client', status: 'active', phone: '+234 801 000 0003', address: '12 Admiralty Way, Lekki' },
    { id: 5, name: 'Sade Johnson', email: 'sade@mavero.app', role: 'provider', status: 'pending', online: false, phone: '', address: '' },
  ],
  categories: [
    { id: 1, name: 'Cleaning', icon: '🧹' }, { id: 2, name: 'Repairs', icon: '🔧' }, { id: 3, name: 'Painting', icon: '🎨' },
    { id: 4, name: 'Moving', icon: '🚚' }, { id: 5, name: 'Beauty', icon: '💇' }, { id: 6, name: 'Gardening', icon: '🌿' },
  ],
  services: [
    { id: 1, name: 'Home Cleaning', cat: 'Cleaning', price: 40, provider: 2, icon: '🧹', desc: 'Deep cleaning of rooms, kitchen and bathrooms with eco-friendly products.' },
    { id: 2, name: 'Plumbing Repair', cat: 'Repairs', price: 55, provider: 3, icon: '🔧', desc: 'Leaks, blocked drains, pipe and fixture installation.' },
    { id: 3, name: 'Electrical Fix', cat: 'Repairs', price: 60, provider: 3, icon: '⚡', desc: 'Wiring, sockets, lighting and safe fault diagnosis.' },
    { id: 4, name: 'Interior Painting', cat: 'Painting', price: 120, provider: 2, icon: '🎨', desc: 'Neat interior painting with premium paint and clean-up included.' },
    { id: 5, name: 'Moving Help', cat: 'Moving', price: 90, provider: 3, icon: '🚚', desc: 'Careful packing, loading and transport for apartments and offices.' },
    { id: 6, name: 'Hair & Beauty', cat: 'Beauty', price: 35, provider: 2, icon: '💇', desc: 'At-home hair styling, makeup and grooming services.' },
  ],
  bookings: [
    { id: 101, service: 'Home Cleaning', serviceId: 1, client: 4, provider: 2, date: day(-6), time: '10:00', address: '12 Admiralty Way, Lekki', payment: 'Card', status: 'completed', price: 40, reviewed: false },
    { id: 102, service: 'Interior Painting', serviceId: 4, client: 4, provider: 2, date: day(3), time: '14:00', address: '12 Admiralty Way, Lekki', payment: 'Cash', status: 'pending', price: 120 },
  ],
  reviews: [
    { id: 1, service: 1, provider: 2, client: 4, name: 'Chika E.', rating: 5, text: 'Spotless work and very punctual.' },
    { id: 2, service: 2, provider: 3, client: 4, name: 'Femi A.', rating: 4, text: 'Fixed the leak quickly.' },
  ],
  notifications: [], messages: [], favorites: [],
}
const get = async (k) => { let v = await db.getItem(k); if (v == null) { v = seed[k]; await db.setItem(k, v) } return v }

// Mock backend: axios adapter persisted in localforage. Remove it and set a real baseURL to use a server.
const adapter = async (c) => {
  const [path, id] = c.url.split('/').filter(Boolean)
  const m = c.method.toLowerCase(), body = c.data ? JSON.parse(c.data) : {}
  let data
  if (path === 'login') {
    const u = (await get('users')).find((x) => x.email === body.email && body.password === (x.password || 'password'))
    if (!u) throw new Error('Invalid email or password')
    if (u.status === 'pending') throw new Error('Your account is awaiting admin approval')
    if (u.status === 'suspended') throw new Error('Account suspended')
    data = u
  } else {
    const list = await get(path)
    if (m === 'get') data = list
    else if (m === 'post') { data = { ...body, id: Math.floor(Date.now() * 1000 + Math.random() * 1000) }; await db.setItem(path, [data, ...list]) }
    else if (m === 'delete') { await db.setItem(path, list.filter((x) => x.id != id)); data = { id } }
    else { data = list.find((x) => x.id == id); Object.assign(data, body); await db.setItem(path, list) }
  }
  await new Promise((r) => setTimeout(r, 200))
  return { data, status: 200, statusText: 'OK', headers: {}, config: c }
}
export const api = axios.create({ baseURL: '/api', adapter })

export function useData(path, every) {
  const [data, setData] = useState([])
  const load = useCallback(() => api.get(path).then((r) => setData(r.data)), [path])
  useEffect(() => { load(); if (every) { const t = setInterval(load, every); return () => clearInterval(t) } }, [load, every])
  return [data, load]
}
export const act = async (fn, msg, reload) => { try { await fn(); if (msg) toast.success(msg); reload && reload() } catch (e) { toast.error(e.message) } }
export const notify = (user, text) => api.post('/notifications', { user, text, time: new Date().toISOString(), read: false })
