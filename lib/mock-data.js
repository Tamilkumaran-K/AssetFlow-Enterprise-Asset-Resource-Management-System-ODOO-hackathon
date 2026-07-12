// Mock data for AssetFlow

export const CATEGORIES = ['Laptop', 'Projector', 'Vehicle', 'Meeting Room', 'Camera', 'Monitor', 'Tablet']

export const DEPARTMENTS = [
  { id: 'd1', name: 'Engineering', head: 'Rahul Iyer', members: 42 },
  { id: 'd2', name: 'Design', head: 'Ananya Patel', members: 12 },
  { id: 'd3', name: 'Marketing', head: 'Vikram Singh', members: 18 },
  { id: 'd4', name: 'IT Ops', head: 'Priya Shah', members: 9 },
  { id: 'd5', name: 'Finance', head: 'Karthik Rao', members: 14 },
  { id: 'd6', name: 'HR', head: 'Meera Nair', members: 7 },
]

export const EMPLOYEES = [
  { id: 'e1', name: 'Priya Shah', dept: 'IT Ops', role: 'Admin', avatar: 'PS' },
  { id: 'e2', name: 'Rahul Iyer', dept: 'Engineering', role: 'Manager', avatar: 'RI' },
  { id: 'e3', name: 'Ananya Patel', dept: 'Design', role: 'Manager', avatar: 'AP' },
  { id: 'e4', name: 'Vikram Singh', dept: 'Marketing', role: 'Employee', avatar: 'VS' },
  { id: 'e5', name: 'Karthik Rao', dept: 'Finance', role: 'Employee', avatar: 'KR' },
  { id: 'e6', name: 'Meera Nair', dept: 'HR', role: 'Employee', avatar: 'MN' },
  { id: 'e7', name: 'Arjun Mehta', dept: 'Engineering', role: 'Employee', avatar: 'AM' },
  { id: 'e8', name: 'Sneha Kapoor', dept: 'Design', role: 'Employee', avatar: 'SK' },
]

// Statuses: available, allocated, maintenance, missing
export const ASSETS = [
  { id: 'a1', tag: 'AF-0114', name: 'MacBook Pro 16"', category: 'Laptop', status: 'allocated', location: 'HQ - Floor 3', serial: 'C02XF1YZLVDL', allocatedTo: 'Priya Shah', dept: 'IT Ops', since: '2025-02-11' },
  { id: 'a2', tag: 'AF-0062', name: 'Epson EB-U05 Projector', category: 'Projector', status: 'maintenance', location: 'HQ - Room B2', serial: 'PROJ-2451', allocatedTo: null, dept: null, since: null },
  { id: 'a3', tag: 'AF-0031', name: 'Dell XPS 15', category: 'Laptop', status: 'available', location: 'HQ - IT Store', serial: 'DXP-99120', allocatedTo: null, dept: null, since: null },
  { id: 'a4', tag: 'AF-0301', name: 'Sony A7 IV', category: 'Camera', status: 'available', location: 'HQ - Studio', serial: 'SONY-A7IV-771', allocatedTo: null, dept: null, since: null },
  { id: 'a5', tag: 'AF-0088', name: 'Toyota Innova', category: 'Vehicle', status: 'allocated', location: 'HQ - Parking', serial: 'MH12-XY-1288', allocatedTo: 'Vikram Singh', dept: 'Marketing', since: '2025-05-04' },
  { id: 'a6', tag: 'AF-0202', name: 'Room B2 - Boardroom', category: 'Meeting Room', status: 'available', location: 'HQ - Floor 2', serial: 'ROOM-B2', allocatedTo: null, dept: null, since: null },
  { id: 'a7', tag: 'AF-0115', name: 'MacBook Air M3', category: 'Laptop', status: 'allocated', location: 'HQ - Floor 3', serial: 'C02AIR-M3-991', allocatedTo: 'Ananya Patel', dept: 'Design', since: '2025-01-20' },
  { id: 'a8', tag: 'AF-0044', name: 'LG UltraFine 4K', category: 'Monitor', status: 'available', location: 'HQ - IT Store', serial: 'LG-UF4K-2210', allocatedTo: null, dept: null, since: null },
  { id: 'a9', tag: 'AF-0210', name: 'iPad Pro 12.9"', category: 'Tablet', status: 'allocated', location: 'HQ - Floor 4', serial: 'IPAD-129-5522', allocatedTo: 'Arjun Mehta', dept: 'Engineering', since: '2024-11-11' },
  { id: 'a10', tag: 'AF-0055', name: 'BenQ 4K Projector', category: 'Projector', status: 'available', location: 'HQ - Storage', serial: 'BENQ-4K-2019', allocatedTo: null, dept: null, since: null },
  { id: 'a11', tag: 'AF-0400', name: 'Room A1 - Focus Pod', category: 'Meeting Room', status: 'available', location: 'HQ - Floor 1', serial: 'ROOM-A1', allocatedTo: null, dept: null, since: null },
  { id: 'a12', tag: 'AF-0032', name: 'ThinkPad X1 Carbon', category: 'Laptop', status: 'allocated', location: 'Remote', serial: 'TP-X1C-7712', allocatedTo: 'Rahul Iyer', dept: 'Engineering', since: '2024-08-01' },
  { id: 'a13', tag: 'AF-0501', name: 'Honda City', category: 'Vehicle', status: 'available', location: 'HQ - Parking', serial: 'MH12-CI-4001', allocatedTo: null, dept: null, since: null },
  { id: 'a14', tag: 'AF-0121', name: 'MacBook Pro 14"', category: 'Laptop', status: 'available', location: 'HQ - IT Store', serial: 'C02MBP14-889', allocatedTo: null, dept: null, since: null },
  { id: 'a15', tag: 'AF-0089', name: 'DJI Ronin 4D', category: 'Camera', status: 'allocated', location: 'HQ - Studio', serial: 'DJI-R4D-101', allocatedTo: 'Sneha Kapoor', dept: 'Design', since: '2025-03-15' },
  { id: 'a16', tag: 'AF-0203', name: 'Room B3 - War Room', category: 'Meeting Room', status: 'maintenance', location: 'HQ - Floor 2', serial: 'ROOM-B3', allocatedTo: null, dept: null, since: null },
]

export const BOOKINGS = [
  { id: 'b1', assetTag: 'AF-0202', assetName: 'Room B2 - Boardroom', day: 1, start: 10, end: 11, user: 'Priya Shah', title: 'Weekly IT Sync' },
  { id: 'b2', assetTag: 'AF-0202', assetName: 'Room B2 - Boardroom', day: 1, start: 14, end: 15, user: 'Rahul Iyer', title: 'Sprint Planning' },
  { id: 'b3', assetTag: 'AF-0400', assetName: 'Room A1 - Focus Pod', day: 2, start: 9, end: 10, user: 'Ananya Patel', title: '1:1 Review' },
  { id: 'b4', assetTag: 'AF-0202', assetName: 'Room B2 - Boardroom', day: 3, start: 13, end: 15, user: 'Vikram Singh', title: 'Campaign Kickoff' },
  { id: 'b5', assetTag: 'AF-0400', assetName: 'Room A1 - Focus Pod', day: 4, start: 11, end: 12, user: 'Arjun Mehta', title: 'Architecture Review' },
  { id: 'b6', assetTag: 'AF-0055', assetName: 'BenQ 4K Projector', day: 2, start: 15, end: 17, user: 'Meera Nair', title: 'All-Hands Prep' },
]

export const MAINTENANCE = [
  { id: 'm1', assetTag: 'AF-0062', assetName: 'Epson EB-U05 Projector', status: 'pending', issue: 'Lamp flickering during use', raisedBy: 'Vikram Singh', priority: 'high', date: '2025-06-02' },
  { id: 'm2', assetTag: 'AF-0203', assetName: 'Room B3 - War Room', status: 'approved', issue: 'AC not cooling below 26°C', raisedBy: 'Meera Nair', priority: 'medium', date: '2025-06-04' },
  { id: 'm3', assetTag: 'AF-0088', assetName: 'Toyota Innova', status: 'assigned', issue: 'Service due — 30,000 km', raisedBy: 'Priya Shah', priority: 'low', date: '2025-06-05', tech: 'MotorHub Garage' },
  { id: 'm4', assetTag: 'AF-0121', assetName: 'MacBook Pro 14"', status: 'in_progress', issue: 'Battery drains rapidly', raisedBy: 'Sneha Kapoor', priority: 'medium', date: '2025-06-01', tech: 'Apple Care' },
  { id: 'm5', assetTag: 'AF-0032', assetName: 'ThinkPad X1 Carbon', status: 'in_progress', issue: 'Keyboard keys stuck', raisedBy: 'Rahul Iyer', priority: 'low', date: '2025-05-30', tech: 'Lenovo Service' },
  { id: 'm6', assetTag: 'AF-0044', assetName: 'LG UltraFine 4K', status: 'resolved', issue: 'HDMI port replaced', raisedBy: 'Arjun Mehta', priority: 'medium', date: '2025-05-24' },
]

export const ACTIVITY = [
  { id: 't1', type: 'allocation', text: 'MacBook Pro 16" (AF-0114) assigned to Priya Shah', time: '2 min ago', icon: 'user-plus', actor: 'Priya Shah', recipient: 'Priya Shah', category: 'allocation', unread: true },
  { id: 't2', type: 'booking', text: 'Booking confirmed — Room B2 (2:00–3:00 PM, Sprint Planning)', time: '18 min ago', icon: 'calendar', actor: 'Rahul Iyer', recipient: 'Rahul Iyer', category: 'booking', unread: true },
  { id: 't3', type: 'maintenance', text: 'Maintenance request approved — Projector AF-0062 lamp flickering', time: '1 hr ago', icon: 'wrench', actor: 'Priya Shah', recipient: 'Vikram Singh', category: 'maintenance', unread: true },
  { id: 't4', type: 'transfer', text: 'Transfer approved — MacBook Air M3 (AF-0115): Ananya Patel → Sneha Kapoor', time: '3 hr ago', icon: 'arrow-left-right', actor: 'Priya Shah', recipient: 'Sneha Kapoor', category: 'transfer', unread: false },
  { id: 't5', type: 'alert', text: 'Overdue return alert — DJI Ronin 4D (AF-0089) overdue by 5 days. Sneha Kapoor notified.', time: '5 hr ago', icon: 'alert-triangle', actor: 'System', recipient: 'Sneha Kapoor', category: 'alert', unread: true },
  { id: 't6', type: 'audit', text: 'Audit discrepancy flagged — 2 assets missing on Floor 2 during Q2 physical check', time: '6 hr ago', icon: 'clipboard-check', actor: 'Priya Shah', recipient: 'all', category: 'audit', unread: false },
  { id: 't7', type: 'booking', text: 'Booking cancelled — BenQ 4K Projector (All-Hands Prep) by Meera Nair', time: '8 hr ago', icon: 'calendar', actor: 'Meera Nair', recipient: 'Meera Nair', category: 'booking', unread: false },
  { id: 't8', type: 'maintenance', text: 'Maintenance rejected — Room B3 AC repair request closed (out of scope)', time: 'Yesterday', icon: 'wrench', actor: 'Priya Shah', recipient: 'Meera Nair', category: 'maintenance', unread: false },
  { id: 't9', type: 'booking', text: 'Booking reminder — Room A1 Focus Pod at 9:00 AM tomorrow (1:1 Review, Ananya Patel)', time: 'Yesterday', icon: 'calendar', actor: 'System', recipient: 'Ananya Patel', category: 'booking', unread: false },
  { id: 't10', type: 'allocation', text: 'iPad Pro 12.9" (AF-0210) handed over to Arjun Mehta (Engineering)', time: '2 days ago', icon: 'user-plus', actor: 'Priya Shah', recipient: 'Arjun Mehta', category: 'allocation', unread: false },
  { id: 't11', type: 'transfer', text: 'Transfer request raised — ThinkPad X1 Carbon: Rahul Iyer → Karthik Rao (pending approval)', time: '2 days ago', icon: 'arrow-left-right', actor: 'Rahul Iyer', recipient: 'Priya Shah', category: 'transfer', unread: false },
  { id: 't12', type: 'return', text: 'Asset returned — Honda City (AF-0501) checked in. Good condition.', time: '2 days ago', icon: 'undo-2', actor: 'Vikram Singh', recipient: 'all', category: 'return', unread: false },
  { id: 't13', type: 'audit', text: 'Q2 Asset audit checkpoint completed — Floor 2 (32/34 assets verified)', time: '3 days ago', icon: 'clipboard-check', actor: 'Priya Shah', recipient: 'all', category: 'audit', unread: false },
  { id: 't14', type: 'alert', text: 'Overdue return alert — Toyota Innova (AF-0088) service overdue by 12 days', time: '3 days ago', icon: 'alert-triangle', actor: 'System', recipient: 'Vikram Singh', category: 'alert', unread: false },
  { id: 't15', type: 'maintenance', text: 'Maintenance in progress — MacBook Pro 14" battery replacement (Apple Care)', time: '4 days ago', icon: 'wrench', actor: 'Priya Shah', recipient: 'Sneha Kapoor', category: 'maintenance', unread: false },
  { id: 't16', type: 'booking', text: 'Booking confirmed — Room B2 Boardroom (Campaign Kickoff, Vikram Singh)', time: '5 days ago', icon: 'calendar', actor: 'Vikram Singh', recipient: 'Vikram Singh', category: 'booking', unread: false },
]

export const IDLE_ASSETS = [
  { tag: 'AF-0301', name: 'Sony A7 IV', category: 'Camera', days: 62, location: 'HQ - Studio' },
  { tag: 'AF-0501', name: 'Honda City', category: 'Vehicle', days: 45, location: 'HQ - Parking' },
  { tag: 'AF-0055', name: 'BenQ 4K Projector', category: 'Projector', days: 38, location: 'HQ - Storage' },
  { tag: 'AF-0044', name: 'LG UltraFine 4K', category: 'Monitor', days: 28, location: 'HQ - IT Store' },
]

export const UTILIZATION_BY_DEPT = [
  { dept: 'Engineering', utilization: 88 },
  { dept: 'Design', utilization: 72 },
  { dept: 'Marketing', utilization: 61 },
  { dept: 'IT Ops', utilization: 94 },
  { dept: 'Finance', utilization: 44 },
  { dept: 'HR', utilization: 39 },
]

export const MAINTENANCE_TREND = [
  { month: 'Jan', count: 8 },
  { month: 'Feb', count: 12 },
  { month: 'Mar', count: 6 },
  { month: 'Apr', count: 14 },
  { month: 'May', count: 9 },
  { month: 'Jun', count: 5 },
]

export const KPIS = [
  { key: 'available', label: 'Available', value: 128, delta: '+8', tone: 'emerald', icon: 'check-circle-2' },
  { key: 'allocated', label: 'Allocated', value: 76, delta: '+2', tone: 'neutral', icon: 'users' },
  { key: 'maintenance', label: 'Maintenance', value: 4, delta: '−1', tone: 'amber', icon: 'wrench' },
  { key: 'returns', label: 'Upcoming Returns', value: 12, delta: '+3', tone: 'indigo', icon: 'undo-2' },
  { key: 'transfers', label: 'Pending Transfers', value: 3, delta: '=', tone: 'amber', icon: 'arrow-left-right' },
  { key: 'bookings', label: 'Active Bookings', value: 9, delta: '+4', tone: 'indigo', icon: 'calendar-check' },
]
