// src/modules/master-data/org/components/OrgContextPanel.tsx

import type { OrgNode } from '../data/orgMockData'

export function OrgContextPanel({ item }: { item: OrgNode }) {
  return (
    <aside className="hidden w-[390px] shrink-0 border-l border-[var(--app-border)] bg-white/90 p-5 xl:block">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Context Panel
          </p>
          <h2 className="mt-1 text-lg font-semibold">รายละเอียดองค์กร</h2>
        </div>

        <button className="btn btn-ghost btn-circle btn-sm">✕</button>
      </div>

      <div className="app-card mb-4 p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-semibold text-slate-950">{item.code}</p>
            <p className="text-sm text-slate-500">{item.typeText}</p>
          </div>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {item.statusText}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-slate-400">ชื่อ</p>
            <p className="font-medium text-slate-800">{item.name}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400">บริษัท</p>
            <p className="font-medium text-slate-800">{item.companyName}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400">อยู่ภายใต้</p>
            <p className="font-medium text-slate-800">
              {item.parentName ?? '-'}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">แก้ไขล่าสุด</p>
            <p className="font-medium text-slate-800">{item.updatedAt}</p>
          </div>
        </div>
      </div>

      <div className="app-card mb-4 p-4">
        <h3 className="mb-3 text-sm font-semibold">สิ่งที่เชื่อมโยง</h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
            <span>ผู้ใช้งาน</span>
            <span className="font-semibold text-slate-900">12</span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
            <span>คลังสินค้า</span>
            <span className="font-semibold text-slate-900">3</span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
            <span>เอกสารที่ใช้งาน</span>
            <span className="font-semibold text-slate-900">128</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="btn btn-primary rounded-2xl">แก้ไข</button>
        <button className="btn btn-outline rounded-2xl">ปิดใช้งาน</button>
        <button className="btn btn-outline col-span-2 rounded-2xl">
          เปิดรายละเอียดเต็ม
        </button>
      </div>
    </aside>
  )
}