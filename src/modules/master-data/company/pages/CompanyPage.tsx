import { useEffect, useMemo, useState } from 'react'
import { companyApi, type Company } from '../services/companyApi'

const emptyForm: Company = {
  code: '',
  nameTh: '',
  nameEn: '',
  taxId: '',
  website: '',
  logo: '',
  phone: '',
  email: '',
  address: '',
  isActive: true,
}

export function CompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [form, setForm] = useState<Company>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchCompanies = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await companyApi.list()
      setCompanies(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load companies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const activeCount = useMemo(
    () => companies.filter((company) => company.isActive).length,
    [companies],
  )

  const handleChange = (field: keyof Company, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const openCreateForm = () => {
    resetForm()
    setIsFormOpen(true)
  }

  const openEditForm = (company: Company) => {
    handleEdit(company)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    resetForm()
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        ...form,
        nameEn: form.nameEn || null,
        taxId: form.taxId || null,
        website: form.website || null,
        logo: form.logo || null,
        phone: form.phone || null,
        email: form.email || null,
        address: form.address || null,
      }

      if (editingId) {
        const updated = await companyApi.update(editingId, payload)

        setCompanies((current) =>
          current.map((company) => (company.id === editingId ? { ...company, ...updated } : company)),
        )
      } else {
        const created = await companyApi.create(payload)
        setCompanies((current) => [created, ...current])
      }

      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save company')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (company: Company) => {
    setEditingId(company.id ?? null)
    setForm({
      ...emptyForm,
      ...company,
      nameEn: company.nameEn ?? '',
      taxId: company.taxId ?? '',
      website: company.website ?? '',
      logo: company.logo ?? '',
      phone: company.phone ?? '',
      email: company.email ?? '',
      address: company.address ?? '',
    })
  }

  const handleDelete = async (id?: string) => {
    if (!id) return

    const confirmed = window.confirm('ลบข้อมูลบริษัทนี้ใช่หรือไม่?')
    if (!confirmed) return

    try {
      setError('')
      await companyApi.remove(id)
      setCompanies((current) => current.filter((company) => company.id !== id))

      if (editingId === id) {
        resetForm()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete company')
    }
  }

  return (
    <main className="app-scrollbar min-w-0 flex-1 overflow-auto px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <p className="mb-2 text-sm font-medium text-violet-700">Master Data / Company</p>
          <h1 className="text-3xl font-semibold text-slate-950">บริษัท</h1>
          <p className="mt-2 text-sm text-slate-500">จัดการข้อมูลบริษัทในระบบ</p>
        </div>

        <section className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="app-card p-4">
            <p className="text-sm text-slate-500">Total Companies</p>
            <span className="mt-2 block text-2xl font-semibold">{companies.length}</span>
          </div>
          <div className="app-card p-4">
            <p className="text-sm text-slate-500">Active</p>
            <span className="mt-2 block text-2xl font-semibold">{activeCount}</span>
          </div>
        </section>

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <section className="app-card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Companies</p>
            <button type="button" className="erp-primary-btn px-4 py-2 text-sm" onClick={openCreateForm}>
              New
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">Loading companies...</div>
          ) : companies.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">No companies found</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="erp-table w-full">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id ?? company.code}>
                      <td>{company.code}</td>
                      <td>
                        <div className="font-medium text-slate-800">{company.nameTh}</div>
                        {company.nameEn && <div className="text-xs text-slate-500">{company.nameEn}</div>}
                      </td>
                      <td>{company.phone || '-'}</td>
                      <td>{company.email || '-'}</td>
                      <td>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${company.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                          {company.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button type="button" className="btn btn-ghost btn-xs" onClick={() => openEditForm(company)}>
                            Edit
                          </button>
                          <button type="button" className="btn btn-error btn-xs" onClick={() => handleDelete(company.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]">
          <div className="absolute inset-0" onClick={closeForm} aria-hidden="true" />

          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-700">Company</p>
                <h2 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Company' : 'New Company'}</h2>
              </div>

              <button type="button" className="btn btn-ghost btn-sm" onClick={closeForm}>
                Close
              </button>
            </div>

            <div className="px-5 py-5">
              <form className="erp-form md:grid-cols-2" onSubmit={handleSubmit}>
                <label className="erp-field text-sm font-medium text-slate-700">
                  <span>Code</span>
                  <input
                    className="erp-input"
                    value={form.code}
                    onChange={(event) => handleChange('code', event.target.value)}
                    required
                  />
                </label>

                <label className="erp-field text-sm font-medium text-slate-700">
                  <span>Name (TH)</span>
                  <input
                    className="erp-input"
                    value={form.nameTh}
                    onChange={(event) => handleChange('nameTh', event.target.value)}
                    required
                  />
                </label>

                <label className="erp-field text-sm font-medium text-slate-700">
                  <span>Name (EN)</span>
                  <input
                    className="erp-input"
                    value={form.nameEn ?? ''}
                    onChange={(event) => handleChange('nameEn', event.target.value)}
                  />
                </label>

                <label className="erp-field text-sm font-medium text-slate-700">
                  <span>Tax ID</span>
                  <input
                    className="erp-input"
                    value={form.taxId ?? ''}
                    onChange={(event) => handleChange('taxId', event.target.value)}
                  />
                </label>

                <label className="erp-field text-sm font-medium text-slate-700">
                  <span>Phone</span>
                  <input
                    className="erp-input"
                    value={form.phone ?? ''}
                    onChange={(event) => handleChange('phone', event.target.value)}
                  />
                </label>

                <label className="erp-field text-sm font-medium text-slate-700">
                  <span>Email</span>
                  <input
                    className="erp-input"
                    value={form.email ?? ''}
                    onChange={(event) => handleChange('email', event.target.value)}
                  />
                </label>

                <label className="erp-field text-sm font-medium text-slate-700 md:col-span-2">
                  <span>Website</span>
                  <input
                    className="erp-input"
                    value={form.website ?? ''}
                    onChange={(event) => handleChange('website', event.target.value)}
                  />
                </label>

                <label className="erp-field text-sm font-medium text-slate-700 md:col-span-2">
                  <span>Address</span>
                  <textarea
                    className="erp-textarea"
                    rows={3}
                    value={form.address ?? ''}
                    onChange={(event) => handleChange('address', event.target.value)}
                  />
                </label>

                <label className="erp-inline-check md:col-span-2">
                  <input
                    type="checkbox"
                    className="erp-checkbox"
                    checked={form.isActive}
                    onChange={(event) => handleChange('isActive', event.target.checked)}
                  />
                  Active
                </label>

                <div className="md:col-span-2 flex justify-end gap-3">
                  <button type="button" className="btn btn-ghost" onClick={closeForm}>
                    Cancel
                  </button>
                  <button type="submit" className="erp-primary-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Company'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default CompanyPage
