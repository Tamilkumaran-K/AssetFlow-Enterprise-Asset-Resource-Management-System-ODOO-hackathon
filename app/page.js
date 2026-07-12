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
  Bot, Radar, LineChart as LineIcon, LogOut, Trash2, Pencil,
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
  const meta = STATUS_META[status] ?? STATUS_META.available
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
  { key: 'assets', label: 'Assets', icon: Package, roles: ['admin', 'employee'] },
  { key: 'allocations', label: 'Allocation & Transfer', icon: ArrowLeftRight, roles: ['admin', 'employee'] },
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

function TopBar({ role, theme, setTheme, onSearchOpen, onMenu, activeLabel, user, onLogout }) {
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
        <button className="w-9 h-9 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
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
      const p1 = supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'Available')
      const p2 = supabase.from('assets').select('*', { count: 'exact', head: true }).eq('status', 'Allocated')
      const p3 = supabase.from('maintenance_requests').select('*', { count: 'exact', head: true }).neq('status', 'Resolved').neq('status', 'Rejected')
      const p4 = supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['Upcoming', 'Ongoing'])
      const p5 = supabase.from('transfer_requests').select('*', { count: 'exact', head: true }).eq('status', 'Pending')
      
      const today = new Date().toISOString()
      const p6 = supabase.from('allocations').select('*', { count: 'exact', head: true }).eq('status', 'Active').gte('expected_return_date', today)
      const p7 = supabase.from('allocations').select('id, expected_return_date, profiles(full_name), assets(tag)').eq('status', 'Active').lt('expected_return_date', today)

      const [r1, r2, r3, r4, r5, r6, r7] = await Promise.all([p1, p2, p3, p4, p5, p6, p7])
      
      setStats({
        available: r1.count || 0,
        allocated: r2.count || 0,
        maintenance: r3.count || 0,
        bookings: r4.count || 0,
        transfers: r5.count || 0,
        upcomingReturns: r6.count || 0,
      })
      setOverdueAssets(r7.data || [])
      setLoading(false)
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
      const [allocs, maints] = await Promise.all([
        supabase.from('allocations').select('*, profiles!allocations_assigned_to_employee_id_fkey(name)').eq('asset_id', asset.id).order('allocation_date', { ascending: false }),
        supabase.from('maintenance_requests').select('*').eq('asset_id', asset.id).order('created_at', { ascending: false })
      ])
      setAllocHistory(allocs.data || [])
      setMaintHistory(maints.data || [])
      setLoading(false)
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
          <StatusChip status={asset.status} />
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
                <th className="px-4 py-3 text-right">Action</th>
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
                  <td className="px-4 py-3 text-right">
                    {(isAdmin || a.is_shared_bookable) && (
                      <Button onClick={(e) => { e.stopPropagation(); onOpenAllocate(a); }} size="sm" variant="outline" className="h-8 text-xs rounded-md border-border">
                        {isAdmin ? (a.status === 'Allocated' ? 'Transfer' : 'Allocate') : 'Book'} <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-14 text-center text-sm text-muted-foreground">No assets match your filters.</td>
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
  
  useEffect(() => {
    if (asset && profiles.length > 0 && !target) {
      setTarget(profiles[0].id)
    }
  }, [asset, profiles])

  if (!asset) return null
  const isConflict = asset.status === 'allocated'
  const isMaintenance = asset.status === 'maintenance'

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
              <Textarea placeholder="Reason for transfer…" className="rounded-lg" rows={3} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg" onClick={() => { onRaiseTransfer(asset, target); onClose() }}>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign to</label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger className="h-11 rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {profiles.map((e) => <SelectItem key={e.id} value={e.id}>{e.name} {e.department?.name ? `— ${e.department.name}` : ''}</SelectItem>)}
                </SelectContent>
              </Select>
              <Textarea placeholder="Purpose / notes…" className="rounded-lg" rows={3} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
              <Button className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg active:scale-[0.98] transition-transform" onClick={() => { onAllocate(asset, target); onClose() }}>
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

function AllocationsScreen({ assets, onOpenAllocate, transfers }) {
  const allocated = assets.filter((a) => a.status === 'allocated')
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Allocations & Transfers</h1>
        <p className="text-muted-foreground text-sm mt-1">Smart conflict-checking keeps ownership crystal-clear.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="rounded-2xl border-border p-5 bg-card lg:col-span-2">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-sky-500" /> Currently Allocated</h3>
          <div className="space-y-2">
            {allocated.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sky-500">{a.tag}</span>
                    <span>•</span><span>{a.allocatedTo}</span>
                    <span>•</span><span>{a.dept}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground hidden md:block">Since {a.since}</div>
                <Button size="sm" variant="outline" className="h-8 rounded-md border-border text-xs" onClick={() => onOpenAllocate(a)}>
                  Transfer
                </Button>
              </div>
            ))}
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
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ---------------- Bookings calendar ---------------- */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const HOURS = Array.from({ length: 10 }, (_, i) => i + 9)

function BookingsScreen({ bookings, onBook }) {
  const [asset, setAsset] = useState('AF-0202')
  const [showForm, setShowForm] = useState(false)
  const [dayIdx, setDayIdx] = useState(1)
  const [startH, setStartH] = useState(11)
  const [endH, setEndH] = useState(12)
  const [title, setTitle] = useState('')

  const dayBookings = bookings.filter((b) => b.assetTag === asset)
  const hasOverlap = () => dayBookings.some((b) => b.day === dayIdx && !(endH <= b.start || startH >= b.end))

  const submit = () => {
    if (hasOverlap()) { toast.error('Time slot overlaps with an existing booking.'); return }
    if (endH <= startH) { toast.error('End time must be after start time.'); return }
    onBook({ id: 'b' + Date.now(), assetTag: asset, assetName: 'Selected resource', day: dayIdx, start: startH, end: endH, user: 'Priya Shah', title: title || 'Booking' })
    toast.success('Booking confirmed')
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
          <Select value={asset} onValueChange={setAsset}>
            <SelectTrigger className="w-56 h-10 rounded-lg"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="AF-0202">Room B2 — Boardroom</SelectItem>
              <SelectItem value="AF-0400">Room A1 — Focus Pod</SelectItem>
              <SelectItem value="AF-0055">BenQ 4K Projector</SelectItem>
              <SelectItem value="AF-0088">Toyota Innova</SelectItem>
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
            {DAYS.map((d, i) => (
              <div key={d} className="text-center text-xs font-semibold py-2 border-b border-border">
                <div className="text-muted-foreground uppercase tracking-wide">{d}</div>
                <div className="text-lg font-bold mt-1">{9 + i}</div>
              </div>
            ))}
          </div>
          {HOURS.map((h) => (
            <div key={h} className="grid" style={{ gridTemplateColumns: '60px repeat(5, 1fr)' }}>
              <div className="text-[11px] text-muted-foreground py-3 pr-2 text-right tabular-nums border-t border-border/50">{h}:00</div>
              {DAYS.map((_, dIdx) => {
                const dayNum = dIdx + 1
                const booking = dayBookings.find((b) => b.day === dayNum && h >= b.start && h < b.end)
                const isStart = booking && booking.start === h
                return (
                  <div key={dIdx} className="border-t border-l border-border/50 h-14 relative">
                    {isStart && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-x-1 top-1 rounded-lg bg-sky-500/15 border border-sky-500/30 p-1.5 z-10 overflow-hidden"
                        style={{ height: `calc(${(booking.end - booking.start) * 56}px - 8px)` }}
                      >
                        <div className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 truncate">{booking.title}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{booking.user}</div>
                        <div className="text-[10px] text-muted-foreground">{booking.start}:00 – {booking.end}:00</div>
                      </motion.div>
                    )}
                    {booking && !isStart && <div className="absolute inset-0 bg-sky-500/5" />}
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
                <Select value={String(dayIdx)} onValueChange={(v) => setDayIdx(Number(v))}>
                  <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>{DAYS.map((d, i) => <SelectItem key={d} value={String(i + 1)}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Start</label>
                <Select value={String(startH)} onValueChange={(v) => setStartH(Number(v))}>
                  <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>{HOURS.map((h) => <SelectItem key={h} value={String(h)}>{h}:00</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">End</label>
                <Select value={String(endH)} onValueChange={(v) => setEndH(Number(v))}>
                  <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>{HOURS.map((h) => <SelectItem key={h} value={String(h + 1)}>{h + 1}:00</SelectItem>)}</SelectContent>
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

function MaintenanceScreen({ tickets, onMoveTicket, onRaise }) {
  const [dragging, setDragging] = useState(null)
  const move = (id, toStatus) => {
    onMoveTicket(id, toStatus)
  }
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Maintenance Board</h1>
          <p className="text-muted-foreground text-sm mt-1">Drag tickets across columns to progress workflows.</p>
        </div>
        <Button onClick={onRaise} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg h-10 active:scale-[0.98] transition-transform">
          <Plus className="w-4 h-4 mr-1.5" /> Raise Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {KANBAN_COLS.map((col) => {
          const items = tickets.filter((t) => t.status === col.key)
          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragging) { move(dragging, col.key); setDragging(null) } }}
              className="rounded-2xl border border-border bg-card/60 p-3 min-h-[300px] flex flex-col"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-current ${col.accent}`} />
                  <span className="text-sm font-semibold">{col.label}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{items.length}</span>
              </div>
              <div className="space-y-2 flex-1">
                {items.map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    draggable
                    onDragStart={() => setDragging(t.id)}
                    onDragEnd={() => setDragging(null)}
                    whileHover={{ y: -2 }}
                    className="cursor-grab active:cursor-grabbing rounded-xl border border-border bg-background p-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] text-sky-500 font-semibold">{t.assetTag}</span>
                      <Badge className={PRIORITY_META[t.priority] + ' border text-[10px] capitalize'}>{t.priority}</Badge>
                    </div>
                    <div className="text-sm font-medium mb-1">{t.assetName}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{t.issue}</div>
                    <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><User className="w-3 h-3" />{t.raisedBy}</span>
                      <span>{t.date}</span>
                    </div>
                    {t.tech && <div className="mt-2 text-[10px] rounded-md bg-sky-500/10 text-sky-500 px-2 py-1 inline-block">Tech: {t.tech}</div>}
                  </motion.div>
                ))}
                {items.length === 0 && (
                  <div className="text-[11px] text-muted-foreground text-center py-6 border border-dashed border-border rounded-lg">Drop here</div>
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

function AuditScreen({ assets }) {
  const [step, setStep] = useState(0)
  const [results, setResults] = useState({})

  const auditList = assets.slice(0, 8)
  const total = auditList.length
  const done = Object.keys(results).length
  const progress = (done / total) * 100
  const setResult = (id, v) => setResults((r) => ({ ...r, [id]: v }))
  const summary = useMemo(() => {
    const verified = Object.values(results).filter((v) => v === 'verified').length
    const missing = Object.values(results).filter((v) => v === 'missing').length
    const damaged = Object.values(results).filter((v) => v === 'damaged').length
    return { verified, missing, damaged }
  }, [results])

  const chipClass = (v, active) => {
    if (!active) return 'border-border text-muted-foreground hover:bg-muted'
    if (v === 'verified') return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    if (v === 'missing') return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
    return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1000px] mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Asset Audit — Q2 2025</h1>
        <p className="text-muted-foreground text-sm mt-1">Physical verification wizard — mark each asset as verified, missing or damaged.</p>
      </div>

      <Card className="rounded-2xl border-border p-6 bg-card">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">{done} of {total} verified</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        {step === 0 ? (
          <div className="space-y-2">
            {auditList.map((a) => {
              const res = results[a.id]
              return (
                <div key={a.id} className="rounded-xl border border-border p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.name}</div>
                    <div className="text-xs text-muted-foreground"><span className="font-mono text-sky-500">{a.tag}</span> • {a.location}</div>
                  </div>
                  <div className="flex gap-1">
                    {['verified', 'missing', 'damaged'].map((v) => (
                      <button key={v} onClick={() => setResult(a.id, v)} className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium capitalize border transition-all ${chipClass(v, res === v)}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
            <div className="flex justify-end pt-2">
              <Button onClick={() => setStep(1)} disabled={done < total} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg">
                Generate Discrepancy Report <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center mb-3">
                <ClipboardCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold">Discrepancy Report Ready</h2>
              <p className="text-sm text-muted-foreground">Auto-generated summary of your audit checkpoint.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                <div className="text-3xl font-bold text-emerald-600">{summary.verified}</div>
                <div className="text-xs text-muted-foreground mt-1">Verified</div>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                <div className="text-3xl font-bold text-amber-600">{summary.damaged}</div>
                <div className="text-xs text-muted-foreground mt-1">Damaged</div>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-center">
                <div className="text-3xl font-bold text-rose-600">{summary.missing}</div>
                <div className="text-xs text-muted-foreground mt-1">Missing</div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)} className="rounded-lg"><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
              <Button onClick={() => toast.success('Report exported to PDF')} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg">Export PDF</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

/* ---------------- Reports ---------------- */

function ReportsScreen() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Utilization insights, maintenance trends and idle-asset radar.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="rounded-2xl border-border p-5 bg-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-sky-500" /> Utilization by Department</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={UTILIZATION_BY_DEPT} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="utilization" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border-border p-5 bg-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Wrench className="w-4 h-4 text-amber-500" /> Maintenance Frequency</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MAINTENANCE_TREND} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: '#F59E0B', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border-border p-5 bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-rose-500" /> Idle Assets</h3>
            <p className="text-xs text-muted-foreground">Assets unused for 30+ days — candidates for re-allocation.</p>
          </div>
          <Badge variant="outline" className="border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/5">{IDLE_ASSETS.length} flagged</Badge>
        </div>
        <div className="space-y-2">
          {IDLE_ASSETS.map((a) => (
            <div key={a.tag} className="rounded-xl border border-border p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{a.name} <span className="font-mono text-xs text-sky-500 ml-1">{a.tag}</span></div>
                <div className="text-xs text-muted-foreground">{a.category} • {a.location}</div>
              </div>
              <div className="text-xs"><span className="font-semibold text-rose-500">Unused {a.days}+ days</span></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ---------------- Logs ---------------- */

function LogsScreen() {
  const [filter, setFilter] = useState('all')
  const filtered = ACTIVITY.filter((a) => {
    if (filter === 'all') return true
    if (filter === 'alerts') return a.type === 'alert'
    if (filter === 'approvals') return a.type === 'transfer'
    if (filter === 'bookings') return a.type === 'booking'
    return true
  })
  const tabs = [{ key: 'all', label: 'All' }, { key: 'alerts', label: 'Alerts' }, { key: 'approvals', label: 'Approvals' }, { key: 'bookings', label: 'Bookings' }]
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1000px] mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">A complete audit trail of every action across your workspace.</p>
      </div>
      <div className="flex gap-1 bg-muted/50 border border-border rounded-lg p-1 w-fit">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === t.key ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <Card className="rounded-2xl border-border p-5 bg-card">
        <div className="space-y-1">
          {filtered.map((a, i) => {
            const Icon = ICON_MAP[a.icon] ?? Sparkles
            const tone = a.type === 'alert' ? 'rose' : a.type === 'maintenance' ? 'amber' : a.type === 'booking' ? 'indigo' : a.type === 'transfer' ? 'amber' : 'emerald'
            return (
              <motion.div key={a.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex gap-3 py-3 border-b border-border last:border-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${TONE_STYLES[tone]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{a.text}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 capitalize"><span>{a.type}</span> • <span>{a.time}</span></div>
                </div>
              </motion.div>
            )
          })}
          {filtered.length === 0 && <div className="text-sm text-muted-foreground py-8 text-center">No activity matches.</div>}
        </div>
      </Card>
    </div>
  )
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
    const [deptRes, profRes, catRes] = await Promise.all([
      supabase.from('departments').select('*, head:profiles!head_id(id, name), profiles!profiles_department_id_fkey(count)').order('name'),
      supabase.from('profiles').select('*, department:departments!profiles_department_id_fkey(name)').eq('status', 'Active').order('name'),
      supabase.from('asset_categories').select('*').order('name')
    ])
    setDepartments(deptRes.data || [])
    setProfiles(profRes.data || [])
    setCategories(catRes.data || [])
    setLoading(false)
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
              {loading ? <div className="text-sm text-muted-foreground p-4 text-center">Loading departments...</div> : departments.map((d) => (
                <div key={d.id} className="rounded-xl border border-border p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{d.name} <Badge variant={d.status === 'Active' ? 'outline' : 'secondary'} className="ml-2 text-[10px]">{d.status}</Badge></div>
                    <div className="text-xs text-muted-foreground">Head: {d.head?.name || 'Unassigned'}</div>
                  </div>
                  <Badge variant="outline" className="border-border">{d.profiles?.[0]?.count || 0} members</Badge>
                  <Button variant="ghost" size="icon" onClick={() => { setEditDept(d); setAddDeptOpen(true) }} className="text-sky-500 hover:text-sky-600 hover:bg-sky-500/10 h-8 w-8 ml-2">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteDept(d.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-8 w-8 ml-2">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
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
      status: 'Available'
    })
    setLoading(false)
    if (success) {
      setName(''); setCategoryId('none'); setSerial(''); setLocation(''); setAcqDate(''); setAcqCost(''); setPhotoUrl(''); setIsBookable(false); setCondition('New');
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
          <div><label className="text-sm font-medium mb-1.5 block">Photo URL (Optional)</label><Input type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." className="h-10 rounded-lg" /></div>
          
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
  const [assetId, setAssetId] = useState(assets[0]?.id ?? '')
  const [issue, setIssue] = useState('')
  const [priority, setPriority] = useState('Medium')
  useEffect(() => { if (open && assets[0]) setAssetId(assets[0].id) }, [open, assets])
  const submit = () => {
    if (!issue.trim()) { toast.error('Please describe the issue.'); return }
    const asset = assets.find((a) => a.id === assetId)
    onRaise(asset, issue, priority)
    setIssue(''); onClose()
  }
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Raise Maintenance Request</DialogTitle>
          <DialogDescription>Your request will land in the Pending column.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Asset</label>
            <Select value={assetId} onValueChange={setAssetId}>
              <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>{assets.map((a) => <SelectItem key={a.id} value={a.id}>{a.tag} — {a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><label className="text-sm font-medium mb-1.5 block">Issue</label><Textarea value={issue} onChange={(e) => setIssue(e.target.value)} rows={3} placeholder="Describe the fault…" className="rounded-lg" /></div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Priority</label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
          <Button onClick={submit} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg">Submit</Button>
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
  const [bookings, setBookings] = useState([])
  const [tickets, setTickets] = useState([])
  const [transfers, setTransfers] = useState([])
  const [loadingApp, setLoadingApp] = useState(true)

  const [allocateAsset, setAllocateAsset] = useState(null)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [maintOpen, setMaintOpen] = useState(false)

  const loadGlobalData = async () => {
    setLoadingApp(true)
    const [assetsRes, catRes, allocRes, profRes, maintRes] = await Promise.all([
      supabase.from('assets').select('*, category:asset_categories(name)').order('created_at', { ascending: false }),
      supabase.from('asset_categories').select('*').order('name'),
      supabase.from('allocations').select('*, employee:profiles!allocations_assigned_to_employee_id_fkey(name, department:departments!profiles_department_id_fkey(name))').eq('status', 'Active'),
      supabase.from('profiles').select('*, department:departments!profiles_department_id_fkey(name)').eq('status', 'Active').order('name'),
      supabase.from('maintenance_requests').select('*, asset:assets(name, asset_tag), profile:profiles(name)').order('created_at', { ascending: false })
    ])
    
    setCategories(catRes.data || [])
    setProfiles(profRes.data || [])
    
    const mappedTickets = (maintRes.data || []).map(t => ({
      id: t.id,
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
        dept: activeAlloc ? activeAlloc.employee?.department?.name : null,
        since: activeAlloc ? activeAlloc.allocation_date : null
      }
    })
    setAssets(mappedAssets)
    setLoadingApp(false)
  }

  useEffect(() => {
    loadGlobalData()
  }, [])

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

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

  // Safety: if the active screen isn't allowed for the current role, bounce to dashboard
  useEffect(() => {
    const allowed = NAV_ITEMS.find((n) => n.key === active)?.roles?.includes(role)
    if (view === 'app' && !allowed) setActive('dashboard')
  }, [active, role, view])

  const doAllocate = async (asset, profileId) => {
    // End active allocations
    const { error: updErr } = await supabase.from('allocations').update({ status: 'Returned', return_date: new Date().toISOString() }).eq('asset_id', asset.id).eq('status', 'Active')
    if (updErr) console.error('Failed to end previous allocation:', updErr)
    
    // Insert new allocation
    const { error } = await supabase.from('allocations').insert([{ asset_id: asset.id, assigned_to_employee_id: profileId, status: 'Active', allocation_date: new Date().toISOString(), allocated_by: profiles[0]?.id }])
    if (error) return toast.error(error.message)
    // Update asset status
    await supabase.from('assets').update({ status: 'Allocated' }).eq('id', asset.id)
    toast.success(`Allocated ${asset.tag}`)
    loadGlobalData()
  }
  const raiseTransfer = async (asset, toProfileId) => {
    // For this MVP, raiseTransfer behaves exactly like doAllocate
    await doAllocate(asset, toProfileId)
  }

  const raiseMaintenance = async (asset, issue, priority) => {
    const { error } = await supabase.from('maintenance_requests').insert([{
      asset_id: asset.id,
      raised_by: profiles[0]?.id,
      issue_description: issue,
      priority,
      status: 'Pending'
    }])
    if (error) return toast.error(error.message)
    await supabase.from('assets').update({ status: 'Under Maintenance' }).eq('id', asset.id)
    toast.success('Maintenance request submitted')
    loadGlobalData()
  }

  const onMoveTicket = async (id, toStatus) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: toStatus } : t)))
    toast.success('Ticket moved to ' + toStatus)
    await supabase.from('maintenance_requests').update({ status: toStatus }).eq('id', id)
  }

  const handleLogin = (user) => {
    setCurrentUser(user)
    setRole(user.role)
    setActive('dashboard')
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
                {active === 'allocations' && <AllocationsScreen assets={assets} onOpenAllocate={setAllocateAsset} transfers={transfers} />}
                {active === 'bookings' && <BookingsScreen bookings={bookings} onBook={(b) => setBookings((prev) => [...prev, b])} />}
                {active === 'maintenance' && <MaintenanceScreen tickets={tickets} onMoveTicket={onMoveTicket} onRaise={() => setMaintOpen(true)} />}
                {active === 'audit' && <AuditScreen assets={assets} />}
                {active === 'reports' && <ReportsScreen />}
                {active === 'logs' && <LogsScreen />}
                {active === 'org' && <OrgScreen onDataChanged={loadGlobalData} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AllocateDialog asset={allocateAsset} profiles={profiles} onClose={() => setAllocateAsset(null)} onAllocate={doAllocate} onRaiseTransfer={raiseTransfer} />
      <RegisterAssetDialog open={registerOpen} onClose={() => setRegisterOpen(false)} onAdd={handleRegisterAsset} categories={categories} />
      <RaiseMaintenanceDialog open={maintOpen} onClose={() => setMaintOpen(false)} assets={assets} onRaise={raiseMaintenance} />
    </div>
  )
}

export default App
