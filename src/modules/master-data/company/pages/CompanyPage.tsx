export function CompanyPage() {
  return (
    <main className="app-scrollbar min-w-0 flex-1 overflow-auto px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <p className="mb-2 text-sm font-medium text-violet-700">Master Data / Company</p>
          <h1 className="text-3xl font-semibold text-slate-950">บริษัท</h1>
          <p className="mt-2 text-sm text-slate-500">จัดการข้อมูลบริษัทในระบบ</p>
        </div>

        <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="app-card p-4">Total Companies<br/><span className="text-2xl font-semibold">12</span></div>
          <div className="app-card p-4">Active<br/><span className="text-2xl font-semibold">9</span></div>
        </section>

        <section className="app-card p-4">
          <p className="text-sm font-semibold text-slate-900">Companies</p>
          <div className="mt-4 overflow-x-auto">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>COM-001</td>
                  <td>บริษัท ตัวอย่าง จำกัด</td>
                  <td>Active</td>
                </tr>
                <tr>
                  <td>COM-002</td>
                  <td>บริษัท ตัวอย่าง 2</td>
                  <td>Inactive</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

export default CompanyPage
