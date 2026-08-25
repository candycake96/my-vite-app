import { NavLink, useLocation } from 'react-router-dom'
import {
  ChartNoAxesCombined,
  FileText,
  Home,
  Package,
  Settings,
  ShoppingCart,
  UserRound,
} from 'lucide-react'

function RailLink({ to, children, match }: { to: string; children: React.ReactNode; match: boolean }) {
  const base = 'grid h-11 w-11 place-items-center rounded-2xl transition'
  const activeClass = 'bg-[var(--app-primary)] text-white shadow-md'
  const inactiveClass = 'text-slate-500 hover:bg-violet-50 hover:text-violet-700'

  return (
    <NavLink to={to} className={[base, match ? activeClass : inactiveClass].join(' ')} aria-current={match ? 'page' : undefined}>
      {children}
    </NavLink>
  )
}

export function IconRail() {
  const { pathname } = useLocation()

  const isHome = pathname === '/' || pathname.startsWith('/home')
  const isMaster = pathname.startsWith('/master-data')
  const isBudget = pathname.startsWith('/budget')
  const isInventory = pathname.startsWith('/inventory')
  const isPeople = pathname.startsWith('/people') || isHome

  return (
    <aside className="hidden lg:flex w-16 flex-col items-center gap-3 border-r border-[var(--app-border)] bg-white/80 py-4 h-full shrink-0 overflow-y-auto">
      <RailLink to="/home" match={isHome}>
        <Home size={21} />
      </RailLink>

      <RailLink to="/master-data/org" match={isMaster && pathname.startsWith('/master-data/org')}>
        <FileText size={21} />
      </RailLink>

      <RailLink to="/budget/plans" match={isBudget && pathname.startsWith('/budget/plans')}>
        <ChartNoAxesCombined size={21} />
      </RailLink>

      <RailLink to="/inventory/stock-count" match={isInventory && pathname.startsWith('/inventory/stock-count')}>
        <ShoppingCart size={21} />
      </RailLink>

      <RailLink to="/master-data/company" match={isMaster && pathname.startsWith('/master-data/company')}>
        <Package size={21} />
      </RailLink>

      <RailLink to="/people" match={isPeople}>
        <UserRound size={21} />
      </RailLink>

      <div className="flex-1" />

      <RailLink to="#" match={false}>
        <Settings size={21} />
      </RailLink>
    </aside>
  )
}