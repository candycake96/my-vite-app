import * as Icons from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

const {
  Building2,
  Boxes,
  ClipboardList,
  ContactRound,
  LayoutDashboard,
  Settings,
  UserRound,
  ChartNoAxesCombined,
  FileText,
  Package,
} = Icons

function SubnavItem({ to, icon, label, count, onClick, disabled }: { to: string; icon: React.ReactNode; label: string; count?: number; onClick?: () => void; disabled?: boolean }) {
  return (
    <NavLink
      to={to}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault()
          return
        }
        onClick?.()
      }}
      className={({ isActive }: { isActive: boolean }) => [
        'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition',
        disabled
          ? 'text-slate-300 pointer-events-none'
          : isActive
          ? 'bg-violet-50 text-violet-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      ].join(' ')}
    >
      <span>{icon}</span>
      <span className="flex-1 font-medium">{label}</span>

      {count !== undefined && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          {count}
        </span>
      )}
    </NavLink>
  )
}

export function ModuleSubnav({
  className,
  onClose,
}: {
  className?: string
  onClose?: () => void
}) {
  const base = 'border-r border-[var(--app-border)] bg-white p-4'
  const defaultLayout = 'hidden lg:flex lg:flex-col h-full shrink-0 overflow-y-auto w-72'
  const classes = className ? `${className} ${base}` : `${defaultLayout} ${base}`

  const { pathname } = useLocation()

  const moduleKey = pathname.startsWith('/budget')
    ? 'budget'
    : pathname.startsWith('/inventory')
    ? 'inventory'
    : pathname.startsWith('/master-data')
    ? 'master-data'
    : 'root'

  const menus: Record<string, Array<{ to: string; icon: React.ReactNode; label: string; count?: number; disabled?: boolean }>> = {
    'master-data': [
      { to: '/master-data/overview', icon: <LayoutDashboard size={18} />, label: 'ภาพรวม' },
      { to: '/master-data/org', icon: <Building2 size={18} />, label: 'องค์กร', count: 3 },
      { to: '/master-data/company', icon: <Boxes size={18} />, label: 'บริษัท', count: 12 },
      { to: '/master-data/branch', icon: <ContactRound size={18} />, label: 'สาขา', count: 4 },
      { to: '#', icon: <UserRound size={18} />, label: 'พนักงาน', count: 86, disabled: true },
      { to: '#', icon: <Settings size={18} />, label: 'ตั้งค่า', disabled: true },
    ],
    budget: [
      { to: '/budget/plans', icon: <ChartNoAxesCombined size={18} />, label: 'แผนงบประมาณ' },
      { to: '#', icon: <ClipboardList size={18} />, label: 'เปิดใช้งานงบ', disabled: true },
      { to: '#', icon: <Boxes size={18} />, label: 'โยกงบ', disabled: true },
      { to: '#', icon: <ContactRound size={18} />, label: 'งานอนุมัติ', disabled: true },
      { to: '#', icon: <FileText size={18} />, label: 'รายงาน', disabled: true },
    ],
    inventory: [
      { to: '/inventory/stock-count', icon: <ClipboardList size={18} />, label: 'นับสต็อก' },
      { to: '#', icon: <FileText size={18} />, label: 'ใบเบิกสินค้า', disabled: true },
      { to: '#', icon: <Package size={18} />, label: 'โอนย้าย', disabled: true },
      { to: '#', icon: <ChartNoAxesCombined size={18} />, label: 'ปรับปรุงสต็อก', disabled: true },
      { to: '#', icon: <FileText size={18} />, label: 'Ledger', disabled: true },
    ],
    root: [],
  }

  const currentMenu = menus[moduleKey] || menus['master-data']

  return (
    <aside className={classes}>
      {onClose && (
        <div className="mb-4 flex items-center justify-end lg:hidden">
          <button
            aria-label="Close menu"
            className="btn btn-ghost"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      )}
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-50 text-violet-700">
          <ClipboardList size={22} />
        </div>

        <div>
          <h2 className="text-base font-semibold">Master Data</h2>
          <p className="text-xs text-slate-500">ข้อมูลพื้นฐานระบบ</p>
        </div>
      </div>

      <nav className="space-y-2">
        {currentMenu.map((m) => (
          <SubnavItem key={m.label} to={m.to} icon={m.icon} label={m.label + (m.disabled ? ' (เร็ว ๆ นี้)' : '')} count={m.count} onClick={onClose} disabled={m.disabled} />
        ))}
      </nav>
    </aside>
  )
}