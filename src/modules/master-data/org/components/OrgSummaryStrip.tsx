// src/modules/master-data/org/components/OrgSummaryStrip.tsx

const summaryItems = [
  { label: 'บริษัท', value: '1', tone: 'violet' },
  { label: 'สาขา', value: '2', tone: 'blue' },
  { label: 'แผนก', value: '8', tone: 'emerald' },
  { label: 'รอตรวจสอบ', value: '1', tone: 'amber' },
]

export function OrgSummaryStrip() {
  return (
    <section className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3 xl:grid-cols-4">
      {summaryItems.map((item) => (
        <div key={item.label} className="app-card flex items-center gap-4 p-4">
          <div
            className={[
              'grid h-12 w-12 place-items-center rounded-2xl text-lg font-semibold',
              item.tone === 'violet' && 'bg-violet-50 text-violet-700',
              item.tone === 'blue' && 'bg-blue-50 text-blue-700',
              item.tone === 'emerald' && 'bg-emerald-50 text-emerald-700',
              item.tone === 'amber' && 'bg-amber-50 text-amber-700',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {item.value}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">{item.label}</p>
            <p className="text-xs text-slate-500">รายการ</p>
          </div>
        </div>
      ))}
    </section>
  )
}