import { NavLink } from 'react-router-dom'
import { Building2, BriefcaseBusiness, ChartNoAxesCombined, Home, UserRound } from 'lucide-react'

const quickLinks = [
  { to: '/people', label: 'พนักงาน', icon: UserRound, tone: 'violet' },
  { to: '/master-data/org', label: 'องค์กร', icon: Building2, tone: 'slate' },
  { to: '/master-data/company', label: 'บริษัท', icon: BriefcaseBusiness, tone: 'slate' },
  { to: '/budget/plans', label: 'งบประมาณ', icon: ChartNoAxesCombined, tone: 'slate' },
]

export function HomePage() {
  return (
    <main className="app-scrollbar min-w-0 flex-1 overflow-auto px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
            <Home size={16} />
            Home
          </div>
          <h1 className="text-3xl font-semibold text-slate-950">หน้าแรก</h1>
          <p className="mt-2 text-sm text-slate-500">เริ่มต้นการใช้งานจากหน้าหลักแยก เพื่อไม่กระทบส่วนอื่น ๆ ของระบบ</p>
        </div>

        <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="app-card p-4">
            <p className="text-sm text-slate-500">พนักงาน</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-2xl font-semibold">86</span>
              <UserRound className="text-violet-600" size={20} />
            </div>
          </div>
          <div className="app-card p-4">
            <p className="text-sm text-slate-500">บริษัท</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-2xl font-semibold">12</span>
              <BriefcaseBusiness className="text-slate-500" size={20} />
            </div>
          </div>
          <div className="app-card p-4">
            <p className="text-sm text-slate-500">สาขา</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-2xl font-semibold">4</span>
              <Building2 className="text-slate-500" size={20} />
            </div>
          </div>
        </section>

        <section className="app-card p-4">
          <p className="text-sm font-semibold text-slate-900">Quick Access</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {quickLinks.map(({ to, label, icon: Icon, tone }) => (
              <NavLink
                key={to}
                to={to}
                className={[
                  'flex items-center gap-3 rounded-2xl border p-4 text-sm font-medium transition',
                  tone === 'violet'
                    ? 'border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100',
                ].join(' ')}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default HomePage
