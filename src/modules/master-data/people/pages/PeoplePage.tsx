export function PeoplePage() {
  return (
    <main className="app-scrollbar min-w-0 flex-1 overflow-auto px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <p className="mb-2 text-sm font-medium text-violet-700">Master Data / People</p>
          <h1 className="text-3xl font-semibold text-slate-950">พนักงาน</h1>
          <p className="mt-2 text-sm text-slate-500">จัดการข้อมูลพนักงานและบุคลากรในระบบ</p>
        </div>

        <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="app-card p-4">Total Employees<br /><span className="text-2xl font-semibold">86</span></div>
          <div className="app-card p-4">Active<br /><span className="text-2xl font-semibold">79</span></div>
          <div className="app-card p-4">New This Month<br /><span className="text-2xl font-semibold">4</span></div>
          <div className="app-card p-4">Departments<br /><span className="text-2xl font-semibold">12</span></div>
        </section>

        <section className="app-card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Employees</p>
            <button className="btn btn-primary btn-sm">Add Employee</button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>EMP-1001</td>
                  <td>นภัสพร วงศ์กาญจน์</td>
                  <td>Sales</td>
                  <td>Active</td>
                </tr>
                <tr>
                  <td>EMP-1002</td>
                  <td>กิตติศักดิ์ รัตนกุล</td>
                  <td>Finance</td>
                  <td>Active</td>
                </tr>
                <tr>
                  <td>EMP-1003</td>
                  <td>มนัสวีร์ สุวรรณกุล</td>
                  <td>Operations</td>
                  <td>On Leave</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

export default PeoplePage
