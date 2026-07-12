'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  LayoutDashboard, Package, ArrowLeftRight, CalendarDays, Wrench, ClipboardCheck,
  BarChart3, ScrollText, Building2, Search, Bell, Sun, Moon, Plus, Menu, X,
  ChevronRight, ChevronLeft, AlertTriangle, CheckCircle2, Users, Undo2,
  CalendarCheck, UserPlus, Calendar, ArrowRight, Filter, MapPin, Clock, User,
  Layers, ChevronDown, Boxes, Sparkles, TrendingUp, ShieldCheck, Zap,
  Star, Play, Check, Quote, ArrowUpRight, Twitter, Linkedin, Github,
  Bot, Radar, LineIcon, LogOut, Trash2, Pencil, Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

import {
  ASSETS as SEED_ASSETS, BOOKINGS as SEED_BOOKINGS, MAINTENANCE as SEED_MAINTENANCE,
  ACTIVITY, DEPARTMENTS, EMPLOYEES, CATEGORIES, IDLE_ASSETS, UTILIZATION_BY_DEPT,
  MAINTENANCE_TREND, KPIS,
} from '@/lib/mock-data'
import { STATUS_META, KANBAN_COLS, PRIORITY_META } from '@/lib/asset-utils'
import { supabase } from '@/lib/supabase'

/* ---------------- primitives ---------------- */

function StatusChip({ status }) {
  const norm = (status || '').toLowerCase()
  let key = 'available'
  if (norm === 'allocated') key = 'allocated'
  else if (norm.includes('maintenance')) key = 'maintenance'
  else if (norm === 'retired' || norm === 'missing') key = 'missing'
  
  const meta = STATUS_META[key] ?? STATUS_META.available
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${meta.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  )
}

function CountUp({ value, duration = 1200 }) {
  const [n, setN] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])
  return <span ref={ref}>{n.toLocaleString()}</span>
}

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const TONE_STYLES = {
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  indigo: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
}

const ICON_MAP = {
  'check-circle-2': CheckCircle2,
  users: Users,
  wrench: Wrench,
  'undo-2': Undo2,
  'arrow-left-right': ArrowLeftRight,
  'calendar-check': CalendarCheck,
  'user-plus': UserPlus,
  calendar: Calendar,
  'alert-triangle': AlertTriangle,
  'clipboard-check': ClipboardCheck,
}

/* ---------------- Landing Page ---------------- */

function HomePage({ onGoAuth }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const FEATURES = [
    { icon: Package, title: 'Lifecycle Tracking', body: 'Every asset from procurement to retirement — with rich metadata and QR-ready tags.' },
    { icon: ShieldCheck, title: 'Conflict-Free Allocation', body: 'Real-time ownership checks prevent double-assignment. Transfer flows keep everyone aligned.' },
    { icon: CalendarDays, title: 'Smart Resource Booking', body: 'Meeting rooms, projectors and vehicles — overlap detection blocks conflicts on the fly.' },
    { icon: Wrench, title: 'Maintenance Workflows', body: 'Kanban tickets flow from Pending to Resolved, keeping technicians and approvers in sync.' },
    { icon: ClipboardCheck, title: 'Audit Cycles', body: 'Physical verification wizards auto-generate discrepancy reports for every quarter.' },
    { icon: BarChart3, title: 'Real-Time Analytics', body: 'Utilization dashboards, maintenance trends and idle-asset radar — all in one hub.' },
    { icon: Users, title: 'Role-Based Access', body: 'Admins, managers and employees see exactly what they need. Nothing more, nothing less.' },
    { icon: Bell, title: 'Smart Notifications', body: 'Overdue returns, approval nudges and audit alerts — delivered where your team already is.' },
  ]

  const STEPS = [
    { n: '01', title: 'Setup', body: 'Admins configure departments, asset categories and custom fields in minutes.', icon: Building2 },
    { n: '02', title: 'Manage', body: 'Managers register assets, handle allocations and approve maintenance tickets.', icon: Layers },
    { n: '03', title: 'Optimize', body: 'Employees book resources and raise requests; leadership acts on live analytics.', icon: TrendingUp },
  ]

  const TESTIMONIALS = [
    { name: 'Priya Shah', role: 'IT Manager · Nexora', quote: 'AssetFlow paid for itself in two months. Zero more double-booked rooms, zero missing laptops.', initials: 'PS', tint: 'from-sky-400 to-teal-400' },
    { name: 'Rahul Iyer', role: 'Head of Engineering · Vantage', quote: 'The kanban maintenance board turned our chaotic email threads into a single source of truth.', initials: 'RI', tint: 'from-teal-400 to-emerald-400' },
    { name: 'Ananya Patel', role: 'Design Lead · Loop Studio', quote: 'Finally, an ERP that designers can actually enjoy. The dashboards are gorgeous and fast.', initials: 'AP', tint: 'from-amber-400 to-rose-400' },
    { name: 'Vikram Singh', role: 'Marketing · Flair Media', quote: 'Booking a vehicle used to be a Slack marathon. Now it takes 15 seconds and it just works.', initials: 'VS', tint: 'from-sky-400 to-indigo-400' },
  ]

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-slate-900">
      {/* Sticky nav */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-lg shadow-sky-500/25">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">AssetFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-slate-900 transition-colors">Customers</a>
            <a href="#cta" className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => onGoAuth('login')} className="hidden sm:inline text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2">Sign in</button>
            <Button onClick={() => onGoAuth('signup')} className="h-9 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-semibold shadow-md shadow-sky-500/25 active:scale-[0.98] transition-transform">
              Get started <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-20 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-40 w-[600px] h-[600px] rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute top-40 right-0 w-[500px] h-[500px] rounded-full bg-teal-400/20 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1A1A1A 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-700 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              New: AI-powered idle asset recommendations
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.02] mb-6"
          >
            Simplify your enterprise.<br />
            <span className="bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent">Master your assets.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-9 leading-relaxed"
          >
            Centralized ERP for seamless asset tracking, allocation, booking and maintenance — built for teams that ship, not spreadsheets.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-14"
          >
            <Button onClick={() => onGoAuth('signup')} className="h-12 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-semibold shadow-xl shadow-sky-500/30 active:scale-[0.98] transition-all">
              Get Started Free <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-300 bg-white hover:bg-slate-50 font-semibold text-slate-800 shadow-sm active:scale-[0.98] transition-transform">
              <Play className="w-4 h-4 mr-1.5 fill-slate-800" /> Watch Demo
            </Button>
          </motion.div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 mb-14">
            <div className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> No credit card required</div>
            <div className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> 14-day free trial</div>
            <div className="hidden sm:flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Cancel anytime</div>
          </div>

          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 to-teal-500/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3 flex items-center gap-2 bg-slate-50/50">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto text-[11px] text-slate-500 font-mono">app.assetflow.io / dashboard</div>
              </div>
              <div className="p-5 lg:p-7 text-left">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-xs text-slate-500">Operational Snapshot</div>
                    <div className="text-lg font-bold">Good morning, Priya</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 px-3 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 text-white text-xs font-semibold flex items-center">+ New Asset</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { l: 'Available', v: '128', c: 'text-emerald-600', b: 'bg-emerald-50', d: '+8%' },
                    { l: 'Allocated', v: '76', c: 'text-sky-600', b: 'bg-sky-50', d: '+2' },
                    { l: 'Maintenance', v: '4', c: 'text-amber-600', b: 'bg-amber-50', d: '-1' },
                    { l: 'Overdue', v: '3', c: 'text-rose-600', b: 'bg-rose-50', d: 'flag' },
                  ].map((k) => (
                    <div key={k.l} className={`rounded-xl ${k.b} border border-slate-100 p-3`}>
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{k.l}</div>
                      <div className={`text-2xl font-bold mt-1 ${k.c}`}>{k.v}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{k.d}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="col-span-2 rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                    <div className="flex items-end gap-1.5 h-16">
                      {[38, 60, 45, 78, 55, 82, 70, 90, 65, 88, 72, 95].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 0.6 + i * 0.04, duration: 0.5 }}
                          className="flex-1 rounded-t bg-gradient-to-t from-sky-500 to-teal-400"
                        />
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2">Utilization · last 12 weeks</div>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50 space-y-2">
                    {['AF-0114 · allocated', 'Room B2 · booked', 'AF-0062 · resolved'].map((t) => (
                      <div key={t} className="text-[11px] text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="relative py-24 px-6 lg:px-10 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-3">The status quo</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Tired of spreadsheets pretending to be an ERP?</h2>
            <p className="text-slate-600 leading-relaxed mb-6">Paper trails, siloed sheets and Slack threads make asset management a full-time job. Missing laptops. Double-booked rooms. Overdue returns that no one notices until audit day.</p>
            <ul className="space-y-3">
              {['4+ hours weekly reconciling ownership disputes', 'Meeting-room chaos across teams and floors', 'Zero visibility into what\'s idle vs actively used'].map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5"><X className="w-3 h-3" /></div>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-teal-50 border border-sky-100 p-8">
              <div className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-3">With AssetFlow</div>
              <h3 className="text-2xl font-bold tracking-tight mb-4">A single hub for every asset & workflow.</h3>
              <div className="space-y-3">
                {[
                  { icon: ShieldCheck, text: 'Ownership disputes resolved in seconds, not hours.' },
                  { icon: CalendarCheck, text: 'Overlap-proof booking for every shared resource.' },
                  { icon: Radar, text: 'Idle-asset radar surfaces reallocation candidates automatically.' },
                ].map((s) => (
                  <div key={s.text} className="flex items-start gap-3 rounded-xl bg-white/70 border border-white p-3 backdrop-blur">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-teal-500 text-white flex items-center justify-center shrink-0">
                      <s.icon className="w-4 h-4" />
                    </div>
                    <div className="text-sm text-slate-700 pt-1">{s.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <div className="text-xs font-bold text-sky-500 uppercase tracking-wider mb-3">Capabilities</div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Unlock efficiency with AssetFlow's core capabilities</h2>
              <p className="text-slate-600 text-lg leading-relaxed">Every feature you need to run a modern ops team — none of the bloat.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="h-full rounded-2xl bg-white border border-slate-200 p-6 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/10 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-100 to-teal-100 border border-sky-200 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-1.5">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.body}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="workflow" className="py-24 px-6 lg:px-10 bg-gradient-to-b from-white to-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <div className="text-xs font-bold text-teal-500 uppercase tracking-wider mb-3">How it works</div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Your assets, streamlined. In 3 simple steps.</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-[1px] bg-gradient-to-r from-sky-300 via-teal-300 to-emerald-300" />
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="relative rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white font-bold flex items-center justify-center mb-4 shadow-lg shadow-sky-500/25">
                    {s.n}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className="w-4 h-4 text-sky-500" />
                    <h3 className="font-bold text-xl">{s.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3">Loved by ops teams</div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">What our users say</h2>
              <div className="flex items-center justify-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                <span className="text-sm text-slate-600 ml-2 font-medium">4.9 / 5 across 200+ workspaces</span>
              </div>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-900/5 transition-shadow"
                >
                  <Quote className="w-8 h-8 text-sky-200 mb-3" />
                  <p className="text-slate-700 leading-relaxed mb-5">“{t.quote}”</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.tint} flex items-center justify-center text-white font-bold text-sm shadow-md`}>{t.initials}</div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center bg-gradient-to-br from-sky-500 via-sky-600 to-teal-500 shadow-2xl shadow-sky-500/30">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <div className="relative">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Ready to transform your asset management?</h2>
                <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Join 200+ teams using AssetFlow to eliminate spreadsheets, disputes and downtime.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => onGoAuth('signup')} className="h-12 px-6 rounded-xl bg-white text-sky-600 hover:bg-slate-50 font-semibold shadow-lg active:scale-[0.98] transition-transform">
                    Start Your Free Trial <ArrowUpRight className="w-4 h-4 ml-1.5" />
                  </Button>
                  <Button onClick={() => onGoAuth('login')} variant="outline" className="h-12 px-6 rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold backdrop-blur">
                    Sign in
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center">
                <Boxes className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold tracking-tight">AssetFlow</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">The operational hub for teams that ship, not spreadsheets.</p>
            <div className="flex gap-2 mt-4">
              {[Twitter, Linkedin, Github].map((I, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 flex items-center justify-center text-slate-500 hover:text-sky-600 transition-colors">
                  <I className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
            { title: 'Resources', links: ['Blog', 'Help Center', 'API Docs', 'Community'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security', 'Contact'] },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((l) => <li key={l}><a href="#" className="text-sm text-slate-600 hover:text-sky-600 transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 py-5 px-6 lg:px-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>© 2025 AssetFlow, Inc. All rights reserved.</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> All systems operational</div>
        </div>
      </footer>
    </div>
  )
}

/* ---------------- Auth (Login / Signup) ---------------- */

const ADMIN_CREDS = { email: 'admin@assetflow.io', password: 'admin123' }

function AuthScreen({ onLogin, defaultMode = 'login' }) {
  const [mode, setMode] = useState(defaultMode)
  const [email, setEmail] = useState('admin@assetflow.io')
  const [password, setPassword] = useState('admin123')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'login') {
      if (email.trim().toLowerCase() === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
        toast.success('Welcome back, Admin')
        onLogin({ role: 'admin', name: 'Priya Shah', email })
      } else if (email && password) {
        toast.success('Signed in as Employee')
        onLogin({ role: 'employee', name: email.split('@')[0] || 'Employee', email })
      } else {
        setError('Enter your email and password to continue.')
      }
    } else {
      if (!name || !email || !password) { setError('Please fill in every field to create your account.'); return }
      toast.success('Account created — signed in as Employee')
      onLogin({ role: 'employee', name, email })
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-sky-400/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-teal-400/15 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1A1A1A 1px, transparent 0)', backgroundSize: '28px 28px' }} />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">AssetFlow</span>
        </div>
        <div className="text-xs text-slate-500">Enterprise Asset Management</div>
      </header>

      <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 px-6 lg:px-16 pt-6 lg:pt-10 max-w-7xl mx-auto">
        {/* Left copy */}
        <div className="hidden lg:flex flex-col justify-center pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm w-fit text-xs font-medium text-slate-700 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Trusted by 200+ ops teams
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 leading-[1.05] mb-5">
            Every asset. <br />
            Every workflow. <br />
            <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">In one place.</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-md leading-relaxed mb-8">
            Sign in to your workspace to manage allocations, bookings, maintenance and audits — with real-time conflict prevention.
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { icon: ShieldCheck, label: 'Conflict-free' },
              { icon: Wrench, label: 'Smart tickets' },
              { icon: TrendingUp, label: 'Live analytics' },
            ].map((f) => (
              <div key={f.label} className="rounded-xl bg-white/70 border border-slate-200 p-3 backdrop-blur">
                <f.icon className="w-4 h-4 text-sky-500 mb-1.5" />
                <div className="text-xs font-medium text-slate-700">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex items-start lg:items-center justify-center"
        >
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 p-8">
            <div className="flex bg-slate-100 rounded-lg p-1 mb-6 text-sm font-medium">
              {['login', 'signup'].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError('') }}
                  className={`flex-1 py-2 rounded-md transition-all ${mode === m ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                >
                  {m === 'login' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
              {mode === 'login' ? 'Welcome back' : 'Get started free'}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {mode === 'login' ? 'Enter your credentials to access your workspace.' : 'Create your employee account in seconds.'}
            </p>

            <form onSubmit={submit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block uppercase tracking-wide">Full name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Shah" className="h-11 rounded-lg border-slate-200 bg-slate-50/50 focus-visible:ring-sky-400" />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block uppercase tracking-wide">Work email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="h-11 rounded-lg border-slate-200 bg-slate-50/50 focus-visible:ring-sky-400" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Password</label>
                  {mode === 'login' && <button type="button" className="text-xs text-sky-500 hover:text-sky-600 font-medium">Forgot?</button>}
                </div>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 rounded-lg border-slate-200 bg-slate-50/50 focus-visible:ring-sky-400" />
              </div>

              {error && (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {error}
                </div>
              )}

              {mode === 'signup' && (
                <div className="text-xs text-slate-600 bg-sky-50 border border-sky-200 rounded-lg p-3 flex gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span>Creates an employee account. Admin privileges are assigned by your workspace owner.</span>
                </div>
              )}

              <Button type="submit" className="w-full h-11 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-semibold shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all">
                {mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            {mode === 'login' && (
              <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Admin demo credentials</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-mono">admin@assetflow.io</span>
                  <span className="text-slate-600 font-mono">admin123</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5">Any other email/password signs you in as an Employee.</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ---------------- Sidebar & Topbar ---------------- */

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'employee'] },
  { key: 'assets', label: 'Assets', icon: Package, roles: ['admin'] },
  { key: 'allocations', label: 'Allocation & Transfer', icon: ArrowLeftRight, roles: ['admin'] },
  { key: 'bookings', label: 'Resource Booking', icon: CalendarDays, roles: ['admin', 'employee'] },
  { key: 'maintenance', label: 'Maintenance', icon: Wrench, roles: ['admin', 'employee'] },
  { key: 'audit', label: 'Audit', icon: ClipboardCheck, roles: ['admin'] },
  { key: 'reports', label: 'Reports', icon: BarChart3, roles: ['admin'] },
  { key: 'logs', label: 'Notifications', icon: Bell, roles: ['admin', 'employee'] },
  { key: 'org', label: 'Organization Setup', icon: Building2, roles: ['admin'] },
]

function Sidebar({ active, onSelect, role, onClose }) {
  return (
    <aside className="h-full w-[240px] flex-shrink-0 flex flex-col bg-card/70 backdrop-blur-xl border-r border-border">
      <div className="h-16 px-5 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center shadow-md shadow-sky-600/30">
            <Boxes className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight">AssetFlow</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {NAV_ITEMS.filter((n) => n.roles.includes(role)).map((item) => {
          const Icon = item.icon
          const isActive = active === item.key
          return (
            <button
              key={item.key}
              onClick={() => { onSelect(item.key); onClose?.() }}
              className={`w-full group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-500' : ''}`} />
              <span>{item.label}</span>
              {isActive && <span className="ml-auto w-1 h-4 rounded-full bg-sky-500" />}
            </button>
          )
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="rounded-xl border border-border p-3 bg-gradient-to-br from-sky-500/5 to-purple-500/5">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-xs font-semibold">Q2 Audit Ready</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">Start a new physical audit for this quarter.</p>
          <Button size="sm" className="h-7 w-full text-[11px] bg-sky-500 hover:bg-sky-600 text-white" onClick={() => onSelect('audit')}>Launch wizard</Button>
        </div>
      </div>
    </aside>
  )
}

function TopBar({ role, theme, setTheme, onSearchOpen, onMenu, activeLabel, user, onLogout, onNotificationsOpen, unreadCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const initials = user?.name?.split(' ').map((x) => x[0]).slice(0, 2).join('') || 'PS'
  const roleLabel = role === 'admin' ? 'Administrator' : 'Employee'
  return (
    <header className="h-16 border-b border-border bg-background/70 backdrop-blur-xl flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
      <button onClick={onMenu} className="lg:hidden text-muted-foreground">
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">AssetFlow</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        <span className="font-semibold">{activeLabel}</span>
      </div>
      <div className="flex-1" />
      <button onClick={onSearchOpen} className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted border border-border rounded-lg px-3 py-1.5 w-64">
        <Search className="w-4 h-4" />
        <span>Search by tag, serial…</span>
        <span className="ml-auto text-[10px] bg-background border border-border rounded px-1.5 py-0.5">⌘K</span>
      </button>
      <div className="flex items-center gap-1">
        <span className={`hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold border ${role === 'admin' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'}`}>
          <ShieldCheck className="w-3.5 h-3.5" /> {roleLabel}
        </span>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-9 h-9 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center">
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button onClick={onNotificationsOpen} className="w-9 h-9 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center relative" title="Notifications">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center px-1 shadow">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>
        <div className="ml-2 relative">
          <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-lg pl-2 pr-1 py-1 hover:bg-muted cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-medium leading-none">{user?.name ?? 'Priya Shah'}</div>
              <div className="text-[10px] text-muted-foreground capitalize mt-0.5">{role}</div>
            </div>
            <ChevronDown className="hidden md:block w-3.5 h-3.5 text-muted-foreground" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
                <div className="p-3 border-b border-border">
                  <div className="text-sm font-semibold">{user?.name ?? 'Priya Shah'}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email ?? 'priya@assetflow.io'}</div>
                  <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${role === 'admin' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'}`}>
                    <ShieldCheck className="w-3 h-3" /> {roleLabel}
                  </div>
                </div>
                <button onClick={() => { setMenuOpen(false); onLogout() }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-rose-500">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

/* ---------------- Dashboard ---------------- */

function Dashboard({ onQuick, onNavigate, user }) {
  const firstName = user?.name?.split(' ')[0] ?? 'Priya'
  const isAdmin = user?.role === 'admin'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const [stats, setStats] = useState({
    available: 0,
    allocated: 0,
    maintenance: 0,
    upcomingReturns: 0,
    transfers: 0,
    bookings: 0
  })
  const [overdueAssets, setOverdueAssets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-project') || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-supabase')
        if (isPlaceholder) {
          throw new Error('Supabase using placeholder credentials')
        }

        const p1 = supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'Available')
        const p2 = supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'Allocated')
        const p3 = supabase.from('maintenance_requests').select('*', { count: 'exact', head: true }).neq('status', 'Resolved').neq('status', 'Rejected')
        const p4 = supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['Upcoming', 'Ongoing'])
        const p5 = supabase.from('transfer_requests').select('*', { count: 'exact', head: true }).eq('status', 'Pending')
        
        const today = new Date().toISOString()
        const p6 = supabase.from('allocations').select('*', { count: 'exact', head: true }).eq('status', 'Active').gte('expected_return_date', today)
        const p7 = supabase.from('allocations').select('id, expected_return_date, profiles(full_name), assets(tag)').eq('status', 'Active').lt('expected_return_date', today)

        const [r1, r2, r3, r4, r5, r6, r7] = await Promise.all([p1, p2, p3, p4, p5, p6, p7])
        
        if (r1.error || r2.error || r3.error || r4.error || r5.error || r6.error || r7.error) {
          throw new Error('Supabase query error')
        }

        setStats({
          available: r1.count || 0,
          allocated: r2.count || 0,
          maintenance: r3.count || 0,
          bookings: r4.count || 0,
          transfers: r5.count || 0,
          upcomingReturns: r6.count || 0,
        })
        setOverdueAssets(r7.data || [])
      } catch (err) {
        console.warn('Dashboard falling back to local mock data:', err.message)
        
        // Compute from local seed data
        const availCount = SEED_ASSETS.filter(a => a.status?.toLowerCase() === 'available').length
        const allocCount = SEED_ASSETS.filter(a => a.status?.toLowerCase() === 'allocated').length
        const maintCount = SEED_MAINTENANCE.filter(m => m.status?.toLowerCase() !== 'resolved' && m.status?.toLowerCase() !== 'rejected').length
        const bookCount = SEED_BOOKINGS.length
        
        setStats({
          available: availCount,
          allocated: allocCount,
          maintenance: maintCount,
          bookings: bookCount,
          transfers: 0,
          upcomingReturns: 3,
        })
        setOverdueAssets([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const primaryKpis = [
    { key: 'available', label: 'Available', value: stats.available, delta: '+8%', tone: 'emerald', icon: 'check-circle-2' },
    { key: 'allocated', label: 'Allocated', value: stats.allocated, delta: '+2', tone: 'neutral', icon: 'users' },
    { key: 'maintenance', label: 'Maintenance', value: stats.maintenance, delta: '−1', tone: 'amber', icon: 'wrench' },
    { key: 'returns', label: 'Upcoming Returns', value: stats.upcomingReturns, delta: '+3', tone: 'indigo', icon: 'undo-2' },
  ]
  
  const secondaryKpis = [
    { key: 'transfers', label: 'Pending Transfers', value: stats.transfers, delta: '=', tone: 'amber', icon: 'arrow-left-right' },
    { key: 'bookings', label: 'Active Bookings', value: stats.bookings, delta: '+4', tone: 'indigo', icon: 'calendar-check' },
  ]

  const allActions = [
    { key: 'register', label: 'Register Asset', desc: 'Add a new asset to the inventory', icon: Plus, tint: 'from-sky-500 to-blue-500', adminOnly: true },
    { key: 'book', label: 'Book a Resource', desc: 'Reserve rooms, projectors, vehicles', icon: CalendarDays, tint: 'from-teal-500 to-emerald-500' },
    { key: 'maintenance', label: 'Raise Maintenance', desc: 'Flag an issue for the ops team', icon: Wrench, tint: 'from-amber-500 to-orange-500' },
  ]
  const quickActions = allActions.filter((a) => !a.adminOnly || isAdmin)

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1500px] mx-auto">
      {/* Hero header */}
      <Reveal>
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sky-500 via-sky-600 to-teal-500 p-6 md:p-8 text-white shadow-xl shadow-sky-500/20">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1.5px, transparent 1.5px), radial-gradient(circle at 80% 60%, white 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }} />
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-[11px] font-medium mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" /> All systems operational
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1.5">{greeting}, {firstName}</h1>
              <p className="text-white/80 text-sm md:text-base max-w-lg leading-relaxed">Here is what's happening across your workspace today — 3 items need your attention.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {isAdmin && (
                <Button onClick={() => onQuick('register')} className="h-10 px-4 rounded-xl bg-white text-sky-600 hover:bg-slate-50 font-semibold shadow-md active:scale-[0.98] transition-transform">
                  <Plus className="w-4 h-4 mr-1.5" /> Register Asset
                </Button>
              )}
              <Button onClick={() => onQuick('book')} className="h-10 px-4 rounded-xl bg-white/15 text-white hover:bg-white/25 font-semibold border border-white/20 backdrop-blur active:scale-[0.98] transition-transform">
                <CalendarDays className="w-4 h-4 mr-1.5" /> Book Resource
              </Button>
              <Button onClick={() => onQuick('maintenance')} className="h-10 px-4 rounded-xl bg-white/15 text-white hover:bg-white/25 font-semibold border border-white/20 backdrop-blur active:scale-[0.98] transition-transform">
                <Wrench className="w-4 h-4 mr-1.5" /> Raise Maintenance
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Alert banner */}
      {overdueAssets.length > 0 && (
        <Reveal delay={0.05}>
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{overdueAssets.length} assets overdue for return — flagged for follow-up.</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {overdueAssets.map(a => `${a.assets?.tag} (${a.profiles?.full_name})`).join(', ')}
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10" onClick={() => onNavigate('logs')}>
              Review <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </Reveal>
      )}

      {/* Primary KPIs (big) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryKpis.map((k, idx) => {
          const Icon = ICON_MAP[k.icon]
          const deltaColor = k.tone === 'emerald' ? 'text-emerald-500' : k.tone === 'amber' ? 'text-amber-500' : k.tone === 'indigo' ? 'text-sky-500' : 'text-muted-foreground'
          return (
            <Reveal key={k.key} delay={0.05 + idx * 0.03}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="relative rounded-2xl border-border p-5 hover:shadow-xl hover:shadow-sky-500/5 transition-all bg-card overflow-hidden">
                  <div className={`absolute top-0 right-0 w-24 h-24 -translate-y-6 translate-x-6 rounded-full ${TONE_STYLES[k.tone]} opacity-40 blur-2xl`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${TONE_STYLES[k.tone]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-semibold ${deltaColor} flex items-center gap-1`}>
                        {k.delta.startsWith('+') && <TrendingUp className="w-3 h-3" />}
                        {k.delta}
                      </span>
                    </div>
                    <div className="text-3xl font-bold tracking-tight tabular-nums">
                      <CountUp value={k.value} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">{k.label}</div>
                    {/* Sparkline placeholder bars */}
                    <div className="mt-3 flex items-end gap-0.5 h-6">
                      {[40, 65, 50, 70, 55, 78, 62, 82, 68, 90].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.03, duration: 0.4 }}
                          className={`flex-1 rounded-sm ${k.tone === 'emerald' ? 'bg-emerald-500/30' : k.tone === 'amber' ? 'bg-amber-500/30' : k.tone === 'indigo' ? 'bg-sky-500/30' : 'bg-slate-500/30'}`}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Reveal>
          )
        })}
      </div>

      {/* Two-column: Utilization chart (2/3) + Quick Actions (1/3) */}
      <div className="grid xl:grid-cols-3 gap-5">
        <Reveal delay={0.1} className="xl:col-span-2">
          <Card className="rounded-2xl border-border p-5 bg-card h-full">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold">Utilization by Department</h3>
                <p className="text-xs text-muted-foreground">Percentage of allocated assets across teams</p>
              </div>
              <div className="flex gap-2 items-center">
                {[
                  { label: 'High', color: 'bg-sky-500' },
                  { label: 'Med', color: 'bg-sky-400' },
                  { label: 'Low', color: 'bg-sky-200' },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span className={`w-2 h-2 rounded-sm ${l.color}`} /> {l.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={UTILIZATION_BY_DEPT} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="utilization" radius={[8, 8, 0, 0]}>
                    {UTILIZATION_BY_DEPT.map((entry, i) => (
                      <Cell key={i} fill={entry.utilization > 80 ? '#0EA5E9' : entry.utilization > 50 ? '#38BDF8' : '#BAE6FD'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.15}>
          <Card className="rounded-2xl border-border p-5 bg-card h-full">
            <div className="mb-4">
              <h3 className="font-semibold">Quick Actions</h3>
              <p className="text-xs text-muted-foreground">Speed through your everyday tasks</p>
            </div>
            <div className="space-y-2.5">
              {quickActions.map((qa) => (
                <button
                  key={qa.key}
                  onClick={() => onQuick(qa.key)}
                  className="w-full group flex items-center gap-3 rounded-xl border border-border p-3 hover:border-sky-300 hover:bg-sky-50/40 dark:hover:bg-sky-500/5 transition-all text-left"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${qa.tint} flex items-center justify-center shrink-0 shadow-md`}>
                    <qa.icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{qa.label}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{qa.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>

      {/* Secondary KPIs + Activity feed */}
      <div className="grid xl:grid-cols-3 gap-5">
        <Reveal delay={0.2} className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {secondaryKpis.map((k, idx) => {
              const Icon = ICON_MAP[k.icon]
              const deltaColor = k.tone === 'emerald' ? 'text-emerald-500' : k.tone === 'amber' ? 'text-amber-500' : k.tone === 'indigo' ? 'text-sky-500' : 'text-muted-foreground'
              return (
                <motion.div key={k.key} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                  <Card className="rounded-2xl border-border p-4 hover:shadow-lg bg-card">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${TONE_STYLES[k.tone]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold tabular-nums"><CountUp value={k.value} /></div>
                          <span className={`text-[11px] font-semibold ${deltaColor}`}>{k.delta}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{k.label}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Idle assets snapshot */}
          <Card className="rounded-2xl border-border p-5 bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2"><Radar className="w-4 h-4 text-sky-500" /> Idle Asset Radar</h3>
                <p className="text-xs text-muted-foreground">AI-flagged candidates for re-allocation</p>
              </div>
              <button className="text-xs text-sky-500 hover:text-sky-600 font-medium" onClick={() => onNavigate('reports')}>View all</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {IDLE_ASSETS.slice(0, 4).map((a) => (
                <div key={a.tag} className="rounded-xl border border-border p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      <span className="font-mono text-sky-500">{a.tag}</span> • Unused {a.days}+ days
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.25}>
          <Card className="rounded-2xl border-border p-5 bg-card h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Activity</h3>
              <button className="text-xs text-sky-500 hover:text-sky-600 font-medium" onClick={() => onNavigate('logs')}>View all</button>
            </div>
            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
              {ACTIVITY.slice(0, 8).map((a, i) => {
                const Icon = ICON_MAP[a.icon] ?? Sparkles
                return (
                  <div key={a.id} className="flex gap-3 group py-2 border-b border-border last:border-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${a.type === 'alert' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : a.type === 'maintenance' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : a.type === 'booking' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-sky-500/10 text-sky-500 border-sky-500/20'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-foreground leading-relaxed">{a.text}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{a.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  )
}

/* ---------------- Assets ---------------- */

function AssetDetailsDialog({ asset, open, onClose, onOpenAllocate, isAdmin }) {
  const [allocHistory, setAllocHistory] = useState([])
  const [maintHistory, setMaintHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!asset || !open) return
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-project') || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-supabase')
        if (isPlaceholder) {
          throw new Error('Placeholder credentials')
        }
        const [allocs, maints] = await Promise.all([
          supabase.from('allocations').select('*, profiles!allocations_assigned_to_employee_id_fkey(name)').eq('asset_id', asset.id).order('allocation_date', { ascending: false }),
          supabase.from('maintenance_requests').select('*').eq('asset_id', asset.id).order('created_at', { ascending: false })
        ])
        if (allocs.error || maints.error) throw new Error('Query failed')
        setAllocHistory(allocs.data || [])
        setMaintHistory(maints.data || [])
      } catch (err) {
        console.warn('AssetDetailsDialog history query failed, falling back:', err.message)
        setAllocHistory([])
        setMaintHistory([])
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [asset, open])

  if (!asset) return null
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[700px] rounded-2xl p-0 overflow-hidden border-border bg-card max-h-[90vh] flex flex-col">
        <div className="p-6 pb-4 border-b border-border bg-muted/20 flex items-start justify-between">
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight">{asset.name}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="font-mono text-sky-500 font-medium">{asset.tag}</span> • {asset.category}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusChip status={asset.status} />
            {isAdmin && (
              <Button size="sm" onClick={() => { onOpenAllocate(asset); onClose(); }} className="h-7 text-[10px] uppercase font-bold tracking-wide rounded bg-sky-500 hover:bg-sky-600 text-white">
                {asset.status === 'Allocated' ? 'Transfer' : 'Allocate'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-xl border border-border">
            <div><div className="text-xs text-muted-foreground mb-1">Serial Number</div><div className="text-sm font-medium">{asset.serial || '—'}</div></div>
            <div><div className="text-xs text-muted-foreground mb-1">Location</div><div className="text-sm font-medium">{asset.location || '—'}</div></div>
            <div><div className="text-xs text-muted-foreground mb-1">Condition</div><div className="text-sm font-medium">{asset.condition || '—'}</div></div>
            <div><div className="text-xs text-muted-foreground mb-1">Bookable</div><div className="text-sm font-medium">{asset.is_shared_bookable ? 'Yes' : 'No'}</div></div>
            <div><div className="text-xs text-muted-foreground mb-1">Acquisition Date</div><div className="text-sm font-medium">{asset.acquisitionDate || '—'}</div></div>
            <div><div className="text-xs text-muted-foreground mb-1">Acquisition Cost</div><div className="text-sm font-medium">{asset.acquisitionCost ? `$${asset.acquisitionCost}` : '—'}</div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allocation History */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Allocation History</h3>
              {loading ? (
                <div className="text-xs text-muted-foreground">Loading history...</div>
              ) : allocHistory.length === 0 ? (
                <div className="text-xs text-muted-foreground p-4 bg-muted/10 rounded-lg border border-border text-center">No previous allocations</div>
              ) : (
                <div className="space-y-2">
                  {allocHistory.map(a => (
                    <div key={a.id} className="text-xs p-3 rounded-lg border border-border bg-card">
                      <div className="font-medium mb-1">{a.profiles?.name || 'Unknown User'}</div>
                      <div className="text-muted-foreground flex justify-between">
                        <span>{new Date(a.allocation_date).toLocaleDateString()}</span>
                        <span>{a.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Maintenance History */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Maintenance History</h3>
              {loading ? (
                <div className="text-xs text-muted-foreground">Loading history...</div>
              ) : maintHistory.length === 0 ? (
                <div className="text-xs text-muted-foreground p-4 bg-muted/10 rounded-lg border border-border text-center">No maintenance records</div>
              ) : (
                <div className="space-y-2">
                  {maintHistory.map(m => (
                    <div key={m.id} className="text-xs p-3 rounded-lg border border-border bg-card">
                      <div className="font-medium mb-1">{m.issue_description}</div>
                      <div className="text-muted-foreground flex justify-between">
                        <span>{new Date(m.created_at).toLocaleDateString()}</span>
                        <span>{m.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/10 flex justify-between">
          <Button variant="outline" onClick={onClose} className="rounded-lg">Close</Button>
          {(isAdmin || asset.is_shared_bookable) && (
            <Button onClick={() => { onClose(); onOpenAllocate(asset); }} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg">
              {isAdmin ? (asset.status === 'Allocated' ? 'Transfer Asset' : 'Allocate Asset') : 'Book Resource'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AssetsScreen({ assets, categories, onOpenAllocate, onOpenRegister, role }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [status, setStatus] = useState('all')
  const [selectedAsset, setSelectedAsset] = useState(null)
  const isAdmin = role === 'admin' || role === 'Asset Manager'

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchQ = !q || (a.tag && a.tag.toLowerCase().includes(q.toLowerCase())) || 
                     (a.name && a.name.toLowerCase().includes(q.toLowerCase())) || 
                     (a.serial && a.serial.toLowerCase().includes(q.toLowerCase()))
      const matchCat = cat === 'all' || a.category === cat
      const matchStatus = status === 'all' || a.status === status
      return matchQ && matchCat && matchStatus
    })
  }, [assets, q, cat, status])

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Asset Directory</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} of {assets.length} assets shown</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-lg h-10 border-border"><Filter className="w-4 h-4 mr-1.5" /> Export</Button>
          {isAdmin && (
            <Button onClick={onOpenRegister} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg h-10 active:scale-[0.98] transition-transform">
              <Plus className="w-4 h-4 mr-1.5" /> Register Asset
            </Button>
          )}
        </div>
      </div>

      <Card className="rounded-2xl border-border p-5 bg-card">
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by tag, serial, or name…" className="pl-9 h-10 rounded-lg" />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-40 h-10 rounded-lg"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories && categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40 h-10 rounded-lg"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Allocated">Allocated</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
              <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
              <SelectItem value="Disposed">Disposed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3">Tag</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 hidden md:table-cell">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Location</th>
                <th className="px-4 py-3 hidden xl:table-cell">Allocated To</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.2), duration: 0.3 }}
                  onClick={() => setSelectedAsset(a)}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-mono text-xs font-medium text-sky-500">{a.tag}</td>
                  <td className="px-4 py-3 font-medium">{a.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{a.category}</td>
                  <td className="px-4 py-3"><StatusChip status={a.status} /></td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{a.location || '—'}</span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell text-muted-foreground">{a.allocatedTo ?? '—'}</td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-14 text-center text-sm text-muted-foreground">No assets match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <AssetDetailsDialog 
        asset={selectedAsset} 
        open={!!selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
        onOpenAllocate={onOpenAllocate}
        isAdmin={isAdmin}
      />
    </div>
  )
}

/* ---------------- Allocate dialog ---------------- */

function AllocateDialog({ asset, profiles = [], onClose, onAllocate, onRaiseTransfer }) {
  const [target, setTarget] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [reason, setReason] = useState('')
  
  useEffect(() => {
    if (asset && profiles.length > 0 && !target) {
      setTarget(profiles[0].id)
    }
  }, [asset, profiles])

  if (!asset) return null
  const isConflict = asset.status === 'Allocated'
  const isMaintenance = asset.status === 'In Maintenance'

  return (
    <Dialog open={!!asset} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="font-mono text-sky-500">{asset.tag}</span>
            <span>— {asset.name}</span>
          </DialogTitle>
          <DialogDescription>Assign this asset to an employee. Conflicts are checked in real-time.</DialogDescription>
        </DialogHeader>

        {isConflict ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm">Already Allocated to {asset.allocatedTo}</div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct re-allocation is blocked. To move this asset, raise a transfer request — the current owner will be notified for approval.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Transfer to</label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger className="h-11 rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {profiles.filter((e) => e.name !== asset.allocatedTo).map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name} {e.department?.name ? `— ${e.department.name}` : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea placeholder="Reason for transfer…" value={reason} onChange={e => setReason(e.target.value)} className="rounded-lg mt-2" rows={3} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg" onClick={() => { onRaiseTransfer(asset, target, reason); onClose() }}>
                <ArrowLeftRight className="w-4 h-4 mr-1.5" /> Raise Transfer Request
              </Button>
            </DialogFooter>
          </div>
        ) : isMaintenance ? (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">Under Maintenance</span>
            </div>
            <p className="text-xs text-muted-foreground">Allocation is disabled until maintenance is resolved.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Asset is available for direct allocation.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Assign to</label>
                <Select value={target} onValueChange={setTarget}>
                  <SelectTrigger className="h-11 rounded-lg mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {profiles.map((e) => <SelectItem key={e.id} value={e.id}>{e.name} {e.department?.name ? `— ${e.department.name}` : ''}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Expected Return (Optional)</label>
                <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="h-11 rounded-lg mt-1" />
              </div>
            </div>
            <div>
              <Textarea placeholder="Purpose / notes…" className="rounded-lg" rows={3} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
              <Button className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg active:scale-[0.98] transition-transform" onClick={() => { onAllocate(asset, target, returnDate); onClose() }}>
                <UserPlus className="w-4 h-4 mr-1.5" /> Confirm Allocation
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

/* ---------------- Allocations ---------------- */

function AllocationsScreen({ assets, onOpenAllocate, transfers, onApproveTransfer, onRejectTransfer, onReturnAsset, onOpenGenericAllocate }) {
  const allocated = assets.filter((a) => a.status === 'allocated' || a.status === 'Allocated')
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Allocations & Transfers</h1>
          <p className="text-muted-foreground text-sm mt-1">Smart conflict-checking keeps ownership crystal-clear.</p>
        </div>
        <Button onClick={onOpenGenericAllocate} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg h-10">
          <Plus className="w-4 h-4 mr-1.5" /> Allocate Asset
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="rounded-2xl border-border p-5 bg-card lg:col-span-2">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-sky-500" /> Currently Allocated</h3>
          <div className="space-y-2">
            {allocated.map((a) => {
              const isOverdue = a.expectedReturnDate && new Date(a.expectedReturnDate) < new Date()
              return (
                <div key={a.id} className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${isOverdue ? 'border-rose-500/30 bg-rose-500/5' : 'border-border hover:bg-muted/40'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isOverdue ? 'bg-rose-500/10 text-rose-500' : 'bg-sky-500/10 text-sky-500'}`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate flex items-center gap-2">
                      {a.name}
                      {isOverdue && <Badge className="bg-rose-500/10 text-rose-600 border-none px-1.5 py-0">Overdue</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sky-500">{a.tag}</span>
                      <span>•</span><span>{a.allocatedTo}</span>
                      <span>•</span><span>{a.dept}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground hidden md:block">Since {a.since}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 rounded-md border-border text-xs" onClick={() => onOpenAllocate(a)}>
                      Transfer
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 rounded-md border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white text-xs" onClick={() => onReturnAsset(a)}>
                      Return
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="rounded-2xl border-border p-5 bg-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-amber-500" /> Pending Transfers</h3>
          <div className="space-y-3">
            {transfers.length === 0 && <div className="text-xs text-muted-foreground py-6 text-center">No pending transfers.</div>}
            {transfers.map((t) => (
              <div key={t.id} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-sky-500">{t.tag}</span>
                  <Badge className={PRIORITY_META.medium + ' border text-[10px]'}>Awaiting approval</Badge>
                </div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  {t.from} <ArrowRight className="w-3 h-3" /> {t.to}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="h-8 w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-xs" onClick={() => onApproveTransfer(t)}>Approve</Button>
                  <Button size="sm" variant="outline" className="h-8 w-full border-rose-500/20 text-rose-500 hover:bg-rose-500/10 rounded-md text-xs" onClick={() => onRejectTransfer(t)}>Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ---------------- Bookings calendar ---------------- */

const TIMES = Array.from({ length: 19 }, (_, i) => 9 + i * 0.5)

const formatTime = (t) => {
  if (t % 1 !== 0) return ''
  const h = Math.floor(t)
  return `${h} to ${h + 1}`
}

function BookingsScreen({ bookings, onBook, assets }) {
  const bookableAssets = assets.filter(a => a.is_shared_bookable)
  const defaultAssetTag = bookableAssets.length > 0 ? bookableAssets[0].tag : ''
  const [assetTag, setAssetTag] = useState(defaultAssetTag)
  const [showForm, setShowForm] = useState(false)
  const [dayOffset, setDayOffset] = useState(0) // 0 = today, 1 = tomorrow ...
  const [startH, setStartH] = useState(11)
  const [endH, setEndH] = useState(12)
  const [title, setTitle] = useState('')

  const currentDays = useMemo(() => {
    const days = []
    const now = new Date()
    for (let i = 0; i < 5; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() + i)
      days.push(d)
    }
    return days
  }, [])

  const dayBookings = bookings.filter((b) => b.assetTag === assetTag)
  const activeDayBookings = dayBookings.filter(b => b.status !== 'Cancelled')
  
  const hasOverlap = () => {
    const targetDate = currentDays[dayOffset]
    return activeDayBookings.some((b) => {
      if (!b.startDate) return false
      const bDate = new Date(b.startDate)
      return bDate.getFullYear() === targetDate.getFullYear() &&
             bDate.getMonth() === targetDate.getMonth() &&
             bDate.getDate() === targetDate.getDate() &&
             !(endH <= b.start || startH >= b.end)
    })
  }

  const submit = () => {
    if (hasOverlap()) { toast.error('Time slot overlaps with an existing booking.'); return }
    if (endH <= startH) { toast.error('End time must be after start time.'); return }
    
    const selectedAsset = bookableAssets.find(a => a.tag === assetTag)
    if (!selectedAsset) { toast.error('Asset not found.'); return }

    const targetDate = currentDays[dayOffset]
    
    const start_time = new Date(targetDate)
    start_time.setHours(Math.floor(startH), (startH % 1) * 60, 0, 0)
    
    const end_time = new Date(targetDate)
    end_time.setHours(Math.floor(endH), (endH % 1) * 60, 0, 0)

    onBook(selectedAsset.id, start_time, end_time, title)
    setShowForm(false); setTitle('')
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Resource Booking</h1>
          <p className="text-muted-foreground text-sm mt-1">Book meeting rooms, projectors and vehicles conflict-free.</p>
        </div>
        <div className="flex gap-2">
          <Select value={assetTag} onValueChange={setAssetTag}>
            <SelectTrigger className="w-56 h-10 rounded-lg"><SelectValue placeholder="Select a resource..." /></SelectTrigger>
            <SelectContent>
              {bookableAssets.length === 0 ? (
                <SelectItem value="none" disabled>No bookable resources</SelectItem>
              ) : (
                bookableAssets.map(a => <SelectItem key={a.id} value={a.tag}>{a.name}</SelectItem>)
              )}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowForm(true)} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg h-10 active:scale-[0.98] transition-transform">
            <Plus className="w-4 h-4 mr-1.5" /> New Booking
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border-border p-5 bg-card overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid" style={{ gridTemplateColumns: '60px repeat(5, 1fr)' }}>
            <div />
            {currentDays.map((d, i) => (
              <div key={i} className="text-center text-xs font-semibold py-2 border-b border-border">
                <div className="text-muted-foreground uppercase tracking-wide">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-lg font-bold mt-1">{d.getDate()} {d.toLocaleDateString('en-US', { month: 'short' })}</div>
              </div>
            ))}
          </div>
          {TIMES.map((t) => (
            <div key={t} className="grid" style={{ gridTemplateColumns: '60px repeat(5, 1fr)' }}>
              <div className="text-[11px] text-muted-foreground py-3 pr-2 text-right tabular-nums border-t border-border/50">{formatTime(t)}</div>
              {currentDays.map((d, dIdx) => {
                const booking = dayBookings.find((b) => {
                  if (!b.startDate) return false
                  const bDate = new Date(b.startDate)
                  return bDate.getFullYear() === d.getFullYear() &&
                         bDate.getMonth() === d.getMonth() &&
                         bDate.getDate() === d.getDate() &&
                         t >= b.start && t < b.end
                })
                const isStart = booking && booking.start === t
                return (
                  <div key={dIdx} className="border-t border-l border-border/50 h-14 relative">
                    {isStart && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`absolute inset-x-1 top-1 rounded-lg border p-1.5 z-10 overflow-hidden ${
                          booking.status === 'Cancelled' ? 'bg-rose-500/15 border-rose-500/30' :
                          booking.status === 'Completed' ? 'bg-slate-500/15 border-slate-500/30' :
                          booking.status === 'Ongoing' ? 'bg-emerald-500/15 border-emerald-500/30' :
                          'bg-sky-500/15 border-sky-500/30'
                        }`}
                        style={{ height: `calc(${(booking.end - booking.start) / 0.5 * 56}px - 8px)` }}
                      >
                        <div className={`text-[10px] font-semibold truncate ${
                          booking.status === 'Cancelled' ? 'text-rose-600 dark:text-rose-400' :
                          booking.status === 'Completed' ? 'text-slate-600 dark:text-slate-400' :
                          booking.status === 'Ongoing' ? 'text-emerald-600 dark:text-emerald-400' :
                          'text-sky-600 dark:text-sky-400'
                        }`}>{booking.title}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{booking.user}</div>
                        <div className="text-[10px] text-muted-foreground">{formatTime(booking.start)} – {formatTime(booking.end)}</div>
                        <div className="text-[9px] uppercase font-bold tracking-wider mt-1 opacity-80">{booking.status}</div>
                      </motion.div>
                    )}
                    {booking && !isStart && <div className={`absolute inset-0 ${
                      booking.status === 'Cancelled' ? 'bg-rose-500/5' :
                      booking.status === 'Completed' ? 'bg-slate-500/5' :
                      booking.status === 'Ongoing' ? 'bg-emerald-500/5' :
                      'bg-sky-500/5'
                    }`} />}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>New Booking</DialogTitle>
            <DialogDescription>Overlaps are automatically detected and blocked.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sprint retro" className="h-10 rounded-lg" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Day</label>
                <Select value={String(dayOffset)} onValueChange={(v) => setDayOffset(Number(v))}>
                  <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currentDays.map((d, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Start</label>
                <Select value={String(startH)} onValueChange={(v) => setStartH(Number(v))}>
                  <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>{TIMES.slice(0, -1).map((t) => <SelectItem key={t} value={String(t)}>{formatTime(t)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">End</label>
                <Select value={String(endH)} onValueChange={(v) => setEndH(Number(v))}>
                  <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>{TIMES.slice(1).map((t) => <SelectItem key={t} value={String(t)}>{formatTime(t)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            {hasOverlap() && (
              <div className="rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs p-2.5 flex gap-2 items-start">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> This time slot overlaps with an existing booking.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-lg">Cancel</Button>
            <Button onClick={submit} disabled={hasOverlap()} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg">Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ---------------- Maintenance ---------------- */

function TicketCard({ t, onMove, role }) {
  const [expanded, setExpanded] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const prioKey = t.priority ? (t.priority.charAt(0).toUpperCase() + t.priority.slice(1).toLowerCase()) : 'Medium'

  return (
    <>
      <motion.div
        layout
        draggable
        onDragStart={(e) => e.dataTransfer.setData('ticketId', t.id)}
        whileHover={{ y: -2 }}
        className="cursor-grab active:cursor-grabbing rounded-xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] text-sky-500 font-semibold">{t.assetTag}</span>
            <Badge className={`${PRIORITY_META[prioKey] ?? PRIORITY_META.Medium} border text-[10px] capitalize`}>{t.priority ?? 'Medium'}</Badge>
          </div>
          <div className="text-sm font-medium mb-0.5">{t.assetName}</div>
          <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{t.issue}</div>
          {t.photoUrl && (
            <img src={t.photoUrl} alt="issue" className="mt-2 w-full h-20 object-cover rounded-lg border border-border" />
          )}
          <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><User className="w-3 h-3" />{t.raisedBy}</span>
            <span>{t.date}</span>
          </div>
          {t.tech && <div className="mt-2 text-[10px] rounded-md bg-sky-500/10 text-sky-500 px-2 py-1 inline-block">🔧 Tech: {t.tech}</div>}
        </div>

        {/* Action buttons for Pending — admin/manager approves or rejects */}
        {t.status === 'Pending' && (role === 'admin') && (
          <div className="flex border-t border-border">
            <button onClick={() => onMove(t.id, 'Approved')} className="flex-1 py-1.5 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-500/10 transition-colors rounded-bl-xl flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Approve
            </button>
            <div className="w-px bg-border" />
            <button onClick={() => onMove(t.id, 'Rejected')} className="flex-1 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors rounded-br-xl flex items-center justify-center gap-1">
              <X className="w-3 h-3" /> Reject
            </button>
          </div>
        )}

        {/* Assign technician button for Approved */}
        {t.status === 'Approved' && (role === 'admin') && (
          <div className="flex border-t border-border">
            <button onClick={() => setAssignOpen(true)} className="w-full py-1.5 text-[11px] font-semibold text-blue-600 hover:bg-blue-500/10 transition-colors rounded-b-xl flex items-center justify-center gap-1">
              <UserPlus className="w-3 h-3" /> Assign Technician
            </button>
          </div>
        )}

        {/* Progress / Resolve buttons */}
        {t.status === 'Technician Assigned' && (role === 'admin') && (
          <div className="flex border-t border-border">
            <button onClick={() => onMove(t.id, 'In Progress')} className="w-full py-1.5 text-[11px] font-semibold text-amber-600 hover:bg-amber-500/10 transition-colors rounded-b-xl flex items-center justify-center gap-1">
              <Wrench className="w-3 h-3" /> Mark In Progress
            </button>
          </div>
        )}
        {t.status === 'In Progress' && (role === 'admin') && (
          <div className="flex border-t border-border">
            <button onClick={() => onMove(t.id, 'Resolved')} className="w-full py-1.5 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-500/10 transition-colors rounded-b-xl flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Mark Resolved
            </button>
          </div>
        )}

        {/* Expand toggle */}
        <button onClick={() => setExpanded(v => !v)} className="w-full px-3 py-1 text-[10px] text-muted-foreground hover:text-foreground border-t border-border flex items-center justify-center gap-1 transition-colors">
          {expanded ? <ChevronLeft className="w-3 h-3 rotate-90" /> : <ChevronRight className="w-3 h-3 rotate-90" />}
          {expanded ? 'Less' : 'Details'}
        </button>

        {expanded && (
          <div className="px-3 pb-3 space-y-1.5 border-t border-border bg-muted/20">
            <p className="text-[11px] font-medium text-muted-foreground mt-2">Full Issue</p>
            <p className="text-xs leading-relaxed">{t.issue}</p>
            {t.tech && <><p className="text-[11px] font-medium text-muted-foreground">Assigned To</p><p className="text-xs">{t.tech}</p></>}
            <p className="text-[11px] font-medium text-muted-foreground">Raised By</p>
            <p className="text-xs">{t.raisedBy} on {t.date}</p>
          </div>
        )}
      </motion.div>

      <AssignTechnicianDialog
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        ticket={t}
        onAssign={(tech) => {
          onMove(t.id, 'Technician Assigned', tech)
          setAssignOpen(false)
        }}
      />
    </>
  )
}

function AssignTechnicianDialog({ open, onClose, ticket, onAssign }) {
  const [tech, setTech] = useState('')
  useEffect(() => { if (open) setTech(ticket?.tech ?? '') }, [open, ticket])
  if (!open) return null
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>Assign Technician</DialogTitle>
          <DialogDescription>Enter the technician or vendor name for <span className="font-mono text-sky-500">{ticket?.assetTag}</span>.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <label className="text-sm font-medium block">Technician / Vendor</label>
          <Input value={tech} onChange={e => setTech(e.target.value)} placeholder="e.g. Apple Care, IT Support Team" className="h-10 rounded-lg" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
          <Button disabled={!tech.trim()} onClick={() => onAssign(tech)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
            <UserPlus className="w-4 h-4 mr-1.5" /> Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MaintenanceScreen({ tickets, onMoveTicket, onRaise, role = 'admin' }) {
  const [filterPriority, setFilterPriority] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = tickets.filter(t => {
    const matchPriority = filterPriority === 'all' || (t.priority?.toLowerCase() === filterPriority)
    const q = search.toLowerCase()
    const matchSearch = !q || t.assetTag?.toLowerCase().includes(q) || t.assetName?.toLowerCase().includes(q) || t.issue?.toLowerCase().includes(q) || t.raisedBy?.toLowerCase().includes(q)
    return matchPriority && matchSearch
  })

  const stats = {
    pending: tickets.filter(t => t.status === 'Pending').length,
    active: tickets.filter(t => ['Approved','Technician Assigned','In Progress'].includes(t.status)).length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
    rejected: tickets.filter(t => t.status === 'Rejected').length,
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Maintenance Board</h1>
          <p className="text-muted-foreground text-sm mt-1">Full repair workflow — Pending → Approved / Rejected → Technician Assigned → In Progress → Resolved.</p>
        </div>
        <Button onClick={onRaise} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg h-10 active:scale-[0.98] transition-transform">
          <Plus className="w-4 h-4 mr-1.5" /> Raise Request
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pending', value: stats.pending, color: 'text-slate-600', bg: 'bg-slate-500/10' },
          { label: 'Active', value: stats.active, color: 'text-amber-600', bg: 'bg-amber-500/10' },
          { label: 'Resolved', value: stats.resolved, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { label: 'Rejected', value: stats.rejected, color: 'text-rose-600', bg: 'bg-rose-500/10' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3 flex items-center gap-3`}>
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            <span className={`text-sm font-medium ${s.color}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets…" className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30" />
        </div>
        <div className="flex gap-1">
          {['all','high','medium','low'].map(p => (
            <button key={p} onClick={() => setFilterPriority(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border capitalize ${
              filterPriority === p ? 'bg-sky-500 text-white border-sky-500' : 'text-muted-foreground border-border hover:border-sky-500/40'
            }`}>{p === 'all' ? 'All' : p}</button>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 overflow-x-auto">
        {KANBAN_COLS.map((col) => {
          const items = filtered.filter((t) => t.status === col.key)
          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData('ticketId')
                if (id) onMoveTicket(id, col.key)
              }}
              className="rounded-2xl border border-border bg-card/60 p-3 min-h-[300px] flex flex-col"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-current ${col.accent}`} />
                  <span className="text-xs font-semibold">{col.label}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{items.length}</span>
              </div>
              <div className="space-y-2 flex-1">
                {items.map((t) => (
                  <TicketCard key={t.id} t={t} onMove={onMoveTicket} role={role} />
                ))}
                {items.length === 0 && (
                  <div className="text-[11px] text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">Drop here</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------- Audit ---------------- */

function AuditScreen({ assets, departments = [], profiles = [], addLog, currentUser, setAssets }) {
  const [cycles, setCycles] = useState([
    {
      id: 'cycle-1',
      name: 'Q1 Physical Inventory Audit',
      scopeDeptId: 'all',
      scopeDeptName: 'All Departments',
      scopeLocation: 'HQ - Floor 3',
      startDate: '2026-01-10',
      endDate: '2026-01-20',
      status: 'Closed',
      auditorNames: ['Priya Shah', 'Rahul Iyer'],
      stats: { total: 12, verified: 10, missing: 1, damaged: 1 },
      records: [
        { id: 'r1', assetTag: 'AF-0114', assetName: 'MacBook Pro 16"', status: 'Verified', notes: 'Good condition' },
        { id: 'r2', assetTag: 'AF-0062', assetName: 'Epson EB-U05 Projector', status: 'Damaged', notes: 'Flickering display' },
        { id: 'r3', assetTag: 'AF-0031', assetName: 'Dell XPS 15', status: 'Verified', notes: '' },
        { id: 'r4', assetTag: 'AF-0301', assetName: 'Sony A7 IV', status: 'Missing', notes: 'Not found in HQ - Studio' }
      ]
    },
    {
      id: 'cycle-2',
      name: 'IT Ops Department Checkpoint',
      scopeDeptId: 'd4',
      scopeDeptName: 'IT Ops',
      scopeLocation: 'All Locations',
      startDate: '2026-07-01',
      endDate: '2026-07-15',
      status: 'Open',
      auditorNames: ['Priya Shah'],
      stats: { total: 0, verified: 0, missing: 0, damaged: 0 },
      records: []
    }
  ])

  const [activeCycleId, setActiveCycleId] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('active') // 'active' | 'history'
  const [results, setResults] = useState({}) // { [assetId]: { status: 'Verified'|'Missing'|'Damaged', notes: '' } }

  // Create Cycle fields
  const [newName, setNewName] = useState('')
  const [newScopeDept, setNewScopeDept] = useState('all')
  const [newScopeLoc, setNewScopeLoc] = useState('All Locations')
  const [newStart, setNewStart] = useState('')
  const [newEnd, setNewEnd] = useState('')
  const [selectedAuditors, setSelectedAuditors] = useState([])

  const currentCycle = cycles.find(c => c.id === activeCycleId)

  // Filter assets matching the active cycle scope
  const targetAssets = useMemo(() => {
    if (!currentCycle) return []
    return assets.filter(a => {
      const matchDept = currentCycle.scopeDeptId === 'all' || 
        (a.dept?.toLowerCase() === departments.find(d => d.id === currentCycle.scopeDeptId)?.name?.toLowerCase())
      
      const matchLoc = currentCycle.scopeLocation === 'All Locations' || 
        (a.location?.toLowerCase().includes(currentCycle.scopeLocation?.toLowerCase()))
      
      return matchDept && matchLoc
    })
  }, [currentCycle, assets, departments])

  const totalToAudit = targetAssets.length
  const auditedCount = Object.keys(results).length
  const progress = totalToAudit > 0 ? (auditedCount / totalToAudit) * 100 : 0

  const summary = useMemo(() => {
    const verified = Object.values(results).filter((r) => r.status === 'Verified').length
    const missing = Object.values(results).filter((r) => r.status === 'Missing').length
    const damaged = Object.values(results).filter((r) => r.status === 'Damaged').length
    return { verified, missing, damaged }
  }, [results])

  const handleCreate = () => {
    if (!newName.trim() || !newStart || !newEnd || selectedAuditors.length === 0) {
      toast.error('Please fill in all required fields and select at least one auditor.')
      return
    }

    const deptName = newScopeDept === 'all' ? 'All Departments' : (departments.find(d => d.id === newScopeDept)?.name ?? 'All Departments')
    const newCycle = {
      id: 'cycle-' + Date.now(),
      name: newName,
      scopeDeptId: newScopeDept,
      scopeDeptName: deptName,
      scopeLocation: newScopeLoc || 'All Locations',
      startDate: newStart,
      endDate: newEnd,
      status: 'Open',
      auditorNames: selectedAuditors,
      stats: { total: 0, verified: 0, missing: 0, damaged: 0 },
      records: []
    }

    setCycles(prev => [newCycle, ...prev])
    setCreateOpen(false)
    toast.success('Audit Cycle created successfully!')

    // Reset inputs
    setNewName('')
    setNewScopeDept('all')
    setNewScopeLoc('All Locations')
    setNewStart('')
    setNewEnd('')
    setSelectedAuditors([])
  }

  const startAuditSession = (cycleId) => {
    setActiveCycleId(cycleId)
    // Pre-populate results if cycle has existing logs
    setResults({})
  }

  const handleCloseCycle = () => {
    if (auditedCount < totalToAudit) {
      toast.error(`Please complete the audit for all ${totalToAudit} scoped assets before closing.`)
      return
    }

    // Update asset statuses based on audit results
    const updatedAssets = assets.map(asset => {
      const auditRes = results[asset.id]
      if (auditRes) {
        if (auditRes.status === 'Missing') {
          return { ...asset, status: 'Lost' }
        } else if (auditRes.status === 'Damaged') {
          return { ...asset, condition: 'Poor' }
        }
      }
      return asset
    })
    setAssets(updatedAssets)

    // Save cycle statistics and lock it
    setCycles(prev => prev.map(c => {
      if (c.id === activeCycleId) {
        const records = targetAssets.map(a => ({
          id: a.id,
          assetTag: a.tag,
          assetName: a.name,
          status: results[a.id]?.status || 'Verified',
          notes: results[a.id]?.notes || ''
        }))
        return {
          ...c,
          status: 'Closed',
          stats: {
            total: totalToAudit,
            verified: summary.verified,
            missing: summary.missing,
            damaged: summary.damaged
          },
          records
        }
      }
      return c
    }))

    addLog(
      'audit',
      `Audit Cycle closed: "${currentCycle.name}" — Verified: ${summary.verified}, Missing: ${summary.missing}, Damaged: ${summary.damaged}`,
      currentUser?.name || 'Admin',
      'all'
    )

    toast.success(`Audit cycle "${currentCycle.name}" locked and asset database updated!`)
    setActiveCycleId(null)
    setResults({})
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Asset Audit Center</h1>
          <p className="text-muted-foreground text-sm mt-1">Designate verification scopes, assign auditors, and resolve inventory discrepancies.</p>
        </div>
        {!activeCycleId && (
          <Button onClick={() => setCreateOpen(true)} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg h-10 active:scale-[0.98] transition-all shadow-md shadow-sky-500/10">
            <Plus className="w-4 h-4 mr-1.5" /> Start Audit Cycle
          </Button>
        )}
      </div>

      {activeCycleId ? (
        /* Perform Audit Session Workspace */
        <div className="space-y-6">
          <Card className="rounded-2xl border-border p-6 bg-card space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-500 tracking-wider">Active Verification Session</span>
                <h2 className="text-xl font-bold mt-0.5">{currentCycle.name}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Scope: <strong className="text-foreground">{currentCycle.scopeDeptName}</strong> | Location: <strong className="text-foreground">{currentCycle.scopeLocation}</strong>
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setActiveCycleId(null)} className="rounded-lg h-9 text-xs">
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Exit Session
                </Button>
                <Button onClick={handleCloseCycle} disabled={auditedCount < totalToAudit} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-9 text-xs">
                  <Check className="w-3.5 h-3.5 mr-1" /> Close & Lock Audit
                </Button>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-muted-foreground">Progress: {auditedCount} of {totalToAudit} items checked</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 rounded-full" />
            </div>

            {/* Discrepancy Live Panel */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{summary.verified}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Verified</div>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-center">
                <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{summary.damaged}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Damaged</div>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-center">
                <div className="text-xl font-bold text-rose-600 dark:text-rose-400">{summary.missing}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Missing</div>
              </div>
            </div>
          </Card>

          {/* Audit Verification List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targetAssets.map((asset) => {
              const res = results[asset.id]?.status
              const notes = results[asset.id]?.notes || ''
              return (
                <Card key={asset.id} className="rounded-2xl border border-border bg-card p-4 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{asset.name}</h4>
                      <p className="font-mono text-[10px] text-sky-500 mt-0.5">{asset.tag}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">Loc: {asset.location} | Serial: {asset.serial || 'N/A'}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] capitalize bg-muted">{asset.status}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'Verified', label: 'Verified', color: 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/5', activeColor: 'bg-emerald-500 text-white border-emerald-500' },
                      { key: 'Damaged', label: 'Damaged', color: 'border-amber-500/30 text-amber-600 hover:bg-amber-500/5', activeColor: 'bg-amber-500 text-white border-amber-500' },
                      { key: 'Missing', label: 'Missing', color: 'border-rose-500/30 text-rose-600 hover:bg-rose-500/5', activeColor: 'bg-rose-500 text-white border-rose-500' }
                    ].map(btn => (
                      <button
                        key={btn.key}
                        onClick={() => setResults(prev => ({
                          ...prev,
                          [asset.id]: { status: btn.key, notes: prev[asset.id]?.notes || '' }
                        }))}
                        className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          res === btn.key ? btn.activeColor : btn.color
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {res === 'Damaged' && (
                    <Input
                      placeholder="Describe damage details..."
                      value={notes}
                      onChange={(e) => setResults(prev => ({
                        ...prev,
                        [asset.id]: { status: 'Damaged', notes: e.target.value }
                      }))}
                      className="h-8 text-xs rounded-lg"
                    />
                  )}
                  {res === 'Missing' && (
                    <Input
                      placeholder="Describe last known location..."
                      value={notes}
                      onChange={(e) => setResults(prev => ({
                        ...prev,
                        [asset.id]: { status: 'Missing', notes: e.target.value }
                      }))}
                      className="h-8 text-xs rounded-lg"
                    />
                  )}
                </Card>
              )
            })}
            {totalToAudit === 0 && (
              <div className="col-span-2 text-center py-12 border border-dashed border-border rounded-2xl bg-card">
                <Package className="w-10 h-10 mx-auto text-muted-foreground" />
                <h3 className="font-semibold mt-3">No Scoped Assets Found</h3>
                <p className="text-xs text-muted-foreground mt-1">There are no assets matching the department/location scope of this cycle.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Audit Dashboard */
        <div className="space-y-6">
          <div className="flex border-b border-border">
            {[
              { key: 'active', label: 'Active Cycles' },
              { key: 'history', label: 'Audit History' }
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === t.key ? 'border-sky-500 text-sky-500' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {cycles.filter(c => activeTab === 'active' ? c.status === 'Open' : c.status === 'Closed').map(c => (
              <Card key={c.id} className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base">{c.name}</h3>
                      <Badge className={c.status === 'Open' ? 'bg-sky-500/10 text-sky-600' : 'bg-slate-500/10 text-slate-600'}>
                        {c.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Scope: <strong>{c.scopeDeptName}</strong> | Loc: <strong>{c.scopeLocation}</strong>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Timeline: {c.startDate} to {c.endDate}
                    </p>
                  </div>
                  {c.status === 'Open' ? (
                    <Button onClick={() => startAuditSession(c.id)} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs h-9">
                      <ClipboardCheck className="w-3.5 h-3.5 mr-1" /> Perform Audit
                    </Button>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground font-medium block">Audit locked</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Closed Cycle</span>
                    </div>
                  )}
                </div>

                {/* Discrepancy / Audit Breakdown Statistics */}
                <div className="grid grid-cols-4 gap-3 bg-muted/20 border border-border rounded-xl p-3.5">
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">Scoped Items</span>
                    <span className="font-bold text-base block mt-0.5">{c.status === 'Open' ? assets.filter(a => c.scopeDeptId === 'all' || a.dept?.toLowerCase() === departments.find(d => d.id === c.scopeDeptId)?.name?.toLowerCase()).length : c.stats.total}</span>
                  </div>
                  <div className="text-center border-l border-border">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">Verified</span>
                    <span className="font-bold text-base block mt-0.5 text-emerald-600 dark:text-emerald-400">{c.stats.verified}</span>
                  </div>
                  <div className="text-center border-l border-border">
                    <span className="text-xs text-amber-600 dark:text-amber-400">Damaged</span>
                    <span className="font-bold text-base block mt-0.5 text-amber-600 dark:text-amber-400">{c.stats.damaged}</span>
                  </div>
                  <div className="text-center border-l border-border">
                    <span className="text-xs text-rose-600 dark:text-rose-400">Missing</span>
                    <span className="font-bold text-base block mt-0.5 text-rose-600 dark:text-rose-400">{c.stats.missing}</span>
                  </div>
                </div>

                {/* Audit assignments list */}
                <div className="text-xs text-muted-foreground">
                  Assigned Auditors: <strong className="text-foreground">{c.auditorNames.join(', ')}</strong>
                </div>

                {/* Closed Cycle Detailed Log */}
                {c.status === 'Closed' && c.records && c.records.length > 0 && (
                  <div className="border-t border-border pt-3 space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Discrepancy Details</span>
                    <div className="max-h-[150px] overflow-y-auto space-y-1.5 pr-1">
                      {c.records.map((rec, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                          <div>
                            <span className="font-medium">{rec.assetName}</span>
                            <span className="font-mono text-[10px] text-sky-500 ml-1.5">({rec.assetTag})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              rec.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-600' :
                              rec.status === 'Damaged' ? 'bg-amber-500/10 text-amber-600' :
                              'bg-rose-500/10 text-rose-600'
                            }`}>{rec.status}</span>
                            {rec.notes && <span className="text-[10px] text-muted-foreground italic font-light">"{rec.notes}"</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}

            {cycles.filter(c => activeTab === 'active' ? c.status === 'Open' : c.status === 'Closed').length === 0 && (
              <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card">
                <ClipboardCheck className="w-10 h-10 mx-auto text-muted-foreground animate-pulse" />
                <h3 className="font-semibold mt-3">No Cycles Found</h3>
                <p className="text-xs text-muted-foreground mt-1">There are no audit cycles listed in this section.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Start Audit Cycle Dialog */}
      <Dialog open={createOpen} onOpenChange={(o) => !o && setCreateOpen(false)}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-sky-500" /> Start New Audit Cycle</DialogTitle>
            <DialogDescription>Define the audit scope, schedule, and assign verify agents.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Audit Name *</label>
              <Input
                placeholder="e.g. Q2 Floor 3 Hardware Audit"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="h-10 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Scope Department</label>
                <Select value={newScopeDept} onValueChange={setNewScopeDept}>
                  <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Scope Location / Keywords</label>
                <Input
                  placeholder="e.g. Floor 3, Remote"
                  value={newScopeLoc}
                  onChange={e => setNewScopeLoc(e.target.value)}
                  className="h-10 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Start Date *</label>
                <Input
                  type="date"
                  value={newStart}
                  onChange={e => setNewStart(e.target.value)}
                  className="h-10 rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">End Date *</label>
                <Input
                  type="date"
                  value={newEnd}
                  onChange={e => setNewEnd(e.target.value)}
                  className="h-10 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Assign Auditors *</label>
              <div className="max-h-[120px] overflow-y-auto border border-border rounded-lg p-2.5 space-y-2">
                {profiles.map(p => {
                  const checked = selectedAuditors.includes(p.name)
                  return (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 p-1.5 rounded-md transition-colors text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          if (checked) setSelectedAuditors(prev => prev.filter(name => name !== p.name))
                          else setSelectedAuditors(prev => [...prev, p.name])
                        }}
                        className="rounded border-border text-sky-500 w-4 h-4"
                      />
                      <span>{p.name} ({p.role})</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="rounded-lg">Cancel</Button>
            <Button onClick={handleCreate} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg">
              <ClipboardCheck className="w-4 h-4 mr-1.5" /> Start Cycle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ---------------- Reports ---------------- */

function ReportsScreen({ assets = [], bookings = [], tickets = [] }) {
  const totalCount = assets.length
  const allocatedCount = assets.filter(a => a.status === 'Allocated' || a.allocatedTo).length
  const utilizationRate = totalCount > 0 ? Math.round((allocatedCount / totalCount) * 100) : 0
  const activeMaintCount = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Rejected').length

  // 1. Dynamic utilization by department
  const utilizationByDept = useMemo(() => {
    const counts = {}
    assets.forEach(a => {
      if ((a.status === 'Allocated' || a.allocatedTo) && a.dept) {
        counts[a.dept] = (counts[a.dept] || 0) + 1
      }
    })
    const list = Object.entries(counts).map(([dept, count]) => ({ dept, count }))
    return list.length > 0 ? list.sort((a, b) => b.count - a.count) : [
      { dept: 'Engineering', count: 3 },
      { dept: 'Design', count: 2 },
      { dept: 'IT Ops', count: 1 }
    ]
  }, [assets])

  // 2. Dynamic booking heatmap (peak hours)
  const bookingHeatmap = useMemo(() => {
    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
    const counts = {}
    hours.forEach(h => { counts[h] = 0 })

    bookings.forEach(b => {
      if (b.start !== undefined && b.start !== null) {
        const hrInt = Math.floor(b.start)
        const hrStr = `${String(hrInt).padStart(2, '0')}:00`
        if (counts[hrStr] !== undefined) {
          counts[hrStr] += 1
        }
      }
    })
    const list = Object.entries(counts).map(([hour, Bookings]) => ({ hour, Bookings }))
    const hasData = Object.values(counts).some(c => c > 0)
    return hasData ? list : [
      { hour: '09:00', Bookings: 1 },
      { hour: '10:00', Bookings: 3 },
      { hour: '11:00', Bookings: 2 },
      { hour: '14:00', Bookings: 4 },
      { hour: '15:00', Bookings: 1 }
    ]
  }, [bookings])

  // 3. Dynamic maintenance frequency by category
  const maintenanceFreq = useMemo(() => {
    const counts = {}
    tickets.forEach(t => {
      const asset = assets.find(a => a.tag === t.assetTag || a.id === t.assetId)
      const cat = asset?.category || t.category || 'General'
      counts[cat] = (counts[cat] || 0) + 1
    })
    const list = Object.entries(counts).map(([category, requests]) => ({ category, requests }))
    return list.length > 0 ? list.sort((a, b) => b.requests - a.requests) : [
      { category: 'Laptop', requests: 4 },
      { category: 'Projector', requests: 1 },
      { category: 'Vehicle', requests: 1 }
    ]
  }, [tickets, assets])

  // 4. Dynamic Idle Assets (Unallocated)
  const idleAssetsList = useMemo(() => {
    return assets.filter(a => a.status === 'Available' || a.status === 'available').slice(0, 5)
  }, [assets])

  // 5. Dynamic Retirement & Maintenance Alert Radar
  const retirementAlerts = useMemo(() => {
    return assets.filter(a => {
      // Condition Poor, status Lost, or age > 2 years
      const isPoor = a.condition?.toLowerCase() === 'poor' || a.condition?.toLowerCase() === 'damaged'
      const isLost = a.status?.toLowerCase() === 'lost'
      const isOld = a.acquisitionDate ? (new Date().getFullYear() - new Date(a.acquisitionDate).getFullYear() >= 2) : false
      return isPoor || isLost || isOld
    }).slice(0, 5)
  }, [assets])

  // 6. CSV Export Trigger
  const exportCSV = (type) => {
    let headers = []
    let rows = []
    let filename = ''

    if (type === 'assets') {
      filename = `AssetFlow_Inventory_${new Date().toISOString().slice(0,10)}.csv`
      headers = ['Tag', 'Name', 'Category', 'Status', 'Location', 'Serial', 'Cost', 'Acquisition Date', 'Allocated To']
      rows = assets.map(a => [a.tag, a.name, a.category, a.status, a.location, a.serial, a.acquisitionCost, a.acquisitionDate, a.allocatedTo || 'Unallocated'])
    } else if (type === 'bookings') {
      filename = `AssetFlow_Bookings_${new Date().toISOString().slice(0,10)}.csv`
      headers = ['ID', 'Asset Name', 'Asset Tag', 'User', 'Start Time (Hour)', 'End Time (Hour)', 'Status']
      rows = bookings.map(b => [b.id, b.assetName, b.assetTag, b.user, b.start, b.end, b.status])
    } else if (type === 'maintenance') {
      filename = `AssetFlow_Maintenance_${new Date().toISOString().slice(0,10)}.csv`
      headers = ['ID', 'Asset Name', 'Asset Tag', 'Issue', 'Priority', 'Status', 'Raised By', 'Assigned Tech', 'Date']
      rows = tickets.map(t => [t.id, t.assetName, t.assetTag, t.issue, t.priority, t.status, t.raisedBy, t.tech || 'Unassigned', t.date])
    }

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported successfully.`)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Live operational stats, resource allocation insights, and exportable tracking logs.</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', val: totalCount, icon: Boxes, tone: 'sky' },
          { label: 'Active Allocations', val: allocatedCount, icon: UserPlus, tone: 'indigo' },
          { label: 'Utilization Rate', val: `${utilizationRate}%`, icon: TrendingUp, tone: 'emerald' },
          { label: 'Active Repairs', val: activeMaintCount, icon: Wrench, tone: 'amber' }
        ].map((card, idx) => {
          const Icon = card.icon
          const colorClasses = {
            sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
            indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
            emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }[card.tone]

          return (
            <Card key={idx} className="rounded-2xl border-border p-4 bg-card flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-semibold text-muted-foreground block">{card.label}</span>
                <span className="text-2xl font-bold mt-1 block">{card.val}</span>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${colorClasses}`}>
                <Icon className="w-5 h-5" />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Utilization by Department */}
        <Card className="rounded-2xl border-border p-5 bg-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-sky-500" /> Allocations by Department</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationByDept} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Booking Heatmap */}
        <Card className="rounded-2xl border-border p-5 bg-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500" /> Booking Heatmap (Peak Hours)</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingHeatmap} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="Bookings" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Maintenance Categories */}
        <Card className="rounded-2xl border-border p-5 bg-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Wrench className="w-4 h-4 text-amber-500" /> Maintenance by Category</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceFreq} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="requests" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Information Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Idle Assets List */}
        <Card className="rounded-2xl border-border p-5 bg-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-rose-500" /> Idle / Available Assets</h3>
              <p className="text-xs text-muted-foreground">Unallocated assets ready for deployment.</p>
            </div>
            <Badge className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20">{idleAssetsList.length} listed</Badge>
          </div>
          <div className="divide-y divide-border">
            {idleAssetsList.map((a) => (
              <div key={a.id} className="py-2.5 flex items-center justify-between text-xs hover:bg-muted/10 transition-colors">
                <div>
                  <span className="font-semibold text-sm">{a.name}</span>
                  <span className="font-mono text-[10px] text-sky-500 ml-2">({a.tag})</span>
                  <p className="text-muted-foreground text-[10px] mt-0.5">{a.category} • Location: {a.location}</p>
                </div>
                <Badge variant="outline" className="capitalize text-[10px] border-emerald-500/20 text-emerald-600 bg-emerald-500/5">Available</Badge>
              </div>
            ))}
            {idleAssetsList.length === 0 && (
              <div className="text-center py-8 text-xs text-muted-foreground">No idle assets found.</div>
            )}
          </div>
        </Card>

        {/* Retirement Alert Radar */}
        <Card className="rounded-2xl border-border p-5 bg-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Retirement & Condition Radar</h3>
              <p className="text-xs text-muted-foreground">Assets with Poor/Damaged condition or age &gt; 2 years.</p>
            </div>
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">{retirementAlerts.length} warnings</Badge>
          </div>
          <div className="divide-y divide-border">
            {retirementAlerts.map((a) => {
              const ageYears = a.acquisitionDate ? (new Date().getFullYear() - new Date(a.acquisitionDate).getFullYear()) : 0
              const isOld = ageYears >= 2
              return (
                <div key={a.id} className="py-2.5 flex items-center justify-between text-xs hover:bg-muted/10 transition-colors">
                  <div>
                    <span className="font-semibold text-sm">{a.name}</span>
                    <span className="font-mono text-[10px] text-sky-500 ml-2">({a.tag})</span>
                    <p className="text-muted-foreground text-[10px] mt-0.5">Condition: <strong className="text-foreground">{a.condition || 'Fair'}</strong> | Age: {ageYears} yrs</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] border-rose-500/20 text-rose-600 bg-rose-500/5`}>
                    {isOld ? 'Old Stock' : 'Check Condition'}
                  </Badge>
                </div>
              )
            })}
            {retirementAlerts.length === 0 && (
              <div className="text-center py-8 text-xs text-muted-foreground">No warnings flagged.</div>
            )}
          </div>
        </Card>
      </div>

      {/* Export Center Card */}
      <Card className="rounded-2xl border-border p-5 bg-card">
        <h3 className="font-semibold mb-2 flex items-center gap-2"><Download className="w-4 h-4 text-sky-500" /> Exportable Data Center</h3>
        <p className="text-xs text-muted-foreground mb-4">Export customized workspace reports as standardized CSV logs.</p>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={() => exportCSV('assets')} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs h-9 active:scale-[0.98] transition-all">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Inventory CSV
          </Button>
          <Button onClick={() => exportCSV('bookings')} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs h-9 active:scale-[0.98] transition-all">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Bookings CSV
          </Button>
          <Button onClick={() => exportCSV('maintenance')} className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs h-9 active:scale-[0.98] transition-all">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Repair Log CSV
          </Button>
        </div>
      </Card>
    </div>
  )
}

/* ---------------- Logs ---------------- */

function timeAgo(dateStr) {
  if (!dateStr) return 'Unknown time'
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.floor(h / 24)
  if (d === 1) return 'Yesterday'
  if (d < 30) return `${d} days ago`
  return new Date(dateStr).toLocaleDateString()
}

const TYPE_CONFIG = {
  allocation: { label: 'Asset Assigned', tone: 'emerald', icon: 'user-plus' },
  booking:    { label: 'Booking',         tone: 'indigo',  icon: 'calendar' },
  maintenance:{ label: 'Maintenance',     tone: 'amber',   icon: 'wrench' },
  transfer:   { label: 'Transfer',        tone: 'amber',   icon: 'arrow-left-right' },
  alert:      { label: 'Alert',           tone: 'rose',    icon: 'alert-triangle' },
  audit:      { label: 'Audit',           tone: 'neutral', icon: 'clipboard-check' },
  return:     { label: 'Return',          tone: 'neutral', icon: 'undo-2' },
}

function LogsScreen({ activityLog = [], user, role, onMarkAllRead }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [readIds, setReadIds] = useState(new Set(
    (activityLog || []).filter(a => a && !a.unread).map(a => a.id).filter(Boolean)
  ))
  const [dbLogs, setDbLogs] = useState([])
  const [loadingDb, setLoadingDb] = useState(false)

  const markRead = (id) => {
    if (!id) return
    setReadIds(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const markAllRead = () => {
    const allIds = (activityLog || []).map(a => a?.id).filter(Boolean)
    setReadIds(new Set(allIds))
    onMarkAllRead?.()
  }

  const isUnread = (a) => a && a.unread && !readIds.has(a.id)

  useEffect(() => {
    async function fetchLogs() {
      const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-project')
      if (isPlaceholder) return

      setLoadingDb(true)
      try {
        const [allocRes, transferRes, bookingRes] = await Promise.all([
          supabase.from('allocations').select('created_at, asset:assets(asset_tag, name), employee:profiles!allocations_assigned_to_employee_id_fkey(name)').order('created_at', { ascending: false }).limit(20),
          supabase.from('transfer_requests').select('created_at, status, asset:assets(asset_tag, name), from_emp:profiles!transfer_requests_from_employee_id_fkey(name), to_emp:profiles!transfer_requests_to_employee_id_fkey(name)').eq('status', 'Approved').order('created_at', { ascending: false }).limit(20),
          supabase.from('bookings').select('created_at, start_time, end_time, asset:assets(asset_tag, name), user:profiles(name)').in('status', ['Upcoming', 'Ongoing']).order('created_at', { ascending: false }).limit(20)
        ])

        let merged = []
        if (allocRes.data) {
          merged.push(...allocRes.data.map(a => ({
            id: `alloc-${a.created_at}-${Math.random()}`,
            type: 'allocation',
            text: `Asset ${a.asset?.asset_tag} (${a.asset?.name}) allocated to ${a.employee?.name || 'Department'}`,
            time: timeAgo(a.created_at),
            ts: new Date(a.created_at).getTime(),
            icon: 'user-plus',
            unread: false
          })))
        }
        if (transferRes.data) {
          merged.push(...transferRes.data.map(t => ({
            id: `tx-${t.created_at}-${Math.random()}`,
            type: 'transfer',
            text: `Transfer approved: ${t.asset?.asset_tag} from ${t.from_emp?.name} to ${t.to_emp?.name}`,
            time: timeAgo(t.created_at),
            ts: new Date(t.created_at).getTime(),
            icon: 'arrow-left-right',
            unread: false
          })))
        }
        if (bookingRes.data) {
          merged.push(...bookingRes.data.map(b => ({
            id: `bk-${b.created_at}-${Math.random()}`,
            type: 'booking',
            text: `Resource ${b.asset?.asset_tag} booked by ${b.user?.name}`,
            time: timeAgo(b.created_at),
            ts: new Date(b.created_at).getTime(),
            icon: 'calendar',
            unread: false
          })))
        }
        setDbLogs(merged)
      } catch (err) {
        console.warn('Failed to fetch dynamic DB logs:', err)
      } finally {
        setLoadingDb(false)
      }
    }
    fetchLogs()
  }, [])

  const allLogs = useMemo(() => {
    const merged = [...activityLog]
    dbLogs.forEach(dl => {
      if (!merged.some(ml => ml.text === dl.text)) {
        merged.push(dl)
      }
    })
    return merged
  }, [activityLog, dbLogs])

  try {
    // Role-based filter: employees only see their own notifications
    const roleFiltered = (role === 'admin' || role === 'Asset Manager')
      ? (allLogs || []).filter(Boolean)
      : (allLogs || []).filter(Boolean).filter(a => a.recipient === user?.name || a.recipient === 'all' || a.actor === user?.name)

    const typeFiltered = roleFiltered.filter((a) => {
      if (!a) return false
      if (filter === 'all') return true
      if (filter === 'alerts') return a.type === 'alert'
      if (filter === 'bookings') return a.type === 'booking'
      if (filter === 'maintenance') return a.type === 'maintenance'
      if (filter === 'transfers') return a.type === 'transfer'
      if (filter === 'allocations') return a.type === 'allocation'
      if (filter === 'audit') return a.type === 'audit'
      if (filter === 'returns') return a.type === 'return'
      return true
    })

    const finalFiltered = search.trim()
      ? typeFiltered.filter(a => 
          (a.text || '').toLowerCase().includes(search.toLowerCase()) || 
          (a.actor || '').toLowerCase().includes(search.toLowerCase()) || 
          (a.recipient || '').toLowerCase().includes(search.toLowerCase())
        )
      : typeFiltered

    const unreadCount = roleFiltered.filter(a => isUnread(a)).length

    const TABS = [
      { key: 'all',          label: 'All',         count: roleFiltered.length },
      { key: 'alerts',       label: '🔴 Alerts',   count: roleFiltered.filter(a => a?.type === 'alert').length },
      { key: 'allocations',  label: 'Assignments', count: roleFiltered.filter(a => a?.type === 'allocation').length },
      { key: 'bookings',     label: 'Bookings',    count: roleFiltered.filter(a => a?.type === 'booking').length },
      { key: 'maintenance',  label: 'Maintenance', count: roleFiltered.filter(a => a?.type === 'maintenance').length },
      { key: 'transfers',    label: 'Transfers',   count: roleFiltered.filter(a => a?.type === 'transfer').length },
      { key: 'returns',      label: 'Returns',     count: roleFiltered.filter(a => a?.type === 'return').length },
      { key: 'audit',        label: 'Audit',       count: roleFiltered.filter(a => a?.type === 'audit').length },
    ]

    return (
      <div className="p-6 lg:p-8 space-y-6 max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Activity Logs & Notifications</h1>
            <p className="text-muted-foreground text-sm mt-1">Full audit trail — every action across your workspace, filtered for your role.</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs font-semibold text-sky-500 hover:text-sky-600 border border-sky-500/30 rounded-lg px-3 py-1.5 hover:bg-sky-500/5 transition-colors">
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>

        {/* Unread banner */}
        {unreadCount > 0 && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
              <Bell className="w-4 h-4 text-sky-500" />
            </div>
            <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
              You have <strong>{unreadCount}</strong> unread notification{unreadCount > 1 ? 's' : ''}
            </span>
          </motion.div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by message, actor, or recipient…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filter === t.key
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-500/20'
                  : 'text-muted-foreground border-border hover:border-sky-500/40 hover:text-foreground'
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  filter === t.key ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                }`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Log list */}
        <Card className="rounded-2xl border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {finalFiltered.map((a, i) => {
              if (!a) return null
              const cfg = TYPE_CONFIG[a.type] ?? TYPE_CONFIG.allocation
              const Icon = ICON_MAP[a.icon] ?? ICON_MAP[cfg.icon] ?? Sparkles
              const unread = isUnread(a)
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025, duration: 0.22 }}
                  onClick={() => markRead(a.id)}
                  className={`flex gap-3 px-5 py-4 cursor-pointer hover:bg-muted/40 transition-colors ${
                    unread ? 'bg-sky-500/[0.03] border-l-2 border-sky-500' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${TONE_STYLES[cfg.tone]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`text-sm leading-snug ${unread ? 'font-semibold' : ''}`}>{a.text}</div>
                      {unread && <span className="mt-1 w-2 h-2 rounded-full bg-sky-500 shrink-0" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5">
                      <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        a.type === 'alert'       ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400' :
                        a.type === 'maintenance' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400' :
                        a.type === 'booking'     ? 'bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400' :
                        a.type === 'transfer'    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400' :
                        a.type === 'audit'       ? 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400' :
                        a.type === 'return'      ? 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400' :
                        'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                      }`}>{cfg.label}</span>
                      {a.actor && a.actor !== 'System' && (
                        <span className="text-[11px] text-muted-foreground">
                          by <span className="font-medium text-foreground">{a.actor}</span>
                        </span>
                      )}
                      {a.actor === 'System' && <span className="text-[11px] text-muted-foreground">Automated</span>}
                      <span className="text-[11px] text-muted-foreground">•</span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />{a.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
            {finalFiltered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No activity matches</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {search ? `No results for "${search}"` : 'Try a different filter'}
                </p>
              </div>
            )}
          </div>
        </Card>

        {finalFiltered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Showing {finalFiltered.length} of {roleFiltered.length} events
            {role === 'employee' ? ' (filtered to your activity)' : ''}
          </p>
        )}
      </div>
    )
  } catch (renderError) {
    console.error('LogsScreen Render Error caught:', renderError)
    return (
      <div className="p-8 text-center text-red-500 border border-red-500/20 rounded-2xl bg-red-500/5 max-w-[600px] mx-auto mt-10">
        <h2 className="text-lg font-semibold mb-2">Something went wrong rendering notifications</h2>
        <p className="text-xs font-mono bg-background p-4 rounded-lg border border-border overflow-x-auto text-left whitespace-pre-wrap">{renderError.stack || renderError.message}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600">Reload Page</button>
      </div>
    )
  }
}

/* ---------------- Org ---------------- */

function OrgScreen({ onDataChanged }) {
  const [departments, setDepartments] = useState([])
  const [profiles, setProfiles] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [addDeptOpen, setAddDeptOpen] = useState(false)
  const [editDept, setEditDept] = useState(null)
  const [addCatOpen, setAddCatOpen] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editEmp, setEditEmp] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-project') || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-supabase')
      if (isPlaceholder) {
        throw new Error('Supabase using placeholder credentials')
      }

      const [deptRes, profRes, catRes] = await Promise.all([
        supabase.from('departments').select('*, head:profiles!head_id(id, name), profiles!profiles_department_id_fkey(count)').order('name'),
        supabase.from('profiles').select('*, department:departments!profiles_department_id_fkey(name)').eq('status', 'Active').order('name'),
        supabase.from('asset_categories').select('*').order('name')
      ])

      if (deptRes.error || profRes.error || catRes.error) {
        throw new Error('Supabase query error')
      }

      setDepartments(deptRes.data || [])
      setProfiles(profRes.data || [])
      setCategories(catRes.data || [])
    } catch (err) {
      console.warn('OrgScreen falling back to local mock data:', err.message)
      
      setDepartments(DEPARTMENTS || [])
      
      const mockProfiles = EMPLOYEES.map(e => ({
        id: e.id,
        name: e.name,
        email: `${e.name.toLowerCase().replace(' ', '')}@assetflow.com`,
        role: e.role,
        department: { name: e.dept }
      }))
      setProfiles(mockProfiles)

      const mockCategories = CATEGORIES.map((c, idx) => ({ id: `cat-${idx}`, name: c }))
      setCategories(mockCategories)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddDept = async (deptData) => {
    if (editDept) {
      const { error } = await supabase.from('departments').update(deptData).eq('id', editDept.id)
      if (error) { toast.error('Failed to update: ' + error.message); return false }
      toast.success('Department updated')
    } else {
      const { error } = await supabase.from('departments').insert([deptData])
      if (error) { toast.error('Failed to create: ' + error.message); return false }
      toast.success('Department created')
    }
    loadData()
    if (onDataChanged) onDataChanged()
    setAddDeptOpen(false)
    return true
  }

  const handleSaveCat = async (catData) => {
    if (editCat) {
      const { error } = await supabase.from('asset_categories').update(catData).eq('id', editCat.id)
      if (error) { toast.error('Failed to update category: ' + error.message); return false }
      toast.success('Category updated')
    } else {
      const { error } = await supabase.from('asset_categories').insert([catData])
      if (error) { toast.error('Failed to create category: ' + error.message); return false }
      toast.success('Category created')
    }
    loadData()
    if (onDataChanged) onDataChanged()
    setAddCatOpen(false)
    return true
  }

  const handleDeleteCat = async (id) => {
    if (!window.confirm('Are you sure you want to remove this category?')) return
    const { error } = await supabase.from('asset_categories').delete().eq('id', id)
    if (error) { toast.error('Failed to remove: ' + error.message); return }
    toast.success('Category removed')
    loadData()
    if (onDataChanged) onDataChanged()
  }

  const handleSaveEmp = async (empData) => {
    if (editEmp) {
      const { error } = await supabase.from('profiles').update(empData).eq('id', editEmp.id)
      if (error) { toast.error('Failed to update employee: ' + error.message); return false }
      toast.success('Employee updated')
    } else {
      const { error } = await supabase.from('profiles').insert([empData])
      if (error) { toast.error('Failed to add employee: ' + error.message); return false }
      toast.success('Employee added')
    }
    loadData()
    if (onDataChanged) onDataChanged()
    setInviteOpen(false)
    return true
  }

  const handleDeleteEmp = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate and remove this employee?')) return
    const { error } = await supabase.from('profiles').update({ status: 'Inactive' }).eq('id', id)
    if (error) { toast.error('Failed to remove: ' + error.message); return }
    toast.success('Employee removed')
    loadData()
    if (onDataChanged) onDataChanged()
  }

  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.split(' ')
    return parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase()
  }

  const DepartmentNode = ({ dept, depth = 0 }) => {
    const children = departments.filter(d => d.parent_department_id === dept.id)
    return (
      <div className="space-y-2">
        <div className={`rounded-xl border border-border p-3 flex items-center gap-3 ${depth > 0 ? 'bg-muted/30' : ''}`} style={{ marginLeft: `${depth * 28}px` }}>
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
            {depth > 0 ? <ChevronRight className="w-4 h-4 opacity-50" /> : <Building2 className="w-4 h-4" />}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">{dept.name} <Badge variant={dept.status === 'Active' ? 'outline' : 'secondary'} className="ml-2 text-[10px]">{dept.status}</Badge></div>
            <div className="text-xs text-muted-foreground">Head: {dept.head?.name || 'Unassigned'}</div>
          </div>
          <Badge variant="outline" className="border-border">{dept.profiles?.[0]?.count || 0} members</Badge>
          <Button variant="ghost" size="icon" onClick={() => { setEditDept(dept); setAddDeptOpen(true) }} className="text-sky-500 hover:text-sky-600 hover:bg-sky-500/10 h-8 w-8 ml-2">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteDept(dept.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-8 w-8 ml-1">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        {children.length > 0 && (
          <div className="space-y-2">
            {children.map(child => <DepartmentNode key={child.id} dept={child} depth={depth + 1} />)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Organization Setup</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure departments, categories and employee roles.</p>
      </div>
      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="bg-muted/50 border border-border p-1 rounded-lg">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="employees">Employee Directory</TabsTrigger>
        </TabsList>
        <TabsContent value="departments" className="mt-4">
          <Card className="rounded-2xl border-border p-5 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Hierarchy</h3>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg" onClick={() => { setEditDept(null); setAddDeptOpen(true) }}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Dept
              </Button>
            </div>
            <div className="space-y-2">
              {loading ? (
                <div className="text-sm text-muted-foreground p-4 text-center">Loading departments...</div>
              ) : (
                departments.filter(d => !d.parent_department_id).map((d) => (
                  <DepartmentNode key={d.id} dept={d} depth={0} />
                ))
              )}
              {departments.length === 0 && !loading && <div className="text-sm text-muted-foreground p-4 text-center">No departments yet.</div>}
            </div>
          </Card>
          
          <DepartmentDialog 
            open={addDeptOpen} 
            onClose={() => setAddDeptOpen(false)} 
            onSave={handleAddDept}
            profiles={profiles}
            departments={departments}
            dept={editDept}
          />
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <Card className="rounded-2xl border-border p-5 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Asset Categories & Custom Fields</h3>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg" onClick={() => { setEditCat(null); setAddCatOpen(true) }}>
                <Plus className="w-3.5 h-3.5 mr-1" /> New Category
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {loading ? <div className="text-sm text-muted-foreground p-4 text-center col-span-full">Loading categories...</div> : categories.map((c) => (
                <div key={c.id} className="rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center"><Layers className="w-3.5 h-3.5" /></div>
                      <div className="font-medium">{c.name}</div>
                    </div>
                    <div className="flex">
                      <Button variant="ghost" size="icon" onClick={() => { setEditCat(c); setAddCatOpen(true) }} className="text-sky-500 hover:text-sky-600 hover:bg-sky-500/10 h-6 w-6">
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCat(c.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-6 w-6">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {c.metadata_schema?.fields?.length ? `Custom fields: ${c.metadata_schema.fields.join(', ')}` : 'No custom fields defined'}
                  </div>
                </div>
              ))}
              {categories.length === 0 && !loading && <div className="text-sm text-muted-foreground p-4 text-center col-span-full">No categories yet.</div>}
            </div>
          </Card>
          
          <CategoryDialog 
            open={addCatOpen} 
            onClose={() => setAddCatOpen(false)} 
            onSave={handleSaveCat}
            cat={editCat}
          />
        </TabsContent>
        <TabsContent value="employees" className="mt-4">
          <Card className="rounded-2xl border-border p-5 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Employee Directory</h3>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg" onClick={() => { setEditEmp(null); setInviteOpen(true) }}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Employee
              </Button>
            </div>
            <div className="space-y-2">
              {loading ? <div className="text-sm text-muted-foreground p-4 text-center">Loading employees...</div> : profiles.map((e) => (
                <div key={e.id} className="rounded-xl border border-border p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(e.name)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{e.name}</div>
                    <div className="text-xs text-muted-foreground">{e.department?.name || 'Unassigned'}</div>
                  </div>
                  <Badge variant="secondary" className="font-normal">{e.role}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => { setEditEmp(e); setInviteOpen(true) }} className="text-sky-500 hover:text-sky-600 hover:bg-sky-500/10 h-8 w-8 ml-2">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteEmp(e.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-8 w-8 ml-1">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {profiles.length === 0 && !loading && <div className="text-sm text-muted-foreground p-4 text-center">No employees yet.</div>}
            </div>
          </Card>
          
          <EmployeeDialog 
            open={inviteOpen} 
            onClose={() => setInviteOpen(false)} 
            onSave={handleSaveEmp}
            departments={departments}
            emp={editEmp}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ---------------- Register + Maintenance dialogs ---------------- */

function RegisterAssetDialog({ open, onClose, onAdd, categories = [] }) {
  const [name, setName] = useState('')
  const [tag, setTag] = useState('')
  const [categoryId, setCategoryId] = useState('none')
  const [serial, setSerial] = useState('')
  const [location, setLocation] = useState('')
  const [acqDate, setAcqDate] = useState('')
  const [acqCost, setAcqCost] = useState('')
  const [condition, setCondition] = useState('New')
  const [photoUrl, setPhotoUrl] = useState('')
  const [isBookable, setIsBookable] = useState(false)
  const [status, setStatus] = useState('Available')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setTag('AF-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'))
    }
  }, [open])

  const submit = async () => {
    if (!name || !serial || categoryId === 'none') { toast.error('Name, Category, and Serial are required.'); return }
    setLoading(true)
    const success = await onAdd({
      asset_tag: tag,
      name,
      category_id: categoryId,
      serial_number: serial,
      location,
      acquisition_date: acqDate || null,
      acquisition_cost: acqCost ? parseFloat(acqCost) : null,
      condition,
      photo_url: photoUrl || null,
      is_shared_bookable: isBookable,
      status: status
    })
    setLoading(false)
    if (success) {
      setName(''); setCategoryId('none'); setSerial(''); setLocation(''); setAcqDate(''); setAcqCost(''); setPhotoUrl(''); setIsBookable(false); setCondition('New'); setStatus('Available');
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden border-border bg-card max-h-[90vh] overflow-y-auto">
        <div className="p-6 pb-4 border-b border-border bg-muted/20">
          <DialogTitle className="text-xl font-bold tracking-tight">Register New Asset</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Fill out the details to add a new asset to the registry.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1.5 block">Asset Tag (Auto-Generated)</label><Input value={tag} disabled className="h-10 rounded-lg bg-muted/50 font-mono text-sky-500 font-medium" /></div>
            <div><label className="text-sm font-medium mb-1.5 block">Asset Name *</label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. MacBook Pro 16"' className="h-10 rounded-lg" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Category *</label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" disabled>Select Category</SelectItem>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><label className="text-sm font-medium mb-1.5 block">Serial Number *</label><Input value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="e.g. C02XF1YZLVDL" className="h-10 rounded-lg" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1.5 block">Acquisition Date</label><Input type="date" value={acqDate} onChange={(e) => setAcqDate(e.target.value)} className="h-10 rounded-lg" /></div>
            <div><label className="text-sm font-medium mb-1.5 block">Acquisition Cost</label><Input type="number" step="0.01" value={acqCost} onChange={(e) => setAcqCost(e.target.value)} placeholder="e.g. 1999.00" className="h-10 rounded-lg" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Condition</label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><label className="text-sm font-medium mb-1.5 block">Location</label><Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. HQ - IT Store" className="h-10 rounded-lg" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1.5 block">Photo URL (Optional)</label><Input type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." className="h-10 rounded-lg" /></div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Allocated">Allocated</SelectItem>
                  <SelectItem value="In Maintenance">In Maintenance</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20 cursor-pointer">
            <input type="checkbox" checked={isBookable} onChange={(e) => setIsBookable(e.target.checked)} className="w-4 h-4 rounded border-border" />
            <div className="flex-1">
              <div className="text-sm font-medium">Shared / Bookable Resource</div>
              <div className="text-xs text-muted-foreground">Allow employees to book this asset temporarily.</div>
            </div>
          </label>
        </div>
        <div className="p-6 pt-0 border-t border-border mt-2 bg-muted/10 flex justify-end gap-3 rounded-b-2xl">
          <Button variant="outline" onClick={onClose} className="rounded-lg mt-6">Cancel</Button>
          <Button onClick={submit} disabled={loading} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg mt-6">
            {loading ? 'Registering...' : 'Register Asset'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EmployeeDialog({ open, onClose, onSave, departments, emp }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Employee')
  const [departmentId, setDepartmentId] = useState('none')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      if (emp) {
        setName(emp.name || '')
        setEmail(emp.email || '')
        setRole(emp.role || 'Employee')
        setDepartmentId(emp.department_id || 'none')
      } else {
        setName('')
        setEmail('')
        setRole('Employee')
        setDepartmentId('none')
      }
    }
  }, [open, emp])

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    const success = await onSave({ 
      name, 
      email, 
      role, 
      department_id: departmentId === 'none' ? null : departmentId,
      status: 'Active'
    })
    setLoading(false)
    if (success) {
      setName('')
      setEmail('')
      setRole('Employee')
      setDepartmentId('none')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl p-0 overflow-hidden border-border bg-card">
        <div className="p-6 pb-4 border-b border-border bg-muted/20">
          <DialogTitle className="text-xl font-bold tracking-tight">{emp ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{emp ? 'Update employee details and role.' : 'Add a new employee to the directory.'}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Full Name</label>
            <Input className="h-10 rounded-lg" placeholder="e.g. John Doe" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email Address</label>
            <Input type="email" className="h-10 rounded-lg" placeholder="e.g. john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Asset Manager">Asset Manager</SelectItem>
                  <SelectItem value="Department Head">Department Head</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Department</label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="p-6 pt-4 border-t border-border bg-muted/20 flex justify-end gap-2">
          <Button variant="outline" className="rounded-xl h-10" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl h-10" onClick={handleSubmit} disabled={!name.trim() || !email.trim() || loading}>
            {loading ? 'Saving...' : emp ? 'Save Changes' : 'Add Employee'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CategoryDialog({ open, onClose, onSave, cat }) {
  const [name, setName] = useState('')
  const [customFields, setCustomFields] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      if (cat) {
        setName(cat.name)
        setCustomFields(cat.metadata_schema?.fields?.join(', ') || '')
      } else {
        setName('')
        setCustomFields('')
      }
    }
  }, [open, cat])

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)
    const schema = customFields ? { fields: customFields.split(',').map(f => f.trim()).filter(Boolean) } : null
    const success = await onSave({ name, metadata_schema: schema })
    setLoading(false)
    if (success) {
      setName('')
      setCustomFields('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl p-0 overflow-hidden border-border bg-card">
        <div className="p-6 pb-4 border-b border-border bg-muted/20">
          <DialogTitle className="text-xl font-bold tracking-tight">{cat ? 'Edit Asset Category' : 'New Asset Category'}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{cat ? 'Update category details and attributes.' : 'Define a new category and its specific attributes.'}</p>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Category Name</label>
            <Input className="h-10 rounded-lg" placeholder="e.g. Server, Software License" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Custom Fields (Optional)</label>
            <Input className="h-10 rounded-lg" placeholder="e.g. RAM, Storage, License Key" value={customFields} onChange={e => setCustomFields(e.target.value)} />
            <p className="text-[10px] text-muted-foreground mt-1.5">Comma separated list of fields specific to this category.</p>
          </div>
        </div>
        <div className="p-6 pt-4 border-t border-border bg-muted/20 flex justify-end gap-2">
          <Button variant="outline" className="rounded-xl h-10" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl h-10" onClick={handleSubmit} disabled={!name.trim() || loading}>
            {loading ? 'Saving...' : cat ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function RaiseMaintenanceDialog({ open, onClose, assets, onRaise }) {
  const [assetId, setAssetId] = useState('')
  const [issue, setIssue] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const fileRef = useState(null)

  useEffect(() => {
    if (open) {
      setAssetId(assets[0]?.id ?? '')
      setIssue('')
      setPriority('Medium')
      setPhotoUrl('')
      setPhotoPreview('')
    }
  }, [open, assets])

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setPhotoPreview(ev.target.result); setPhotoUrl(ev.target.result) }
    reader.readAsDataURL(file)
  }

  const submit = () => {
    if (!issue.trim()) { toast.error('Please describe the issue.'); return }
    if (!assetId) { toast.error('Please select an asset.'); return }
    const asset = assets.find((a) => a.id === assetId)
    onRaise(asset, issue, priority, photoUrl)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Wrench className="w-5 h-5 text-amber-500" /> Raise Maintenance Request</DialogTitle>
          <DialogDescription>Describe the issue and set priority. Your request goes to Pending for Asset Manager approval.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-1">
          {/* Asset selection */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Asset *</label>
            <Select value={assetId} onValueChange={setAssetId}>
              <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder="Select an asset…" /></SelectTrigger>
              <SelectContent>
                {assets.map((a) => <SelectItem key={a.id} value={a.id}>{a.tag} — {a.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Issue description */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Issue Description *</label>
            <Textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              rows={4}
              placeholder="Describe the fault in detail — e.g. 'Screen flickering at startup, battery drains in 2 hours'"
              className="rounded-lg resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Priority</label>
            <div className="flex gap-2">
              {['High','Medium','Low'].map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    priority === p
                      ? p === 'High' ? 'bg-rose-500 text-white border-rose-500'
                        : p === 'Medium' ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-500 text-white border-slate-500'
                      : 'border-border text-muted-foreground hover:border-sky-500/40'
                  }`}
                >{p}</button>
              ))}
            </div>
          </div>

          {/* Photo attachment */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Attach Photo (Optional)</label>
            <label className="flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed border-border bg-muted/20 cursor-pointer hover:border-sky-500/40 hover:bg-sky-500/5 transition-colors">
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              {photoPreview ? (
                <img src={photoPreview} alt="preview" className="h-full w-full object-cover rounded-xl" />
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Click to attach a photo of the issue</p>
                </>
              )}
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
          <Button onClick={submit} className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg">
            <Wrench className="w-4 h-4 mr-1.5" /> Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ---------------- App root ---------------- */

function DepartmentDialog({ open, onClose, onSave, profiles, departments, dept }) {
  const [name, setName] = useState('')
  const [headId, setHeadId] = useState('none')
  const [parentId, setParentId] = useState('none')
  const [status, setStatus] = useState('Active')

  useEffect(() => {
    if (open) {
      if (dept) {
        setName(dept.name)
        setHeadId(dept.head?.id || dept.head_id || 'none')
        setParentId(dept.parent_department_id || 'none')
        setStatus(dept.status)
      } else {
        setName(''); setHeadId('none'); setParentId('none'); setStatus('Active')
      }
    }
  }, [open, dept])

  const submit = async () => {
    if (!name.trim()) { toast.error('Name is required'); return }
    await onSave({
      name,
      head_id: headId === 'none' ? null : headId,
      parent_department_id: parentId === 'none' ? null : parentId,
      status
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>{dept ? 'Edit Department' : 'Add Department'}</DialogTitle>
          <DialogDescription>{dept ? 'Update the department details.' : 'Create a new department in the organization.'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div><label className="text-sm font-medium mb-1.5 block">Name</label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Engineering' className="h-10 rounded-lg" /></div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Department Head (Optional)</label>
            <Select value={headId} onValueChange={setHeadId}>
              <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.role})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Parent Department (Optional)</label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top Level)</SelectItem>
                {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
          <Button onClick={submit} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg">{dept ? 'Save Changes' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function App() {
  const [view, setView] = useState('auth') // 'auth' | 'app'
  const [authMode, setAuthMode] = useState('login')
  const [currentUser, setCurrentUser] = useState(null)
  const [active, setActive] = useState('dashboard')
  const [role, setRole] = useState('employee')
  const [theme, setTheme] = useState('light')
  const [mobileOpen, setMobileOpen] = useState(false)

  const [assets, setAssets] = useState([])
  const [categories, setCategories] = useState([])
  const [profiles, setProfiles] = useState([])
  const [departments, setDepartments] = useState([])
  const [bookings, setBookings] = useState([])
  const [tickets, setTickets] = useState([])
  const [transfers, setTransfers] = useState([])
  const [loadingApp, setLoadingApp] = useState(true)

  const [allocateAsset, setAllocateAsset] = useState(null)
  const [genericAllocateOpen, setGenericAllocateOpen] = useState(false)
  const [returnAsset, setReturnAsset] = useState(null)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [maintOpen, setMaintOpen] = useState(false)

  // Activity log — seeded from mock data, extended live by user actions
  const [activityLog, setActivityLog] = useState([...ACTIVITY])
  const addLog = (type, text, actor, recipient = 'all') => {
    const iconMap = { allocation: 'user-plus', booking: 'calendar', maintenance: 'wrench', transfer: 'arrow-left-right', alert: 'alert-triangle', audit: 'clipboard-check', return: 'undo-2' }
    setActivityLog(prev => [{
      id: `live-${Date.now()}`,
      type,
      text,
      time: 'Just now',
      icon: iconMap[type] ?? 'user-plus',
      actor: actor ?? 'Unknown',
      recipient,
      category: type,
      unread: true,
    }, ...prev])
  }

  const loadGlobalData = async () => {
    setLoadingApp(true)
    try {
      const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-project')
      if (isPlaceholder) {
        throw new Error('Supabase using placeholder credentials')
      }

      const [assetsRes, catRes, allocRes, profRes, maintRes, transRes, deptRes, bookingsRes] = await Promise.all([
        supabase.from('assets').select('*, category:asset_categories(name)').order('created_at', { ascending: false }),
        supabase.from('asset_categories').select('*').order('name'),
        supabase.from('allocations').select('*, employee:profiles!allocations_assigned_to_employee_id_fkey(name, department:departments!profiles_department_id_fkey(name))').eq('status', 'Active'),
        supabase.from('profiles').select('*, department:departments!profiles_department_id_fkey(name)').eq('status', 'Active').order('name'),
        supabase.from('maintenance_requests').select('*, asset:assets(name, asset_tag), profile:profiles(name)').order('created_at', { ascending: false }),
        supabase.from('transfer_requests').select('*, from:profiles!transfer_requests_from_employee_id_fkey(name), to:profiles!transfer_requests_to_employee_id_fkey(name), asset:assets(name, asset_tag)').eq('status', 'Pending').order('created_at', { ascending: false }),
        supabase.from('departments').select('*').order('name'),
        supabase.from('bookings').select('*, profile:profiles!bookings_booked_by_fkey(name), asset:assets!bookings_asset_id_fkey(asset_tag, name)')
      ])

      if (assetsRes.error || catRes.error || allocRes.error || profRes.error || maintRes.error || transRes.error || deptRes.error || bookingsRes.error) {
        throw new Error('Supabase query error')
      }

      setCategories(catRes.data || [])
      setProfiles(profRes.data || [])
      setDepartments(deptRes.data || [])

      const mappedTickets = (maintRes.data || []).map(t => ({
        id: t.id,
        assetId: t.asset_id,
        assetTag: t.asset?.asset_tag,
        assetName: t.asset?.name,
        issue: t.issue_description,
        priority: t.priority,
        status: t.status,
        raisedBy: t.profile?.name || 'Unknown',
        date: new Date(t.created_at).toISOString().slice(0, 10),
        tech: t.assigned_technician
      }))
      setTickets(mappedTickets)

      const mappedTransfers = (transRes.data || []).map(t => ({
        id: t.id,
        assetId: t.asset_id,
        tag: t.asset?.asset_tag,
        name: t.asset?.name,
        from: t.from?.name || 'Unknown',
        to: t.to?.name || 'Unknown',
        fromId: t.from_employee_id,
        toId: t.to_employee_id,
        date: new Date(t.created_at).toISOString().slice(0, 10)
      }))
      setTransfers(mappedTransfers)

      const mappedBookings = (bookingsRes.data || []).map(b => {
        const startD = new Date(b.start_time)
        const endD = new Date(b.end_time)
        const startH = startD.getHours() + (startD.getMinutes() / 60)
        const endH = endD.getHours() + (endD.getMinutes() / 60)
        return {
          id: b.id,
          assetTag: b.asset?.asset_tag,
          assetName: b.asset?.name,
          startDate: startD,
          start: startH,
          end: endH,
          user: b.profile?.name || 'Unknown',
          title: 'Booking',
          status: b.status
        }
      })
      setBookings(mappedBookings)

      const mappedAssets = (assetsRes.data || []).map(a => {
        const activeAlloc = (allocRes.data || []).find(al => al.asset_id === a.id)
        return {
          ...a,
          tag: a.asset_tag,
          serial: a.serial_number,
          acquisitionDate: a.acquisition_date,
          acquisitionCost: a.acquisition_cost,
          category: a.category?.name || 'Unknown',
          allocatedTo: activeAlloc ? activeAlloc.employee?.name : null,
          allocatedToId: activeAlloc ? activeAlloc.assigned_to_employee_id : null,
          dept: activeAlloc ? activeAlloc.employee?.department?.name : null,
          since: activeAlloc ? activeAlloc.allocation_date : null,
          expectedReturnDate: activeAlloc ? activeAlloc.expected_return_date : null,
          status: activeAlloc ? 'Allocated' : (a.status === 'Allocated' ? 'Available' : a.status)
        }
      })
      setAssets(mappedAssets)
    } catch (err) {
      console.warn('loadGlobalData falling back to local mock data:', err.message)
      
      // Fallback categories
      const mockCategories = CATEGORIES.map((c, idx) => ({ id: `cat-${idx}`, name: c }))
      setCategories(mockCategories)

      // Fallback departments
      setDepartments(DEPARTMENTS || [])

      // Fallback profiles
      const mockProfiles = EMPLOYEES.map(e => ({
        id: e.id,
        name: e.name,
        email: `${e.name.toLowerCase().replace(' ', '')}@assetflow.com`,
        role: e.role,
        department: { name: e.dept }
      }))
      setProfiles(mockProfiles)

      // Fallback tickets
      const mapStatus = (s) => {
        if (s === 'pending') return 'Pending'
        if (s === 'approved') return 'Approved'
        if (s === 'assigned') return 'Technician Assigned'
        if (s === 'in_progress') return 'In Progress'
        if (s === 'resolved') return 'Resolved'
        if (s === 'rejected') return 'Rejected'
        return s || 'Pending'
      }
      const mockTickets = SEED_MAINTENANCE.map(m => {
        const matchingAsset = SEED_ASSETS.find(a => a.tag === m.assetTag)
        return {
          id: m.id,
          assetId: matchingAsset?.id || 'a2',
          assetTag: m.assetTag,
          assetName: m.assetName,
          issue: m.issue,
          priority: m.priority ? (m.priority.charAt(0).toUpperCase() + m.priority.slice(1).toLowerCase()) : 'Medium',
          status: mapStatus(m.status),
          raisedBy: m.raisedBy,
          date: m.date,
          tech: m.tech
        }
      })
      setTickets(mockTickets)

      // Fallback transfers
      setTransfers([])

      // Fallback bookings
      const mockBookings = SEED_BOOKINGS.map(b => {
        const startD = new Date()
        return {
          id: b.id,
          assetTag: b.assetTag,
          assetName: b.assetName,
          startDate: startD,
          start: b.start,
          end: b.end,
          user: b.user,
          title: b.title,
          status: 'Upcoming'
        }
      })
      setBookings(mockBookings)

      // Fallback assets
      const mockAssets = SEED_ASSETS.map(a => ({
        id: a.id,
        tag: a.tag,
        name: a.name,
        category: a.category,
        status: a.status,
        location: a.location,
        serial: a.serial,
        allocatedTo: a.allocatedTo,
        dept: a.dept,
        since: a.since,
        expectedReturnDate: a.expectedReturn
      }))
      setAssets(mockAssets)
    } finally {
      setLoadingApp(false)
    }
  }

  useEffect(() => {
    loadGlobalData()
  }, [])

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  const handleAddBooking = async (assetId, startTime, endTime, title) => {
    try {
      const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-project')
      if (isPlaceholder) {
        throw new Error('Placeholder credentials')
      }
      const { data, error } = await supabase.from('bookings').insert({
        asset_id: assetId,
        booked_by: currentUser?.id || profiles[0]?.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: 'Upcoming'
      }).select('*, profile:profiles!bookings_booked_by_fkey(name), asset:assets!bookings_asset_id_fkey(asset_tag, name)').single()

      if (error) { toast.error(error.message); return }
      
      const startD = new Date(data.start_time)
      const endD = new Date(data.end_time)
      const startH = startD.getHours() + (startD.getMinutes() / 60)
      const endH = endD.getHours() + (endD.getMinutes() / 60)
      
      const newBooking = {
        id: data.id,
        assetTag: data.asset?.asset_tag,
        assetName: data.asset?.name,
        startDate: startD,
        start: startH,
        end: endH,
        user: data.profile?.name || currentUser?.name || 'Priya Shah',
        title: title || 'Booking',
        status: data.status
      }
      setBookings(prev => [...prev, newBooking])
      addLog('booking', `Booking confirmed — ${newBooking.assetName} (${newBooking.title}, ${newBooking.user})`, newBooking.user, newBooking.user)
      toast.success('Booking confirmed')
    } catch (err) {
      // Local fallback
      const asset = assets.find(a => a.id === assetId)
      const startD = new Date(startTime)
      const endD = new Date(endTime)
      const startH = startD.getHours() + (startD.getMinutes() / 60)
      const endH = endD.getHours() + (endD.getMinutes() / 60)
      const newBooking = {
        id: `local-bk-${Date.now()}`,
        assetTag: asset?.tag || 'AF-001',
        assetName: asset?.name || 'Local Asset',
        startDate: startD,
        start: startH,
        end: endH,
        user: currentUser?.name || 'Priya Shah',
        title: title || 'Booking',
        status: 'Upcoming'
      }
      setBookings(prev => [...prev, newBooking])
      addLog('booking', `Booking confirmed — ${newBooking.assetName} (${newBooking.title}, ${newBooking.user})`, newBooking.user, newBooking.user)
      toast.success('Booking confirmed (Local Session)')
    }
  }

  const handleRegisterAsset = async (newAssetData) => {
    const { data, error } = await supabase.from('assets').insert([newAssetData]).select()
    if (error) {
      toast.error('Failed to register: ' + error.message)
      return false
    }
    toast.success(`Registered ${newAssetData.asset_tag} successfully`)
    loadGlobalData()
    setRegisterOpen(false)
    return true
  }

  // Safety: if the active screen isn't allowed for the current role, bounce to first allowed
  useEffect(() => {
    const allowed = NAV_ITEMS.find((n) => n.key === active)?.roles?.includes(role)
    if (view === 'app' && !allowed) {
      const firstAllowed = NAV_ITEMS.find((n) => n.roles?.includes(role))?.key || 'dashboard'
      setActive(firstAllowed)
    }
  }, [active, role, view])

  const doAllocate = async (asset, profileId, expectedReturnDate) => {
    // End active allocations
    const { error: updErr } = await supabase.from('allocations').update({ status: 'Returned', return_date: new Date().toISOString() }).eq('asset_id', asset.id).eq('status', 'Active')
    if (updErr) console.error('Failed to end previous allocation:', updErr)
    
    // Insert new allocation
    const insertData = { asset_id: asset.id, assigned_to_employee_id: profileId, status: 'Active', allocation_date: new Date().toISOString(), allocated_by: profiles[0]?.id }
    if (expectedReturnDate) insertData.expected_return_date = expectedReturnDate

    const { error } = await supabase.from('allocations').insert([insertData])
    if (error) return toast.error(error.message)
    // Update asset status
    await supabase.from('assets').update({ status: 'Allocated' }).eq('id', asset.id)
    const assignee = profiles.find(p => p.id === profileId)
    addLog('allocation', `${asset.name ?? asset.tag} (${asset.tag}) assigned to ${assignee?.name ?? 'employee'}`, currentUser?.name, assignee?.name)
    toast.success(`Allocated ${asset.tag}`)
    loadGlobalData()
  }

  const raiseTransfer = async (asset, toProfileId, reason) => {
    const { error } = await supabase.from('transfer_requests').insert([{
      asset_id: asset.id,
      requested_by: profiles[0]?.id,
      from_employee_id: asset.allocatedToId,
      to_employee_id: toProfileId,
      status: 'Pending'
    }])
    if (error) return toast.error(error.message)
    const toProfile = profiles.find(p => p.id === toProfileId)
    addLog('transfer', `Transfer request raised — ${asset.name} (${asset.tag}): ${asset.allocatedTo ?? 'Unassigned'} → ${toProfile?.name ?? 'employee'} (pending approval)`, currentUser?.name, 'Priya Shah')
    toast.success('Transfer Request Raised')
    loadGlobalData()
  }

  const approveTransfer = async (transfer) => {
    const { error: updErr } = await supabase.from('transfer_requests').update({ status: 'Approved' }).eq('id', transfer.id)
    if (updErr) return toast.error(updErr.message)
    addLog('transfer', `Transfer approved — ${transfer.name} (${transfer.tag}): ${transfer.from} → ${transfer.to}`, currentUser?.name, transfer.to)
    // Perform the actual allocation move
    const asset = assets.find(a => a.id === transfer.assetId)
    if (asset) await doAllocate(asset, transfer.toId)
  }

  const rejectTransfer = async (transfer) => {
    const { error } = await supabase.from('transfer_requests').update({ status: 'Rejected' }).eq('id', transfer.id)
    if (error) return toast.error(error.message)
    addLog('transfer', `Transfer rejected — ${transfer.name} (${transfer.tag}): ${transfer.from} → ${transfer.to}`, currentUser?.name, transfer.from)
    toast.success('Transfer Rejected')
    loadGlobalData()
  }

  const handleReturnAsset = async (asset, checkInNotes) => {
    const { error: updErr } = await supabase.from('allocations').update({ status: 'Returned', return_date: new Date().toISOString(), check_in_notes: checkInNotes }).eq('asset_id', asset.id).eq('status', 'Active')
    if (updErr) return toast.error(updErr.message)
    await supabase.from('assets').update({ status: 'Available' }).eq('id', asset.id)
    addLog('return', `Asset returned — ${asset.name} (${asset.tag}) checked in${checkInNotes ? ': ' + checkInNotes : ''}`, asset.allocatedTo ?? currentUser?.name, 'all')
    toast.success(`Returned ${asset.tag}`)
    loadGlobalData()
  }

  const raiseMaintenance = async (asset, issue, priority, photoUrl) => {
    const { error } = await supabase.from('maintenance_requests').insert([{
      asset_id: asset.id,
      raised_by: profiles[0]?.id,
      issue_description: issue,
      priority,
      status: 'Pending',
      photo_url: photoUrl || null
    }])
    if (error) {
      // Fallback: add to local tickets state when no Supabase
      const newTicket = {
        id: 'local-' + Date.now(),
        assetTag: asset.tag,
        assetName: asset.name,
        assetId: asset.id,
        issue,
        priority,
        status: 'Pending',
        raisedBy: currentUser?.name ?? 'You',
        date: new Date().toLocaleDateString(),
        photoUrl: photoUrl || null,
        tech: null,
      }
      setTickets(prev => [newTicket, ...prev])
    } else {
      loadGlobalData()
    }
    addLog('maintenance', `Maintenance request raised — ${asset.name} (${asset.tag}): ${issue} [${priority} priority]`, currentUser?.name, 'admin')
    toast.success('Maintenance request submitted — awaiting approval')
  }

  const onMoveTicket = async (id, toStatus, techName) => {
    const ticket = tickets.find(t => t.id === id)
    // Optimistic UI update
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: toStatus, tech: techName ?? t.tech } : t)))

    // Asset status side-effects
    if (ticket?.assetId) {
      if (toStatus === 'Approved') {
        // Mark asset Under Maintenance once approved
        await supabase.from('assets').update({ status: 'Under Maintenance' }).eq('id', ticket.assetId)
        setAssets(prev => prev.map(a => a.id === ticket.assetId ? { ...a, status: 'maintenance' } : a))
      } else if (toStatus === 'Resolved') {
        // Return asset to Available on resolution
        await supabase.from('assets').update({ status: 'Available' }).eq('id', ticket.assetId)
        setAssets(prev => prev.map(a => a.id === ticket.assetId ? { ...a, status: 'available' } : a))
      } else if (toStatus === 'Rejected') {
        // If rejected keep asset Available (it was never set Under Maintenance)
      }
    }

    const statusLabel = toStatus === 'Approved' ? 'approved' : toStatus === 'In Progress' ? 'in progress' : toStatus === 'Resolved' ? 'resolved' : toStatus === 'Rejected' ? 'rejected' : toStatus.toLowerCase()
    if (ticket) addLog('maintenance', `Maintenance ${statusLabel} — ${ticket.assetName} (${ticket.assetTag}): ${ticket.issue}${techName ? ' → Tech: ' + techName : ''}`, currentUser?.name, ticket.raisedBy)
    toast.success('Ticket moved to ' + toStatus)

    // Persist to Supabase
    const update = { status: toStatus }
    if (techName) update.assigned_technician = techName
    if (!id.startsWith('local-')) {
      await supabase.from('maintenance_requests').update(update).eq('id', id)
    }
  }

  const handleLogin = (user) => {
    setCurrentUser(user)
    setRole(user.role)
    const firstAllowed = NAV_ITEMS.find((n) => n.roles?.includes(user.role))?.key || 'dashboard'
    setActive(firstAllowed)
    setView('app')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setRole('employee')
    setView('auth')
    toast.success('Signed out')
  }

  const activeLabel = NAV_ITEMS.find((n) => n.key === active)?.label ?? 'Dashboard'

  if (view === 'auth') return <AuthScreen defaultMode={authMode} onLogin={handleLogin} />

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="flex bg-background text-foreground min-h-screen">
        <div className="hidden lg:block sticky top-0 h-screen">
          <Sidebar active={active} onSelect={setActive} role={role} />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-[260px]">
            <Sidebar active={active} onSelect={(k) => { setActive(k); setMobileOpen(false) }} role={role} onClose={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            role={role}
            theme={theme} setTheme={setTheme}
            onSearchOpen={() => setActive('assets')}
            onMenu={() => setMobileOpen(true)}
            activeLabel={activeLabel}
            user={currentUser}
            onLogout={handleLogout}
            onNotificationsOpen={() => setActive('logs')}
            unreadCount={activityLog.filter(a => a.unread).length}
          />
          <main className="flex-1 overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>
                {active === 'dashboard' && <Dashboard user={currentUser} onNavigate={setActive} onQuick={(k) => {
                  if (k === 'register') setRegisterOpen(true)
                  if (k === 'book') setActive('bookings')
                  if (k === 'maintenance') setMaintOpen(true)
                }} />}
                {active === 'assets' && <AssetsScreen role={role} assets={assets} categories={categories} onOpenAllocate={setAllocateAsset} onOpenRegister={() => setRegisterOpen(true)} />}
                {active === 'allocations' && <AllocationsScreen assets={assets} onOpenAllocate={setAllocateAsset} onOpenGenericAllocate={() => setGenericAllocateOpen(true)} transfers={transfers} onApproveTransfer={approveTransfer} onRejectTransfer={rejectTransfer} onReturnAsset={setReturnAsset} />}
                {active === 'bookings' && <BookingsScreen bookings={bookings} assets={assets} onBook={handleAddBooking} />}
                {active === 'maintenance' && <MaintenanceScreen tickets={tickets} onMoveTicket={onMoveTicket} onRaise={() => setMaintOpen(true)} role={role} />}
                {active === 'audit' && <AuditScreen assets={assets} departments={departments} profiles={profiles} addLog={addLog} currentUser={currentUser} setAssets={setAssets} />}
                {active === 'reports' && <ReportsScreen assets={assets} bookings={bookings} tickets={tickets} />}
                {active === 'logs' && <LogsScreen activityLog={activityLog} user={currentUser} role={role} onMarkAllRead={() => setActivityLog(prev => prev.map(a => ({ ...a, unread: false })))} />}
                {active === 'org' && <OrgScreen onDataChanged={loadGlobalData} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AllocateDialog asset={allocateAsset} profiles={profiles} onClose={() => setAllocateAsset(null)} onAllocate={doAllocate} onRaiseTransfer={raiseTransfer} />
      <RegisterAssetDialog open={registerOpen} onClose={() => setRegisterOpen(false)} onAdd={handleRegisterAsset} categories={categories} />
      <ReturnDialog asset={returnAsset} onClose={() => setReturnAsset(null)} onReturn={handleReturnAsset} />
      <GenericAllocateDialog open={genericAllocateOpen} availableAssets={assets.filter(a => a.status === 'Available')} profiles={profiles} onClose={() => setGenericAllocateOpen(false)} onAllocate={doAllocate} />
      <RaiseMaintenanceDialog open={maintOpen} onClose={() => setMaintOpen(false)} assets={assets} onRaise={raiseMaintenance} />
    </div>
  )
}

function GenericAllocateDialog({ open, availableAssets = [], profiles = [], onClose, onAllocate }) {
  const [assetId, setAssetId] = useState('')
  const [target, setTarget] = useState('')
  const [returnDate, setReturnDate] = useState('')

  useEffect(() => {
    if (open) {
      if (availableAssets.length > 0) setAssetId(availableAssets[0].id)
      if (profiles.length > 0) setTarget(profiles[0].id)
      setReturnDate('')
    }
  }, [open, availableAssets, profiles])

  if (!open) return null
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Allocate Asset</DialogTitle>
          <DialogDescription>Select an available asset and assign it to an employee.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {availableAssets.length === 0 ? (
            <div className="text-sm text-rose-500 font-medium">No available assets to allocate.</div>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium">Select Asset</label>
                <Select value={assetId} onValueChange={setAssetId}>
                  <SelectTrigger className="h-11 rounded-lg mt-1"><SelectValue placeholder="Choose an asset..." /></SelectTrigger>
                  <SelectContent>
                    {availableAssets.map((a) => <SelectItem key={a.id} value={a.id}>{a.tag} — {a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Assign to</label>
                  <Select value={target} onValueChange={setTarget}>
                    <SelectTrigger className="h-11 rounded-lg mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {profiles.map((e) => <SelectItem key={e.id} value={e.id}>{e.name} {e.department?.name ? `— ${e.department.name}` : ''}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Expected Return</label>
                  <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="h-11 rounded-lg mt-1" />
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
          <Button disabled={availableAssets.length === 0} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg" onClick={() => {
            const selectedAsset = availableAssets.find(a => a.id === assetId)
            if (selectedAsset) onAllocate(selectedAsset, target, returnDate)
            onClose()
          }}>
            <UserPlus className="w-4 h-4 mr-1.5" /> Confirm Allocation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ReturnDialog({ asset, onClose, onReturn }) {
  const [notes, setNotes] = useState('')

  if (!asset) return null
  return (
    <Dialog open={!!asset} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Return Asset</DialogTitle>
          <DialogDescription>Mark <span className="font-mono text-sky-500">{asset.tag}</span> as returned and available.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Check-in Notes / Condition</label>
            <Textarea placeholder="e.g. Returned in good condition, minor scratch on lid..." value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-lg" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
          <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg active:scale-[0.98]" onClick={() => { onReturn(asset, notes); onClose() }}>
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Confirm Return
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default App
