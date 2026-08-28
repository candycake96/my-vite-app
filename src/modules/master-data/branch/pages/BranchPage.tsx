import { useEffect, useMemo, useState } from 'react'
import { companyApi, type Company } from '../../company/services/companyApi'
import { branchApi, type Branch } from '../services/branchApi'

const emptyForm: Branch = {
  companyId: '', code: '', nameTh: '', nameEn: '', phone: '', email: '', address: '', isActive: true,
}

export function BranchPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [form, setForm] = useState<Branch>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const [branchData, companyData] = await Promise.all([branchApi.list(), companyApi.list()])
        setBranches(Array.isArray(branchData) ? branchData : [])
        setCompanies(Array.isArray(companyData) ? companyData : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลสาขาได้')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const activeCount = useMemo(() => branches.filter((branch) => branch.isActive).length, [branches])
  const companyNames = useMemo(() => new Map(
    companies.map((company) => [company.id, company.nameTh || company.nameEn || company.code]),
  ), [companies])

  const change = (field: keyof Branch, value: string | boolean) => setForm((current) => ({ ...current, [field]: value }))
  const closeForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }
  const openCreateForm = () => {
    setEditingId(null)
    setForm({ ...emptyForm, companyId: companies[0]?.id ?? '' })
    setIsFormOpen(true)
  }
  const openEditForm = (branch: Branch) => {
    setEditingId(branch.id ?? null)
    setForm({ ...emptyForm, ...branch, nameEn: branch.nameEn ?? '', phone: branch.phone ?? '', email: branch.email ?? '', address: branch.address ?? '' })
    setIsFormOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    const payload: Partial<Branch> = {
      companyId: form.companyId, code: form.code.trim(), nameTh: form.nameTh.trim(),
      nameEn: form.nameEn?.trim() || null, phone: form.phone?.trim() || null,
      email: form.email?.trim() || null, address: form.address?.trim() || null, isActive: form.isActive,
    }
    try {
      if (editingId) {
        const updated = await branchApi.update(editingId, payload)
        setBranches((current) => current.map((branch) => branch.id === editingId ? { ...branch, ...payload, ...updated } : branch))
      } else {
        const created = await branchApi.create(payload)
        setBranches((current) => [created, ...current])
      }
      closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกข้อมูลสาขาได้')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (branch: Branch) => {
    if (!branch.id || !window.confirm(`ยืนยันการลบสาขา ${branch.code}?`)) return
    try {
      setError('')
      await branchApi.remove(branch.id)
      setBranches((current) => current.filter((item) => item.id !== branch.id))
      if (editingId === branch.id) closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถลบข้อมูลสาขาได้')
    }
  }

  return (
    <main className="app-scrollbar min-w-0 flex-1 overflow-auto px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <p className="mb-2 text-sm font-medium text-violet-700">Master Data / Branch</p>
          <h1 className="text-3xl font-semibold text-slate-950">สาขา</h1>
          <p className="mt-2 text-sm text-slate-500">จัดการข้อมูลสาขาของแต่ละบริษัทในระบบ</p>
        </div>
        <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Stat label="Total Branches" value={branches.length} />
          <Stat label="Active" value={activeCount} />
        </section>
        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <section className="app-card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Branches</p>
            <button type="button" className="erp-primary-btn px-4 py-2 text-sm" onClick={openCreateForm}>New</button>
          </div>
          {loading ? <Empty text="Loading branches..." /> : branches.length === 0 ? <Empty text="No branches found" /> : (
            <div className="overflow-x-auto"><table className="erp-table w-full">
              <thead><tr><th>Code</th><th>Name</th><th>Company</th><th>Contact</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>{branches.map((branch) => <tr key={branch.id ?? `${branch.companyId}-${branch.code}`}>
                <td>{branch.code}</td>
                <td><div className="font-medium text-slate-800">{branch.nameTh || '-'}</div>{branch.nameEn && <div className="text-xs text-slate-500">{branch.nameEn}</div>}</td>
                <td>{companyNames.get(branch.companyId) || branch.companyId}</td>
                <td><div>{branch.phone || '-'}</div>{branch.email && <div className="text-xs text-slate-500">{branch.email}</div>}</td>
                <td><span className={`rounded-full px-2 py-1 text-xs font-medium ${branch.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{branch.isActive ? 'Active' : 'Inactive'}</span></td>
                <td><div className="flex gap-2"><button type="button" className="erp-action-btn erp-action-btn--edit" onClick={() => openEditForm(branch)}>Edit</button><button type="button" className="erp-action-btn erp-action-btn--delete" onClick={() => handleDelete(branch)}>Delete</button></div></td>
              </tr>)}</tbody>
            </table></div>
          )}
        </section>
      </div>

      {isFormOpen && <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]">
        <div className="absolute inset-0" onClick={closeForm} aria-hidden="true" />
        <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-700">Branch</p><h2 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Branch' : 'New Branch'}</h2></div>
            <button type="button" className="erp-action-btn erp-action-btn--delete btn-sm" onClick={closeForm}>Close</button>
          </div>
          <div className="px-5 py-5"><form className="erp-form md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="erp-field text-sm font-medium text-slate-700 md:col-span-2"><span>Company</span><select className="erp-input" value={form.companyId} onChange={(event) => change('companyId', event.target.value)} required><option value="">Select company</option>{companies.map((company) => <option key={company.id ?? company.code} value={company.id}>{company.nameTh || company.nameEn || company.code}</option>)}</select></label>
            <Field label="Code" value={form.code} onChange={(value) => change('code', value)} required />
            <Field label="Name (TH)" value={form.nameTh} onChange={(value) => change('nameTh', value)} />
            <Field label="Name (EN)" value={form.nameEn ?? ''} onChange={(value) => change('nameEn', value)} />
            <Field label="Phone" value={form.phone ?? ''} onChange={(value) => change('phone', value)} />
            <Field label="Email" value={form.email ?? ''} onChange={(value) => change('email', value)} type="email" full />
            <label className="erp-field text-sm font-medium text-slate-700 md:col-span-2"><span>Address</span><textarea className="erp-textarea" rows={3} value={form.address ?? ''} onChange={(event) => change('address', event.target.value)} /></label>
            <label className="erp-inline-check md:col-span-2"><input type="checkbox" className="erp-checkbox" checked={form.isActive} onChange={(event) => change('isActive', event.target.checked)} />Active</label>
            <div className="flex justify-end gap-3 md:col-span-2"><button type="button" className="btn btn-ghost" onClick={closeForm}>Cancel</button><button type="submit" className="erp-primary-btn" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Branch'}</button></div>
          </form></div>
        </div>
      </div>}
    </main>
  )
}

function Stat({ label, value }: { label: string, value: number }) {
  return <div className="app-card p-4"><p className="text-sm text-slate-500">{label}</p><span className="mt-2 block text-2xl font-semibold">{value}</span></div>
}
function Empty({ text }: { text: string }) { return <div className="py-8 text-center text-sm text-slate-500">{text}</div> }
function Field({ label, value, onChange, required, type = 'text', full }: { label: string, value: string, onChange: (value: string) => void, required?: boolean, type?: string, full?: boolean }) {
  return <label className={`erp-field text-sm font-medium text-slate-700 ${full ? 'md:col-span-2' : ''}`}><span>{label}</span><input className="erp-input" type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>
}

export default BranchPage
