import { useEffect, useMemo, useState } from 'react'
import { branchApi, type Branch } from '../../branch/services/branchApi'
import { companyApi, type Company } from '../../company/services/companyApi'
import { departmentApi, type Department } from '../../department/services/departmentApi'
import { employeeGroupApi, type EmployeeGroup } from '../../employee-group/services/employeeGroupApi'
import { positionApi, type Position } from '../../position/services/positionApi'
import { sideApi, type Side } from '../../side/services/sideApi'
import { employeeApi, type Employee, type EmployeeAddress } from '../services/employeeApi'

type Lookups = { companies: Company[]; branches: Branch[]; departments: Department[]; positions: Position[]; sides: Side[]; groups: EmployeeGroup[] }
const emptyAddress: EmployeeAddress = { address1: '', address2: '', city: '', state: '', postalCode: '', country: 'Thailand' }
const emptyForm: Employee = { companyId: '', branchId: '', departmentId: '', positionId: '', sideId: '', employeeGroupId: '', jobTitleId: '', userId: '', employeeCode: '', firstName: '', lastName: '', nickname: '', email: '', phone: '', isActive: true, employeeAddresses: [] }
const emptyLookups: Lookups = { companies: [], branches: [], departments: [], positions: [], sides: [], groups: [] }

export function PeoplePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [lookups, setLookups] = useState<Lookups>(emptyLookups)
  const [form, setForm] = useState<Employee>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [employeeData, companies, branches, departments, positions, sides, groups] = await Promise.all([
          employeeApi.list(), companyApi.list(), branchApi.list(), departmentApi.list(), positionApi.list(), sideApi.list(), employeeGroupApi.list(),
        ])
        setEmployees(Array.isArray(employeeData) ? employeeData : [])
        setLookups({ companies, branches, departments, positions, sides, groups })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลพนักงานได้')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const activeCount = useMemo(() => employees.filter((employee) => employee.isActive).length, [employees])
  const names = useMemo(() => ({
    company: nameMap(lookups.companies), branch: nameMap(lookups.branches),
    department: nameMap(lookups.departments), position: nameMap(lookups.positions),
  }), [lookups])
  const change = (field: keyof Employee, value: string | boolean) => setForm((current) => ({ ...current, [field]: value }))
  const closeForm = () => { setForm(emptyForm); setEditingId(null); setIsFormOpen(false); setError('') }
  const openCreate = () => {
    setError('')
    setForm({ ...emptyForm, companyId: lookups.companies[0]?.id ?? '', employeeAddresses: [{ ...emptyAddress }] })
    setEditingId(null); setIsFormOpen(true)
  }
  const openEdit = (employee: Employee) => {
    setError('')
    setForm({ ...emptyForm, ...employee, employeeGroupId: employee.employeeGroupId ?? '', jobTitleId: employee.jobTitleId ?? '', userId: employee.userId ?? '', nickname: employee.nickname ?? '', email: employee.email ?? '', phone: employee.phone ?? '', employeeAddresses: employee.employeeAddresses?.map((address) => ({ ...address, address2: address.address2 ?? '' })) ?? [] })
    setEditingId(employee.id ?? null); setIsFormOpen(true)
  }
  const changeAddress = (index: number, field: keyof EmployeeAddress, value: string) => setForm((current) => ({ ...current, employeeAddresses: current.employeeAddresses.map((address, addressIndex) => addressIndex === index ? { ...address, [field]: value } : address) }))
  const addAddress = () => setForm((current) => ({ ...current, employeeAddresses: [...current.employeeAddresses, { ...emptyAddress }] }))
  const removeAddress = (index: number) => setForm((current) => ({ ...current, employeeAddresses: current.employeeAddresses.filter((_, addressIndex) => addressIndex !== index) }))

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setIsSubmitting(true); setError('')
    const payload: Partial<Employee> = {
      companyId: form.companyId, branchId: form.branchId, departmentId: form.departmentId, positionId: form.positionId, sideId: form.sideId,
      employeeGroupId: form.employeeGroupId || null, jobTitleId: form.jobTitleId || null, userId: form.userId || null,
      employeeCode: form.employeeCode.trim(), firstName: form.firstName.trim(), lastName: form.lastName.trim(), nickname: form.nickname?.trim() || null,
      email: form.email?.trim() || null, phone: form.phone?.trim() || null, isActive: form.isActive,
      employeeAddresses: form.employeeAddresses.map(toAddressPayload),
    }
    try {
      if (editingId) {
        const updated = await employeeApi.update(editingId, payload)
        setEmployees((current) => current.map((employee) => employee.id === editingId ? { ...employee, ...payload, ...updated } : employee))
      } else {
        const created = await employeeApi.create(payload); setEmployees((current) => [created, ...current])
      }
      closeForm()
    } catch (err) { setError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกข้อมูลพนักงานได้') } finally { setIsSubmitting(false) }
  }

  const handleDelete = async (employee: Employee) => {
    if (!employee.id || !window.confirm(`ยืนยันการลบพนักงาน ${employee.employeeCode}?`)) return
    try { setError(''); await employeeApi.remove(employee.id); setEmployees((current) => current.filter((item) => item.id !== employee.id)) }
    catch (err) { setError(err instanceof Error ? err.message : 'ไม่สามารถลบข้อมูลพนักงานได้') }
  }

  return <main className="app-scrollbar min-w-0 flex-1 overflow-auto px-6 py-6"><div className="mx-auto max-w-7xl">
    <div className="mb-7"><p className="mb-2 text-sm font-medium text-violet-700">People / Employees</p><h1 className="text-3xl font-semibold text-slate-950">พนักงาน</h1><p className="mt-2 text-sm text-slate-500">จัดการข้อมูลพนักงาน โครงสร้างองค์กร และที่อยู่</p></div>
    <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2"><Stat label="Total Employees" value={employees.length} /><Stat label="Active" value={activeCount} /></section>
    {error && !isFormOpen && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
    <section className="app-card p-4"><div className="mb-4 flex items-center justify-between"><p className="text-sm font-semibold">Employees</p><button type="button" className="erp-primary-btn px-4 py-2 text-sm" onClick={openCreate}>Add Employee</button></div>
      {loading ? <Empty text="Loading employees..." /> : employees.length === 0 ? <Empty text="No employees found" /> : <div className="overflow-x-auto"><table className="erp-table w-full"><thead><tr><th>Employee ID</th><th>Name</th><th>Company / Branch</th><th>Department / Position</th><th>Contact</th><th>Status</th><th>Action</th></tr></thead><tbody>{employees.map((employee) => <tr key={employee.id ?? employee.employeeCode}>
        <td>{employee.employeeCode}</td><td><div className="font-medium text-slate-800">{employee.firstName} {employee.lastName}</div>{employee.nickname && <div className="text-xs text-slate-500">{employee.nickname}</div>}</td>
        <td><div>{names.company.get(employee.companyId) || employee.companyId}</div><div className="text-xs text-slate-500">{names.branch.get(employee.branchId) || employee.branchId}</div></td>
        <td><div>{names.department.get(employee.departmentId) || employee.departmentId}</div><div className="text-xs text-slate-500">{names.position.get(employee.positionId) || employee.positionId}</div></td>
        <td><div>{employee.phone || '-'}</div><div className="text-xs text-slate-500">{employee.email || '-'}</div></td><td><Status active={employee.isActive} /></td>
        <td><div className="flex gap-2"><button type="button" className="erp-action-btn erp-action-btn--edit" onClick={() => openEdit(employee)}>Edit</button><button type="button" className="erp-action-btn erp-action-btn--delete" onClick={() => handleDelete(employee)}>Delete</button></div></td>
      </tr>)}</tbody></table></div>}
    </section>
  </div>
  {isFormOpen && <EmployeeModal form={form} lookups={lookups} editing={!!editingId} saving={isSubmitting} error={error} onChange={change} onAddressChange={changeAddress} onAddAddress={addAddress} onRemoveAddress={removeAddress} onClose={closeForm} onSubmit={handleSubmit} />}
  </main>
}

function EmployeeModal({ form, lookups, editing, saving, error, onChange, onAddressChange, onAddAddress, onRemoveAddress, onClose, onSubmit }: { form: Employee; lookups: Lookups; editing: boolean; saving: boolean; error: string; onChange: (field: keyof Employee, value: string | boolean) => void; onAddressChange: (index: number, field: keyof EmployeeAddress, value: string) => void; onAddAddress: () => void; onRemoveAddress: (index: number) => void; onClose: () => void; onSubmit: (event: React.FormEvent) => void }) {
  const sections = [
    { id: 'employee-personal', label: 'ข้อมูลส่วนตัว', hint: 'ชื่อและช่องทางติดต่อ', step: '01' },
    { id: 'employee-organization', label: 'โครงสร้างองค์กร', hint: 'บริษัทและหน่วยงาน', step: '02' },
    { id: 'employee-system', label: 'การเชื่อมโยงระบบ', hint: 'บัญชีและสถานะ', step: '03' },
    { id: 'employee-addresses', label: 'ที่อยู่', hint: `${form.employeeAddresses.length} รายการ`, step: '04' },
  ]
  const goToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const changeCompany = (companyId: string) => {
    onChange('companyId', companyId)
    onChange('branchId', '')
    onChange('sideId', '')
    onChange('departmentId', '')
    onChange('positionId', '')
    onChange('employeeGroupId', '')
  }

  return <div className="app-scrollbar fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/55 backdrop-blur-sm">
    <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
    <div className="relative z-10 mx-auto min-h-[100dvh] w-full max-w-6xl bg-slate-50 shadow-2xl sm:my-5 sm:min-h-0 sm:rounded-[1.5rem] sm:border sm:border-slate-200">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:rounded-t-[1.5rem] sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 font-semibold text-violet-700">{editing ? 'E' : '+'}</div><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.14em] text-violet-700">Employee profile</p><h2 className="truncate text-xl font-semibold text-slate-950">{editing ? `${form.firstName || ''} ${form.lastName || ''}`.trim() || 'Edit Employee' : 'เพิ่มพนักงานใหม่'}</h2></div></div>
        <button type="button" className="grid h-9 w-9 place-items-center rounded-full text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" onClick={onClose} aria-label="Close">×</button>
      </header>

      <form onSubmit={onSubmit}>
        <div className="grid lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="hidden border-r border-slate-200 bg-white p-4 lg:block">
            <nav className="sticky top-24 flex flex-col gap-2">{sections.map((section) => <button key={section.id} type="button" onClick={() => goToSection(section.id)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-violet-50">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-700 lg:h-8 lg:w-8 lg:text-xs">{section.step}</span><span><span className="block whitespace-nowrap text-xs font-semibold text-slate-700 group-hover:text-violet-800 lg:text-sm">{section.label}</span><span className="hidden text-xs text-slate-400 lg:block">{section.hint}</span></span>
            </button>)}</nav>
            <div className="mt-5 hidden rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500 lg:block">โครงสร้างแบบหมวดหมู่ รองรับการเพิ่มข้อมูลเงินเดือน เอกสาร และสวัสดิการในอนาคต</div>
          </aside>

          <div className="min-w-0 p-3 pb-6 sm:p-5 sm:pb-6 lg:p-6 lg:pb-8 [&_.erp-field]:min-w-0 [&_.erp-input]:min-h-[2.55rem] [&_.erp-input]:py-2">
            <div className="mx-auto max-w-4xl space-y-5">
              {error && <div role="alert" aria-live="assertive" className="sticky top-[4.5rem] z-20 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-100 font-bold">!</span><div><p className="font-semibold">ไม่สามารถบันทึกข้อมูลได้</p><p className="mt-0.5 text-xs leading-5 text-red-600">{error}</p></div></div>}
              <FormSection id="employee-personal" title="ข้อมูลส่วนตัว" description="ข้อมูลพื้นฐานและช่องทางติดต่อของพนักงาน">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Field label="Employee Code" value={form.employeeCode} onChange={(value) => onChange('employeeCode', value)} required /><Field label="First Name" value={form.firstName} onChange={(value) => onChange('firstName', value)} required /><Field label="Last Name" value={form.lastName} onChange={(value) => onChange('lastName', value)} required /><Field label="Nickname" value={form.nickname ?? ''} onChange={(value) => onChange('nickname', value)} /><Field label="Email" type="email" value={form.email ?? ''} onChange={(value) => onChange('email', value)} /><Field label="Phone" value={form.phone ?? ''} onChange={(value) => onChange('phone', value)} /></div>
              </FormSection>

              <FormSection id="employee-organization" title="โครงสร้างองค์กร" description="กำหนดบริษัท หน่วยงาน และบทบาทของพนักงาน">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Select label="Company" value={form.companyId} items={lookups.companies} onChange={changeCompany} required /><Select label="Branch" value={form.branchId} items={lookups.branches} onChange={(value) => onChange('branchId', value)} required companyId={form.companyId} /><Select label="Side" value={form.sideId} items={lookups.sides} onChange={(value) => onChange('sideId', value)} required companyId={form.companyId} /><Select label="Department" value={form.departmentId} items={lookups.departments} onChange={(value) => onChange('departmentId', value)} required companyId={form.companyId} /><Select label="Position" value={form.positionId} items={lookups.positions} onChange={(value) => onChange('positionId', value)} required companyId={form.companyId} /><Select label="Employee Group" value={form.employeeGroupId ?? ''} items={lookups.groups} onChange={(value) => onChange('employeeGroupId', value)} companyId={form.companyId} /></div>
              </FormSection>

              <FormSection id="employee-system" title="การเชื่อมโยงระบบ" description="ข้อมูลสำหรับเชื่อมต่อสิทธิ์และ Master Data อื่น">
                <div className="grid gap-4 md:grid-cols-2"><Field label="Job Title ID" value={form.jobTitleId ?? ''} onChange={(value) => onChange('jobTitleId', value)} /><Field label="User ID" value={form.userId ?? ''} onChange={(value) => onChange('userId', value)} /></div>
                <label className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"><span><span className="block text-sm font-semibold text-slate-800">สถานะการใช้งาน</span><span className="block text-xs text-slate-500">พนักงานที่ Active จะสามารถนำไปใช้อ้างอิงในระบบได้</span></span><input type="checkbox" className="erp-checkbox" checked={form.isActive} onChange={(event) => onChange('isActive', event.target.checked)} /></label>
              </FormSection>

              <FormSection id="employee-addresses" title="ที่อยู่" description="เพิ่มได้มากกว่าหนึ่งรายการ เช่น ที่อยู่ปัจจุบันและที่อยู่ตามทะเบียนบ้าน" action={<button type="button" className="erp-primary-btn px-3 py-2 text-xs" onClick={onAddAddress}>+ Add Address</button>}>
                {form.employeeAddresses.length === 0 ? <button type="button" onClick={onAddAddress} className="w-full rounded-xl border border-dashed border-slate-300 py-8 text-sm text-slate-500 transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700">ยังไม่มีข้อมูลที่อยู่ — คลิกเพื่อเพิ่ม</button> : <div className="space-y-4">{form.employeeAddresses.map((address, index) => <div key={address.id ?? index} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"><div className="mb-4 flex items-center justify-between"><p className="text-sm font-semibold text-slate-700">Address {index + 1}</p><button type="button" className="text-xs font-medium text-red-600 hover:text-red-800" onClick={() => onRemoveAddress(index)}>Remove</button></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Field label="Address 1" value={address.address1} onChange={(value) => onAddressChange(index, 'address1', value)} required /><Field label="Address 2" value={address.address2 ?? ''} onChange={(value) => onAddressChange(index, 'address2', value)} /><Field label="City / District" value={address.city} onChange={(value) => onAddressChange(index, 'city', value)} required /><Field label="State / Province" value={address.state} onChange={(value) => onAddressChange(index, 'state', value)} required /><Field label="Postal Code" value={address.postalCode} onChange={(value) => onAddressChange(index, 'postalCode', value)} required /><Field label="Country" value={address.country} onChange={(value) => onAddressChange(index, 'country', value)} required /></div></div>)}</div>}
              </FormSection>
            </div>
          </div>
        </div>
        <footer className="sticky bottom-0 z-30 flex items-center justify-between gap-2 border-t border-slate-200 bg-white/95 px-3 pb-[max(.625rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur sm:rounded-b-[1.5rem] sm:px-6 sm:py-3"><p className="hidden text-xs text-slate-500 sm:block"><span className="text-red-500">*</span> กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน</p><div className="ml-auto flex w-full gap-2 sm:w-auto sm:gap-3"><button type="button" className="btn btn-ghost flex-1 sm:flex-none" onClick={onClose}>Cancel</button><button type="submit" className="erp-primary-btn flex-1 sm:min-w-32 sm:flex-none" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Employee'}</button></div></footer>
      </form>
    </div>
  </div>
}

function FormSection({ id, title, description, action, children }: { id: string; title: string; description: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <section id={id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5"><div className="mb-4 flex items-start justify-between gap-3 sm:mb-5"><div className="min-w-0"><h3 className="font-semibold text-slate-900">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div><div className="shrink-0">{action}</div></div>{children}</section>
}

type NamedItem = { id?: string; companyId?: string; code: string; nameTh: string; nameEn?: string | null }
function toAddressPayload(address: EmployeeAddress): EmployeeAddress {
  return {
    ...(address.id ? { id: address.id } : {}),
    ...(address.employeeId ? { employeeId: address.employeeId } : {}),
    address1: address.address1.trim(),
    address2: address.address2?.trim() || null,
    city: address.city.trim(),
    state: address.state.trim(),
    postalCode: address.postalCode.trim(),
    country: address.country.trim(),
  }
}
function nameMap(items: NamedItem[]) { return new Map(items.map((item) => [item.id, item.nameTh || item.nameEn || item.code])) }
function Select({ label, value, items, onChange, required, companyId }: { label: string; value: string; items: NamedItem[]; onChange: (value: string) => void; required?: boolean; companyId?: string }) {
  const normalizedCompanyId = companyId?.trim().toLowerCase()
  const companyItems = normalizedCompanyId
    ? items.filter((item) => item.companyId?.trim().toLowerCase() === normalizedCompanyId)
    : items
  const options = companyItems.length > 0 ? companyItems : items

  return <label className="erp-field min-w-0 text-sm font-medium text-slate-700">
    <span>{label}{required && <span className="ml-1 text-red-500">*</span>}</span>
    <select className="erp-input min-w-0 cursor-pointer" value={value} onChange={(event) => onChange(event.target.value)} required={required} disabled={items.length === 0}>
      <option value="">{items.length === 0 ? `No ${label.toLowerCase()} data` : `Select ${label.toLowerCase()}`}</option>
      {options.map((item) => <option key={item.id ?? item.code} value={item.id ?? ''}>{item.code} — {item.nameTh || item.nameEn || item.code}</option>)}
    </select>
    {normalizedCompanyId && companyItems.length === 0 && items.length > 0 && <span className="text-xs font-normal text-amber-600">ไม่พบข้อมูลที่ผูกกับบริษัทนี้ จึงแสดงรายการทั้งหมด</span>}
  </label>
}
function Field({ label, value, onChange, required, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) { return <label className="erp-field min-w-0 text-sm font-medium text-slate-700"><span>{label}{required && <span className="ml-1 text-red-500">*</span>}</span><input className="erp-input min-w-0" type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label> }
function Stat({ label, value }: { label: string; value: number }) { return <div className="app-card p-4"><p className="text-sm text-slate-500">{label}</p><span className="mt-2 block text-2xl font-semibold">{value}</span></div> }
function Empty({ text }: { text: string }) { return <div className="py-8 text-center text-sm text-slate-500">{text}</div> }
function Status({ active }: { active: boolean }) { return <span className={`rounded-full px-2 py-1 text-xs font-medium ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{active ? 'Active' : 'Inactive'}</span> }

export default PeoplePage
