export function BranchPage() {
  return (
    <main className="app-scrollbar min-w-0 flex-1 overflow-auto px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <p className="mb-2 text-sm font-medium text-violet-700">Master Data / Branch</p>
          <h1 className="text-3xl font-semibold text-slate-950">สาขา</h1>
          <p className="mt-2 text-sm text-slate-500">จัดการข้อมูลสาขา</p>
        </div>

        <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="app-card p-4">Total Branches<br/><span className="text-2xl font-semibold">4</span></div>
          <div className="app-card p-4">Active<br/><span className="text-2xl font-semibold">4</span></div>
        </section>

        <section className="app-card p-4">
          <p className="text-sm font-semibold text-slate-900">Branches</p>
          <div className="mt-4 overflow-x-auto">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Company</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>BR-BKK</td>
                  <td>สาขากรุงเทพฯ</td>
                  <td>บริษัท ตัวอย่าง จำกัด</td>
                </tr>
                <tr>
                  <td>BR-CHI</td>
                  <td>สาขาเชียงใหม่</td>
                  <td>บริษัท ตัวอย่าง จำกัด</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

export default BranchPage
