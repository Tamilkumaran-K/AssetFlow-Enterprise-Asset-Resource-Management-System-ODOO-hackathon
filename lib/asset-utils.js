// Small helpers for status chip colours

export const STATUS_META = {
  available: { label: 'Available', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  allocated: { label: 'Allocated', className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
  maintenance: { label: 'Maintenance', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  missing: { label: 'Missing', className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
}

export const KANBAN_COLS = [
  { key: 'pending', label: 'Pending', accent: 'text-slate-500' },
  { key: 'approved', label: 'Approved', accent: 'text-indigo-500' },
  { key: 'assigned', label: 'Technician Assigned', accent: 'text-amber-500' },
  { key: 'in_progress', label: 'In Progress', accent: 'text-blue-500' },
  { key: 'resolved', label: 'Resolved', accent: 'text-emerald-500' },
]

export const PRIORITY_META = {
  high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
}
