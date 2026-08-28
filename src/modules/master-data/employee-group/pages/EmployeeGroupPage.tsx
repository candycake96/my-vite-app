import { useEffect, useMemo, useState } from 'react'
import { companyApi, type Company } from '../../company/services/companyApi'
import { employeeGroupApi, type EmployeeGroup } from '../services/employeeGroupApi'

const emptyForm: EmployeeGroup = {
  companyId: '', code: '', nameTh: '', nameEn: '', description: '', isActive: true,
}

export function EmployeeGroupPage() {
  const [groups, setGroups] = useState<EmployeeGroup[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [form, setForm] = useState<EmployeeGroup>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [groupData, companyData] = await Promise.all([employeeGroupApi.list(), companyApi.list()])
        setGroups(Array.isArray(groupData) ? groupData : [])
        setCompanies(Array.isArray(companyData) ? companyData : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลกลุ่มพนักงานได้')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const activeCount = useMemo(() => groups.filter((group) => group.isActive).length, [groups])
  const companyNames = useMemo(() => new Map(
    companies.map((company) => [company.id, company.nameTh || company.nameEn || company.code]),
  ), [companies])
  const change = (field: keyof EmployeeGroup, value: string | boolean) => setForm((current) => ({ ...current, [field]: value }))
  const closeForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setIsFormOpen(false)
  }
  const openCreate = () => {
    setForm({ ...emptyForm, companyId: companies[0]?.id ?? '' })
    setEditingId(null)
    setIsFormOpen(true)
  }
  const openEdit = (group: EmployeeGroup) => {
    setForm({ ...emptyForm, ...group, nameEn: group.nameEn ?? '', description: group.description ?? '' })
    setEditingId(group.id ?? null)
    setIsFormOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    const payload: Partial<EmployeeGroup> = {
      companyId: form.companyId,
      code: form.code.trim(),
      nameTh: form.nameTh.trim(),
      nameEn: form.nameEn?.trim() || null,
      description: form.description?.trim() || null,
      isActive: form.isActive,
    }
    try {
      if (editingId) {
        const updated = await employeeGroupApi.update(editingId, payload)
        setGroups((current) => current.map((group) => group.id === editingId ? { ...group, ...payload, ...updated } : group))
      } else {
        const created = await employeeGroupApi.create(payload)
        setGroups((current) => [created, ...current])
      }
      closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกข้อมูลกลุ่มพนักงานได้')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (group: EmployeeGroup) => {
    if (!group.id || !window.confirm(`ยืนยันการลบกลุ่มพนักงาน ${group.code}?`)) return
    try {
      setError('')
      await employeeGroupApi.remove(group.id)
      setGroups((current) => current.filter((item) => item.id !== group.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถลบข้อมูลกลุ่มพนักงานได้')
    }
  }

  return <main className="app-scrollbar min-w-0 flex-1 overflow-auto px-6 py-6">
    <div className="mx-auto max-w-6xl">
      <div className="mb-7"><p className="mb-2 text-sm font-medium text-violet-700">Master Data / Employee Group</p><h1 className="text-3xl font-semibold text-slate-950">กลุ่มพนักงาน</h1><p className="mt-2 text-sm text-slate-500">จัดการกลุ่มพนักงานของแต่ละบริษัทในระบบ</p></div>
      <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2"><Stat label="Total Groups" value={groups.length} /><Stat label="Active" value={activeCount} /></section>
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      <section className="app-card p-4">
        <div className="mb-4 flex items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-900">Employee Groups</p><button type="button" className="erp-primary-btn px-4 py-2 text-sm" onClick={openCreate}>New</button></div>
        {loading ? <Empty text="Loading employee groups..." /> : groups.length === 0 ? <Empty text="No employee groups found" /> : <div className="overflow-x-auto"><table className="erp-table w-full">
          <thead><tr><th>Code</th><th>Name</th><th>Company</th><th>Description</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{groups.map((group) => <tr key={group.id ?? `${group.companyId}-${group.code}`}>
            <td>{group.code}</td><td><div className="font-medium text-slate-800">{group.nameTh || '-'}</div>{group.nameEn && <div className="text-xs text-slate-500">{group.nameEn}</div>}</td>
            <td>{companyNames.get(group.companyId) || group.companyId}</td><td>{group.description || '-'}</td>
            <td><span className={`rounded-full px-2 py-1 text-xs font-medium ${group.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{group.isActive ? 'Active' : 'Inactive'}</span></td>
            <td><div className="flex gap-2"><button type="button" className="erp-action-btn erp-action-btn--edit" onClick={() => openEdit(group)}>Edit</button><button type="button" className="erp-action-btn erp-action-btn--delete" onClick={() => handleDelete(group)}>Delete</button></div></td>
          </tr>)}</tbody>
        </table></div>}
      </section>
    </div>

    {isFormOpen && <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]">
      <div className="absolute inset-0" onClick={closeForm} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-700">Employee Group</p><h2 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Employee Group' : 'New Employee Group'}</h2></div><button type="button" className="erp-action-btn erp-action-btn--delete btn-sm" onClick={closeForm}>Close</button></div>
        <div className="px-5 py-5"><form className="erp-form md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="erp-field text-sm font-medium text-slate-700 md:col-span-2"><span>Company</span><select className="erp-input" value={form.companyId} onChange={(event) => change('companyId', event.target.value)} required><option value="">Select company</option>{companies.map((company) => <option key={company.id ?? company.code} value={company.id}>{company.nameTh || company.nameEn || company.code}</option>)}</select></label>
          <Field label="Code" value={form.code} onChange={(value) => change('code', value)} required /><Field label="Name (TH)" value={form.nameTh} onChange={(value) => change('nameTh', value)} required /><Field label="Name (EN)" value={form.nameEn ?? ''} onChange={(value) => change('nameEn', value)} full />
          <label className="erp-field text-sm font-medium text-slate-700 md:col-span-2"><span>Description</span><textarea className="erp-textarea" rows={3} value={form.description ?? ''} onChange={(event) => change('description', event.target.value)} /></label>
          <label className="erp-inline-check md:col-span-2"><input type="checkbox" className="erp-checkbox" checked={form.isActive} onChange={(event) => change('isActive', event.target.checked)} />Active</label>
          <div className="flex justify-end gap-3 md:col-span-2"><button type="button" className="btn btn-ghost" onClick={closeForm}>Cancel</button><button type="submit" className="erp-primary-btn" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Employee Group'}</button></div>
        </form></div>
      </div>
    </div>}
  </main>
}

function Stat({ label, value }: { label: string, value: number }) { return <div className="app-card p-4"><p className="text-sm text-slate-500">{label}</p><span className="mt-2 block text-2xl font-semibold">{value}</span></div> }
function Empty({ text }: { text: string }) { return <div className="py-8 text-center text-sm text-slate-500">{text}</div> }
function Field({ label, value, onChange, required, full }: { label: string, value: string, onChange: (value: string) => void, required?: boolean, full?: boolean }) { return <label className={`erp-field text-sm font-medium text-slate-700 ${full ? 'md:col-span-2' : ''}`}><span>{label}</span><input className="erp-input" value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label> }

export default EmployeeGroupPage
