import {
  ChartNoAxesCombined,
  FileText,
  Home,
  Package,
  Settings,
  ShoppingCart,
  UserRound,
} from 'lucide-react'

function IconButton({
  active,
  children,
}: {
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      className={[
        'grid h-11 w-11 place-items-center rounded-2xl transition',
        active
          ? 'bg-[var(--app-primary)] text-white shadow-md'
          : 'text-slate-500 hover:bg-violet-50 hover:text-violet-700',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function IconRail() {
  return (
    <aside className="hidden lg:flex w-16 flex-col items-center gap-3 border-r border-[var(--app-border)] bg-white/80 py-4 h-full shrink-0 overflow-y-auto">
      <IconButton>
        <Home size={21} />
      </IconButton>

      <IconButton active>
        <FileText size={21} />
      </IconButton>

      <IconButton>
        <ChartNoAxesCombined size={21} />
      </IconButton>

      <IconButton>
        <ShoppingCart size={21} />
      </IconButton>

      <IconButton>
        <Package size={21} />
      </IconButton>

      <IconButton>
        <UserRound size={21} />
      </IconButton>

      <div className="flex-1" />

      <IconButton>
        <Settings size={21} />
      </IconButton>
    </aside>
  )
}