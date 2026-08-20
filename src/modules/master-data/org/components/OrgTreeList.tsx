// src/modules/master-data/org/components/OrgTreeList.tsx

import type { OrgNode } from '../data/orgMockData'

function OrgStatusPill({ status, text }: { status: string; text: string }) {
  const className =
    status === 'active'
      ? 'bg-emerald-50 text-emerald-700'
      : status === 'draft'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-slate-100 text-slate-500'

  return (
    <span
      className={[
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        className,
      ].join(' ')}
    >
      {text}
    </span>
  )
}

export function OrgTreeList({
  items,
  selectedId,
  onSelect,
}: {
  items: OrgNode[]
  selectedId: string
  onSelect: (item: OrgNode) => void
}) {
  return (
    <section className="app-card overflow-hidden">
      <div className="border-b border-[var(--app-border)] px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">
          โครงสร้างองค์กร
        </p>
        <p className="text-xs text-slate-500">
          จัดการบริษัท สาขา แผนก และหน่วยงานที่ใช้ร่วมกันทั้งระบบ
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="erp-table min-w-full">
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ชื่อ</th>
            <th>ประเภท</th>
            <th>อยู่ภายใต้</th>
            <th>สถานะ</th>
            <th>แก้ไขล่าสุด</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              data-selected={item.id === selectedId}
              onClick={() => onSelect(item)}
              className="cursor-pointer"
            >
              <td>
                <p className="font-semibold text-violet-700">{item.code}</p>
              </td>

              <td>
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.companyName}</p>
              </td>

              <td>{item.typeText}</td>

              <td>{item.parentName ?? '-'}</td>

              <td>
                <OrgStatusPill status={item.status} text={item.statusText} />
              </td>

              <td>{item.updatedAt}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </section>
  )
}