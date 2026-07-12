// Small helpers for status chip colours

export const STATUS_META = {
  available: { label: 'Available', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  allocated: { label: 'Allocated', className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
  maintenance: { label: 'Maintenance', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  missing: { label: 'Missing', className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
}

export const KANBAN_COLS = [
  { key: 'Pending',            label: 'Pending',            accent: 'text-slate-500' },
  { key: 'Approved',           label: 'Approved',           accent: 'text-indigo-500' },
  { key: 'Rejected',           label: 'Rejected',           accent: 'text-rose-500' },
  { key: 'Technician Assigned',label: 'Technician Assigned',accent: 'text-blue-500' },
  { key: 'In Progress',        label: 'In Progress',        accent: 'text-amber-500' },
  { key: 'Resolved',           label: 'Resolved',           accent: 'text-emerald-500' },
]

export const PRIORITY_META = {
  High: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
}
