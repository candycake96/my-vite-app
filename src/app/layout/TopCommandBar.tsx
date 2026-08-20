import * as Icons from 'lucide-react'

const { Bell, Building2, ChevronDown, Layers3, Menu, Search, WalletCards } = Icons

export function TopCommandBar({
  onToggleSidebar,
  sidebarOpen,
}: {
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}) {

  return (
    <header className="sticky top-0 z-50 h-16 w-full flex items-center gap-3 border-b border-[var(--app-border)] bg-base-100/90 px-4 backdrop-blur">
      <button
        aria-label="Toggle menu"
        aria-expanded={!!sidebarOpen}
        aria-controls="mobile-sidebar"
        onClick={() => onToggleSidebar?.()}
        className="btn btn-ghost btn-square"
      >
        {sidebarOpen ? <span className="text-lg">×</span> : <Menu size={20} />}
      </button>

      <div className="flex min-w-[180px] items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 text-white">
          <Layers3 size={20} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">ERP Workspace</p>
          <p className="text-xs text-slate-500">Modern Admin</p>
        </div>
      </div>

      <button className="hidden md:inline-flex btn btn-outline min-w-[160px] justify-between">
        <span className="inline-flex items-center gap-2">
          <WalletCards size={18} />
          Budget
        </span>
        <ChevronDown size={16} />
      </button>

      <label className="input input-bordered mx-auto hidden w-full max-w-xl items-center gap-2 rounded-2xl bg-white lg:flex">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          className="grow"
          placeholder="ค้นหาเอกสาร / ผู้ยื่น / แผน"
        />
        <kbd className="kbd kbd-sm">⌘</kbd>
        <kbd className="kbd kbd-sm">K</kbd>
      </label>

      <button className="btn btn-outline hidden min-w-[220px] justify-between lg:flex">
        <span className="inline-flex items-center gap-2">
          <Building2 size={18} />
          บริษัท ตัวอย่าง จำกัด
        </span>
        <ChevronDown size={16} />
      </button>

      <button className="btn btn-ghost btn-circle">
        <div className="indicator">
          <Bell size={20} />
          <span className="badge indicator-item badge-primary badge-xs">6</span>
        </div>
      </button>

      <button className="btn btn-ghost gap-2">
        <div className="avatar placeholder">
          <div className="w-9 rounded-full bg-violet-100 text-violet-700">
            <span>AD</span>
          </div>
        </div>
        <span className="hidden text-sm font-medium text-slate-700 md:inline">
          Admin
        </span>
        <ChevronDown size={16} />
      </button>
    </header>
  )
}