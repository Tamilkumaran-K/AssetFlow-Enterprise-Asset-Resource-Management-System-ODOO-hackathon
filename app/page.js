'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  LayoutDashboard, Package, ArrowLeftRight, CalendarDays, Wrench, ClipboardCheck,
  BarChart3, ScrollText, Building2, Search, Bell, Sun, Moon, Plus, Menu, X,
  ChevronRight, ChevronLeft, AlertTriangle, CheckCircle2, Users, Undo2,
  CalendarCheck, UserPlus, Calendar, ArrowRight, Filter, MapPin, Clock, User,
  Layers, ChevronDown, Boxes, Sparkles, TrendingUp, ShieldCheck, Zap,
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
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
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

/* ---------------- Login ---------------- */

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [slide, setSlide] = useState(0)
  const slides = [
    { title: 'Conflict-free allocation', body: 'Prevent double-assignment with real-time ownership checks and instant transfer requests.', icon: ShieldCheck },
    { title: 'Smart maintenance', body: 'Kanban workflows keep technicians, approvers and requesters on the same page.', icon: Wrench },
    { title: 'Insightful analytics', body: 'Utilization, idle-asset radar and audit trails — in one operational hub.', icon: Sparkles },
  ]
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 3800)
    return () => clearInterval(t)
  }, [slides.length])

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">AssetFlow</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {mode === 'login' ? 'Sign in to manage your organization’s assets.' : 'Sign up to join your workspace.'}
          </p>
          <form onSubmit={(e) => { e.preventDefault(); onLogin() }} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full name</label>
                <Input placeholder="Priya Shah" defaultValue="Priya Shah" className="h-11 rounded-xl" />
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Work email</label>
              <Input type="email" placeholder="you@company.com" defaultValue="priya@assetflow.io" className="h-11 rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <Input type="password" placeholder="••••••••" defaultValue="demopass" className="h-11 rounded-xl" />
            </div>
            {mode === 'signup' && (
              <div className="text-xs text-muted-foreground bg-muted/50 border rounded-xl p-3 flex gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>Creates an employee account only; roles are assigned by your admin after approval.</span>
              </div>
            )}
            <Button type="submit" className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold active:scale-[0.98] transition-transform">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </form>
          <div className="mt-6 text-sm text-muted-foreground text-center">
            {mode === 'login' ? 'New to AssetFlow?' : 'Have an account?'}{' '}
            <button className="text-indigo-500 hover:text-indigo-400 font-medium" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.3), transparent 40%)' }} />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2 text-sm font-medium opacity-80">
            <Zap className="w-4 h-4" /> Enterprise Asset Management
          </div>
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {slides.map((s, i) => i === slide && (
                <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }}>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-5 backdrop-blur">
                    <s.icon className="w-7 h-7" />
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight leading-tight mb-3">{s.title}</h2>
                  <p className="text-white/70 text-lg max-w-md leading-relaxed">{s.body}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-10 bg-white' : 'w-4 bg-white/30'}`} />
              ))}
            </div>
          </div>
          <div className="text-xs text-white/60">Trusted by IT-Ops, Facilities & Finance teams to keep 1,200+ assets flowing.</div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Sidebar & Topbar ---------------- */

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'assets', label: 'Assets', icon: Package },
  { key: 'allocations', label: 'Allocations', icon: ArrowLeftRight },
  { key: 'bookings', label: 'Bookings', icon: CalendarDays },
  { key: 'maintenance', label: 'Maintenance', icon: Wrench },
  { key: 'audit', label: 'Audit', icon: ClipboardCheck },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'logs', label: 'Activity Logs', icon: ScrollText },
  { key: 'org', label: 'Organization', icon: Building2, adminOnly: true },
]

function Sidebar({ active, onSelect, role, onClose }) {
  return (
    <aside className="h-full w-[240px] flex-shrink-0 flex flex-col bg-card/70 backdrop-blur-xl border-r border-border">
      <div className="h-16 px-5 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
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
        {NAV_ITEMS.filter((n) => !n.adminOnly || role === 'admin').map((item) => {
          const Icon = item.icon
          const isActive = active === item.key
          return (
            <button
              key={item.key}
              onClick={() => { onSelect(item.key); onClose?.() }}
              className={`w-full group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-500' : ''}`} />
              <span>{item.label}</span>
              {isActive && <span className="ml-auto w-1 h-4 rounded-full bg-indigo-500" />}
            </button>
          )
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="rounded-xl border border-border p-3 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold">Q2 Audit Ready</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">Start a new physical audit for this quarter.</p>
          <Button size="sm" className="h-7 w-full text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white" onClick={() => onSelect('audit')}>Launch wizard</Button>
        </div>
      </div>
    </aside>
  )
}

function TopBar({ role, setRole, theme, setTheme, onSearchOpen, onMenu, activeLabel }) {
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
        <div className="hidden sm:flex items-center bg-muted/60 border border-border rounded-lg p-0.5 text-xs font-medium">
          {['admin', 'employee'].map((r) => (
            <button key={r} onClick={() => setRole(r)} className={`px-2.5 py-1 rounded-md capitalize transition-all ${role === r ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
              {r}
            </button>
          ))}
        </div>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-9 h-9 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center">
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="w-9 h-9 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>
        <div className="ml-2 flex items-center gap-2 rounded-lg pl-2 pr-1 py-1 hover:bg-muted cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">PS</div>
          <div className="hidden md:block">
            <div className="text-xs font-medium leading-none">Priya Shah</div>
            <div className="text-[10px] text-muted-foreground capitalize mt-0.5">{role}</div>
          </div>
          <ChevronDown className="hidden md:block w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </div>
    </header>
  )
}

/* ---------------- Dashboard ---------------- */

function Dashboard({ onQuick, onNavigate }) {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <Reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Operational Snapshot</h1>
            <p className="text-muted-foreground text-sm mt-1">Live view of your organization’s assets, bookings and workflows.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => onQuick('register')} className="bg-indigo-600 hover:bg-indigo-500 text-white h-10 rounded-lg font-medium active:scale-[0.98] transition-transform">
              <Plus className="w-4 h-4 mr-1.5" /> Register Asset
            </Button>
            <Button onClick={() => onQuick('book')} variant="outline" className="h-10 rounded-lg border-border font-medium">
              <CalendarDays className="w-4 h-4 mr-1.5" /> Book Resource
            </Button>
            <Button onClick={() => onQuick('maintenance')} variant="outline" className="h-10 rounded-lg border-border font-medium">
              <Wrench className="w-4 h-4 mr-1.5" /> Raise Maintenance
            </Button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">3 assets overdue for return — flagged for follow-up.</div>
            <div className="text-xs text-muted-foreground mt-0.5">AF-0089 (Sneha Kapoor), AF-0210 (Arjun Mehta), AF-0032 (Rahul Iyer)</div>
          </div>
          <Button variant="outline" size="sm" className="h-8 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10" onClick={() => onNavigate('logs')}>
            Review <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPIS.map((k, idx) => {
          const Icon = ICON_MAP[k.icon]
          return (
            <Reveal key={k.key} delay={0.05 + idx * 0.03}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="rounded-2xl border-border p-4 hover:shadow-lg transition-shadow bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${TONE_STYLES[k.tone]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-semibold ${k.tone === 'emerald' ? 'text-emerald-500' : k.tone === 'amber' ? 'text-amber-500' : k.tone === 'indigo' ? 'text-indigo-500' : 'text-muted-foreground'}`}>{k.delta}</span>
                  </div>
                  <div className="text-2xl font-bold tracking-tight tabular-nums">
                    <CountUp value={k.value} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{k.label}</div>
                </Card>
              </motion.div>
            </Reveal>
          )
        })}
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <Reveal delay={0.1} className="xl:col-span-2">
          <Card className="rounded-2xl border-border p-5 bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Utilization by Department</h3>
                <p className="text-xs text-muted-foreground">Percentage of allocated assets across teams</p>
              </div>
              <Badge variant="outline" className="text-[10px] font-medium border-border">This quarter</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={UTILIZATION_BY_DEPT} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="utilization" radius={[6, 6, 0, 0]}>
                    {UTILIZATION_BY_DEPT.map((entry, i) => (
                      <Cell key={i} fill={entry.utilization > 80 ? '#6366F1' : entry.utilization > 50 ? '#8b5cf6' : '#c4b5fd'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.15}>
          <Card className="rounded-2xl border-border p-5 bg-card h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Activity</h3>
              <button className="text-xs text-indigo-500 hover:text-indigo-400 font-medium" onClick={() => onNavigate('logs')}>View all</button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {ACTIVITY.slice(0, 7).map((a) => {
                const Icon = ICON_MAP[a.icon] ?? Sparkles
                return (
                  <div key={a.id} className="flex gap-3 group">
                    <div className="relative shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${a.type === 'alert' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : a.type === 'maintenance' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : a.type === 'booking' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
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

function AssetsScreen({ assets, onOpenAllocate, onOpenRegister }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchQ = !q || a.tag.toLowerCase().includes(q.toLowerCase()) || a.name.toLowerCase().includes(q.toLowerCase()) || a.serial.toLowerCase().includes(q.toLowerCase())
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
          <Button onClick={onOpenRegister} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg h-10 active:scale-[0.98] transition-transform">
            <Plus className="w-4 h-4 mr-1.5" /> Register Asset
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border-border p-5 bg-card">
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by tag, serial, or QR code…" className="pl-9 h-10 rounded-lg" />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-40 h-10 rounded-lg"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40 h-10 rounded-lg"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="allocated">Allocated</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
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
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-500">{a.tag}</td>
                  <td className="px-4 py-3 font-medium">{a.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{a.category}</td>
                  <td className="px-4 py-3"><StatusChip status={a.status} /></td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{a.location}</span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell text-muted-foreground">{a.allocatedTo ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <Button onClick={() => onOpenAllocate(a)} size="sm" variant="outline" className="h-8 text-xs rounded-md border-border">
                      Allocate <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
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
    </div>
  )
}

/* ---------------- Allocate dialog ---------------- */

function AllocateDialog({ asset, onClose, onAllocate, onRaiseTransfer }) {
  const [target, setTarget] = useState(EMPLOYEES[0].id)
  if (!asset) return null
  const isConflict = asset.status === 'allocated'
  const isMaintenance = asset.status === 'maintenance'

  return (
    <Dialog open={!!asset} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="font-mono text-indigo-500">{asset.tag}</span>
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
                  {EMPLOYEES.filter((e) => e.name !== asset.allocatedTo).map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name} — {e.dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea placeholder="Reason for transfer…" className="rounded-lg" rows={3} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg" onClick={() => { const to = EMPLOYEES.find((e) => e.id === target); onRaiseTransfer(asset, to); onClose() }}>
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
                  {EMPLOYEES.map((e) => <SelectItem key={e.id} value={e.id}>{e.name} — {e.dept}</SelectItem>)}
                </SelectContent>
              </Select>
              <Textarea placeholder="Purpose / notes…" className="rounded-lg" rows={3} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg active:scale-[0.98] transition-transform" onClick={() => { const to = EMPLOYEES.find((e) => e.id === target); onAllocate(asset, to); onClose() }}>
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
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-indigo-500" /> Currently Allocated</h3>
          <div className="space-y-2">
            {allocated.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-indigo-500">{a.tag}</span>
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
                  <span className="font-mono text-indigo-500">{t.tag}</span>
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
          <Button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg h-10 active:scale-[0.98] transition-transform">
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
                        className="absolute inset-x-1 top-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 p-1.5 z-10 overflow-hidden"
                        style={{ height: `calc(${(booking.end - booking.start) * 56}px - 8px)` }}
                      >
                        <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 truncate">{booking.title}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{booking.user}</div>
                        <div className="text-[10px] text-muted-foreground">{booking.start}:00 – {booking.end}:00</div>
                      </motion.div>
                    )}
                    {booking && !isStart && <div className="absolute inset-0 bg-indigo-500/5" />}
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
            <Button onClick={submit} disabled={hasOverlap()} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ---------------- Maintenance ---------------- */

function MaintenanceScreen({ tickets, setTickets, onRaise }) {
  const [dragging, setDragging] = useState(null)
  const move = (id, toStatus) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: toStatus } : t)))
    toast.success('Ticket moved to ' + KANBAN_COLS.find((c) => c.key === toStatus).label)
  }
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Maintenance Board</h1>
          <p className="text-muted-foreground text-sm mt-1">Drag tickets across columns to progress workflows.</p>
        </div>
        <Button onClick={onRaise} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg h-10 active:scale-[0.98] transition-transform">
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
                      <span className="font-mono text-[10px] text-indigo-500 font-semibold">{t.assetTag}</span>
                      <Badge className={PRIORITY_META[t.priority] + ' border text-[10px] capitalize'}>{t.priority}</Badge>
                    </div>
                    <div className="text-sm font-medium mb-1">{t.assetName}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{t.issue}</div>
                    <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><User className="w-3 h-3" />{t.raisedBy}</span>
                      <span>{t.date}</span>
                    </div>
                    {t.tech && <div className="mt-2 text-[10px] rounded-md bg-indigo-500/10 text-indigo-500 px-2 py-1 inline-block">Tech: {t.tech}</div>}
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
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.name}</div>
                    <div className="text-xs text-muted-foreground"><span className="font-mono text-indigo-500">{a.tag}</span> • {a.location}</div>
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
              <Button onClick={() => setStep(1)} disabled={done < total} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">
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
              <Button onClick={() => toast.success('Report exported to PDF')} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">Export PDF</Button>
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
          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-500" /> Utilization by Department</h3>
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
                <div className="text-sm font-medium">{a.name} <span className="font-mono text-xs text-indigo-500 ml-1">{a.tag}</span></div>
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

function OrgScreen() {
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
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"><Plus className="w-3.5 h-3.5 mr-1" /> Add Dept</Button>
            </div>
            <div className="space-y-2">
              {DEPARTMENTS.map((d) => (
                <div key={d.id} className="rounded-xl border border-border p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
                  <div className="flex-1"><div className="text-sm font-medium">{d.name}</div><div className="text-xs text-muted-foreground">Head: {d.head}</div></div>
                  <Badge variant="outline" className="border-border">{d.members} members</Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <Card className="rounded-2xl border-border p-5 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Asset Categories & Custom Fields</h3>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"><Plus className="w-3.5 h-3.5 mr-1" /> New Category</Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CATEGORIES.map((c) => (
                <div key={c} className="rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center"><Layers className="w-3.5 h-3.5" /></div>
                    <div className="font-medium">{c}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">Custom fields: Serial, Warranty, Condition</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="employees" className="mt-4">
          <Card className="rounded-2xl border-border p-5 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Employee Directory</h3>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"><Plus className="w-3.5 h-3.5 mr-1" /> Invite</Button>
            </div>
            <div className="space-y-2">
              {EMPLOYEES.map((e) => (
                <div key={e.id} className="rounded-xl border border-border p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{e.avatar}</div>
                  <div className="flex-1"><div className="text-sm font-medium">{e.name}</div><div className="text-xs text-muted-foreground">{e.dept}</div></div>
                  <Select defaultValue={e.role}>
                    <SelectTrigger className="w-32 h-8 rounded-md text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ---------------- Register + Maintenance dialogs ---------------- */

function RegisterAssetDialog({ open, onClose, onAdd }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Laptop')
  const [serial, setSerial] = useState('')
  const [location, setLocation] = useState('HQ - IT Store')
  const submit = () => {
    if (!name || !serial) { toast.error('Name & serial are required.'); return }
    const tag = 'AF-' + String(600 + Math.floor(Math.random() * 300)).padStart(4, '0')
    onAdd({ id: 'a' + Date.now(), tag, name, category, serial, location, status: 'available', allocatedTo: null, dept: null, since: null })
    toast.success(`Registered ${tag} — ${name}`)
    setName(''); setSerial(''); onClose()
  }
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Register New Asset</DialogTitle>
          <DialogDescription>A unique tag will be generated automatically.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div><label className="text-sm font-medium mb-1.5 block">Name</label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder='MacBook Pro 16"' className="h-10 rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-10 rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><label className="text-sm font-medium mb-1.5 block">Serial</label><Input value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="C02XF1YZLVDL" className="h-10 rounded-lg" /></div>
          </div>
          <div><label className="text-sm font-medium mb-1.5 block">Location</label><Input value={location} onChange={(e) => setLocation(e.target.value)} className="h-10 rounded-lg" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
          <Button onClick={submit} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">Register</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RaiseMaintenanceDialog({ open, onClose, assets, onRaise }) {
  const [assetId, setAssetId] = useState(assets[0]?.id ?? '')
  const [issue, setIssue] = useState('')
  const [priority, setPriority] = useState('medium')
  useEffect(() => { if (open && assets[0]) setAssetId(assets[0].id) }, [open, assets])
  const submit = () => {
    if (!issue.trim()) { toast.error('Please describe the issue.'); return }
    const asset = assets.find((a) => a.id === assetId)
    onRaise({ id: 'm' + Date.now(), assetTag: asset.tag, assetName: asset.name, issue, priority, status: 'pending', raisedBy: 'Priya Shah', date: new Date().toISOString().slice(0, 10) })
    toast.success('Maintenance request submitted')
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
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-lg">Cancel</Button>
          <Button onClick={submit} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ---------------- App root ---------------- */

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [active, setActive] = useState('dashboard')
  const [role, setRole] = useState('admin')
  const [theme, setTheme] = useState('light')
  const [mobileOpen, setMobileOpen] = useState(false)

  const [assets, setAssets] = useState(SEED_ASSETS)
  const [bookings, setBookings] = useState(SEED_BOOKINGS)
  const [tickets, setTickets] = useState(SEED_MAINTENANCE)
  const [transfers, setTransfers] = useState([])

  const [allocateAsset, setAllocateAsset] = useState(null)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [maintOpen, setMaintOpen] = useState(false)

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  const doAllocate = (asset, employee) => {
    setAssets((prev) => prev.map((a) => a.id === asset.id ? { ...a, status: 'allocated', allocatedTo: employee.name, dept: employee.dept, since: new Date().toISOString().slice(0, 10) } : a))
    toast.success(`Allocated ${asset.tag} → ${employee.name}`)
  }
  const raiseTransfer = (asset, to) => {
    setTransfers((prev) => [{ id: 'tr' + Date.now(), tag: asset.tag, name: asset.name, from: asset.allocatedTo, to: to.name }, ...prev])
    toast.success(`Transfer request raised: ${asset.tag} → ${to.name}`)
  }

  const activeLabel = NAV_ITEMS.find((n) => n.key === active)?.label ?? 'Dashboard'

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />

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
            role={role} setRole={setRole}
            theme={theme} setTheme={setTheme}
            onSearchOpen={() => setActive('assets')}
            onMenu={() => setMobileOpen(true)}
            activeLabel={activeLabel}
          />
          <main className="flex-1 overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>
                {active === 'dashboard' && <Dashboard onNavigate={setActive} onQuick={(k) => {
                  if (k === 'register') setRegisterOpen(true)
                  if (k === 'book') setActive('bookings')
                  if (k === 'maintenance') setMaintOpen(true)
                }} />}
                {active === 'assets' && <AssetsScreen assets={assets} onOpenAllocate={setAllocateAsset} onOpenRegister={() => setRegisterOpen(true)} />}
                {active === 'allocations' && <AllocationsScreen assets={assets} onOpenAllocate={setAllocateAsset} transfers={transfers} />}
                {active === 'bookings' && <BookingsScreen bookings={bookings} onBook={(b) => setBookings((prev) => [...prev, b])} />}
                {active === 'maintenance' && <MaintenanceScreen tickets={tickets} setTickets={setTickets} onRaise={() => setMaintOpen(true)} />}
                {active === 'audit' && <AuditScreen assets={assets} />}
                {active === 'reports' && <ReportsScreen />}
                {active === 'logs' && <LogsScreen />}
                {active === 'org' && <OrgScreen />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AllocateDialog asset={allocateAsset} onClose={() => setAllocateAsset(null)} onAllocate={doAllocate} onRaiseTransfer={raiseTransfer} />
      <RegisterAssetDialog open={registerOpen} onClose={() => setRegisterOpen(false)} onAdd={(a) => setAssets((prev) => [a, ...prev])} />
      <RaiseMaintenanceDialog open={maintOpen} onClose={() => setMaintOpen(false)} assets={assets} onRaise={(t) => setTickets((prev) => [t, ...prev])} />
    </div>
  )
}

export default App
