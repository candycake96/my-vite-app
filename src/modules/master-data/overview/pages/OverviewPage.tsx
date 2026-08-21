import { ChartNoAxesCombined, UserRound, Building2 } from 'lucide-react'

export function OverviewPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-medium text-violet-700">Master Data / ภาพรวม</p>
        <h1 className="text-2xl font-semibold text-slate-900">ภาพรวม</h1>
        <p className="mt-2 text-sm text-slate-500">สรุปภาพรวมระบบและสถานะสำคัญ</p>
      </div>

      <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="app-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">บริษัท</p>
              <p className="text-2xl font-semibold">12</p>
            </div>
            <div className="text-violet-600">
              <ChartNoAxesCombined size={28} />
            </div>
          </div>
        </div>

        <div className="app-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">สาขา</p>
              <p className="text-2xl font-semibold">4</p>
            </div>
            <div className="text-blue-600">
              <UserRound size={28} />
            </div>
          </div>
        </div>

        <div className="app-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">เอกสาร</p>
              <p className="text-2xl font-semibold">1,280</p>
            </div>
            <div className="text-emerald-600">
              <Building2 size={28} />
            </div>
          </div>
        </div>

        <div className="app-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">ผู้ใช้งาน</p>
              <p className="text-2xl font-semibold">86</p>
            </div>
            <div className="text-amber-600">
              <UserRound size={28} />
            </div>
          </div>
        </div>
      </section>

      <section className="app-card p-4">
        <h2 className="text-lg font-semibold mb-3">กิจกรรมล่าสุด</h2>
        <div className="w-full overflow-x-auto">
          <table className="erp-table min-w-full">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>เหตุการณ์</th>
                <th>ผู้ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>20 ส.ค. 2569</td>
                <td>สร้างบริษัท ตัวอย่าง จำกัด</td>
                <td>Admin</td>
              </tr>
              <tr>
                <td>19 ส.ค. 2569</td>
                <td>เพิ่มสาขา สาขากรุงเทพฯ</td>
                <td>Admin</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default OverviewPage
