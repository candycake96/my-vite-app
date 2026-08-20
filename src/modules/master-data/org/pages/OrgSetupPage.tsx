// src/modules/master-data/org/pages/OrgSetupPage.tsx

import { useState } from 'react'
import * as Icons from 'lucide-react'

const { Plus, Search, SlidersHorizontal } = Icons
import { OrgContextPanel } from '../components/OrgContextPanel.tsx'
import { OrgSummaryStrip } from '../components/OrgSummaryStrip.tsx'
import { OrgTreeList } from '../components/OrgTreeList.tsx'
import { orgNodes } from '../data/orgMockData.ts'
import type { OrgNode } from '../data/orgMockData.ts'

export function OrgSetupPage() {
  const [selected, setSelected] = useState<OrgNode>(orgNodes[0])

  return (
    <>
      <div className="py-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-violet-700">
                Master Data / Organization
              </p>

              <h1 className="text-3xl font-semibold text-slate-950">
                กำหนดโครงสร้างองค์กร
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                จัดการบริษัท สาขา แผนก และหน่วยงานที่เป็นฐานกลางของระบบ
              </p>
            </div>

            <button className="btn btn-primary rounded-2xl">
              <Plus size={18} />
              เพิ่มหน่วยงาน
            </button>
          </div>

          <section className="app-card mb-5 p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <label className="input input-bordered input-sm flex w-full max-w-md items-center gap-2 rounded-xl">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  className="grow"
                  placeholder="ค้นหารหัส / ชื่อองค์กร / สาขา / แผนก"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <select className="select select-bordered select-sm rounded-xl">
                  <option>ทุกประเภท</option>
                  <option>บริษัท</option>
                  <option>สาขา</option>
                  <option>แผนก</option>
                </select>

                <select className="select select-bordered select-sm rounded-xl">
                  <option>ทุกสถานะ</option>
                  <option>ใช้งาน</option>
                  <option>รอตรวจสอบ</option>
                  <option>ปิดใช้งาน</option>
                </select>

                <button className="btn btn-outline btn-sm rounded-xl">
                  <SlidersHorizontal size={16} />
                  ตัวกรอง
                </button>
              </div>
            </div>
          </section>

          <OrgSummaryStrip />

          <OrgTreeList
            items={orgNodes}
            selectedId={selected.id}
            onSelect={setSelected}
          />
        </div>
      </div>

      <OrgContextPanel item={selected} />
    </>
  )
}