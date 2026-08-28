import { useEffect, useMemo, useState } from 'react'
import { companyApi, type Company } from '../../company/services/companyApi'
import { departmentApi, type Department } from '../services/departmentApi'

const emptyForm: Department = { companyId: '', code: '', nameTh: '', nameEn: '', isActive: true }

export function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [form, setForm] = useState<Department>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [departmentData, companyData] = await Promise.all([departmentApi.list(), companyApi.list()])
        setDepartments(Array.isArray(departmentData) ? departmentData : [])
        setCompanies(Array.isArray(companyData) ? companyData : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลแผนกได้')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const activeCount = useMemo(() => departments.filter((department) => department.isActive).length, [departments])
  const companyNames = useMemo(() => new Map(
    companies.map((company) => [company.id, company.nameTh || company.nameEn || company.code]),
  ), [companies])

  const change = (field: keyof Department, value: string | boolean) => setForm((current) => ({ ...current, [field]: value }))
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
  const openEdit = (department: Department) => {
    setForm({ ...emptyForm, ...department, nameEn: department.nameEn ?? '' })
    setEditingId(department.id ?? null)
    setIsFormOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    const payload: Partial<Department> = {
      companyId: form.companyId,
      code: form.code.trim(),
      nameTh: form.nameTh.trim(),
      nameEn: form.nameEn?.trim() || null,
      isActive: form.isActive,
    }
    try {
      if (editingId) {
        const updated = await departmentApi.update(editingId, payload)
        setDepartments((current) => current.map((department) => department.id === editingId ? { ...department, ...payload, ...updated } : department))
      } else {
        const created = await departmentApi.create(payload)
        setDepartments((current) => [created, ...current])
      }
      closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกข้อมูลแผนกได้')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (department: Department) => {
    if (!department.id || !window.confirm(`ยืนยันการลบแผนก ${department.code}?`)) return
    try {
      setError('')
      await departmentApi.remove(department.id)
      setDepartments((current) => current.filter((item) => item.id !== department.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถลบข้อมูลแผนกได้')
    }
  }

  return <main className="app-scrollbar min-w-0 flex-1 overflow-auto px-6 py-6">
    <div className="mx-auto max-w-6xl">
      <div className="mb-7"><p className="mb-2 text-sm font-medium text-violet-700">Master Data / Department</p><h1 className="text-3xl font-semibold text-slate-950">แผนก</h1><p className="mt-2 text-sm text-slate-500">จัดการข้อมูลแผนกของแต่ละบริษัทในระบบ</p></div>
      <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2"><Stat label="Total Departments" value={departments.length} /><Stat label="Active" value={activeCount} /></section>
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      <section className="app-card p-4">
        <div className="mb-4 flex items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-900">Departments</p><button type="button" className="erp-primary-btn px-4 py-2 text-sm" onClick={openCreate}>New</button></div>
        {loading ? <Empty text="Loading departments..." /> : departments.length === 0 ? <Empty text="No departments found" /> : <div className="overflow-x-auto"><table className="erp-table w-full">
          <thead><tr><th>Code</th><th>Name</th><th>Company</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{departments.map((department) => <tr key={department.id ?? `${department.companyId}-${department.code}`}>
            <td>{department.code}</td><td><div className="font-medium text-slate-800">{department.nameTh || '-'}</div>{department.nameEn && <div className="text-xs text-slate-500">{department.nameEn}</div>}</td>
            <td>{companyNames.get(department.companyId) || department.companyId}</td>
            <td><span className={`rounded-full px-2 py-1 text-xs font-medium ${department.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{department.isActive ? 'Active' : 'Inactive'}</span></td>
            <td><div className="flex gap-2"><button type="button" className="erp-action-btn erp-action-btn--edit" onClick={() => openEdit(department)}>Edit</button><button type="button" className="erp-action-btn erp-action-btn--delete" onClick={() => handleDelete(department)}>Delete</button></div></td>
          </tr>)}</tbody>
        </table></div>}
      </section>
    </div>

    {isFormOpen && <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]">
      <div className="absolute inset-0" onClick={closeForm} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-700">Department</p><h2 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Department' : 'New Department'}</h2></div><button type="button" className="erp-action-btn erp-action-btn--delete btn-sm" onClick={closeForm}>Close</button></div>
        <div className="px-5 py-5"><form className="erp-form md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="erp-field text-sm font-medium text-slate-700 md:col-span-2"><span>Company</span><select className="erp-input" value={form.companyId} onChange={(event) => change('companyId', event.target.value)} required><option value="">Select company</option>{companies.map((company) => <option key={company.id ?? company.code} value={company.id}>{company.nameTh || company.nameEn || company.code}</option>)}</select></label>
          <Field label="Code" value={form.code} onChange={(value) => change('code', value)} required />
          <Field label="Name (TH)" value={form.nameTh} onChange={(value) => change('nameTh', value)} required />
          <Field label="Name (EN)" value={form.nameEn ?? ''} onChange={(value) => change('nameEn', value)} full />
          <label className="erp-inline-check md:col-span-2"><input type="checkbox" className="erp-checkbox" checked={form.isActive} onChange={(event) => change('isActive', event.target.checked)} />Active</label>
          <div className="flex justify-end gap-3 md:col-span-2"><button type="button" className="btn btn-ghost" onClick={closeForm}>Cancel</button><button type="submit" className="erp-primary-btn" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Department'}</button></div>
        </form></div>
      </div>
    </div>}
  </main>
}

function Stat({ label, value }: { label: string, value: number }) { return <div className="app-card p-4"><p className="text-sm text-slate-500">{label}</p><span className="mt-2 block text-2xl font-semibold">{value}</span></div> }
function Empty({ text }: { text: string }) { return <div className="py-8 text-center text-sm text-slate-500">{text}</div> }
function Field({ label, value, onChange, required, full }: { label: string, value: string, onChange: (value: string) => void, required?: boolean, full?: boolean }) { return <label className={`erp-field text-sm font-medium text-slate-700 ${full ? 'md:col-span-2' : ''}`}><span>{label}</span><input className="erp-input" value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label> }

export default DepartmentPage
