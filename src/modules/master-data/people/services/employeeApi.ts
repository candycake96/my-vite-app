export type EmployeeAddress = {
  id?: string
  employeeId?: string
  address1: string
  address2?: string | null
  city: string
  state: string
  postalCode: string
  country: string
  createdAt?: string
  updatedAt?: string
}

export type Employee = {
  id?: string
  companyId: string
  branchId: string
  departmentId: string
  positionId: string
  sideId: string
  employeeGroupId?: string | null
  jobTitleId?: string | null
  userId?: string | null
  employeeCode: string
  firstName: string
  lastName: string
  nickname?: string | null
  email?: string | null
  phone?: string | null
  isActive: boolean
  employeeAddresses: EmployeeAddress[]
  createdAt?: string
  updatedAt?: string
}

const API_URL = '/api/employee'

function unwrapResponse<T>(data: unknown): T {
  if (Array.isArray(data)) return data as T
  if (data && typeof data === 'object' && 'value' in data) {
    const value = (data as { value?: unknown }).value
    if (value !== undefined) return unwrapResponse<T>(value)
  }
  return data as T
}

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  })
  if (!response.ok) {
    let message = 'Request failed'
    try {
      const data = await response.json()
      if (data?.message) message = data.message
      else if (data?.error) message = data.error
    } catch {
      // Keep the fallback message when the API does not return JSON.
    }
    throw new Error(message)
  }
  if (response.status === 204) return undefined as T
  try {
    return unwrapResponse<T>(await response.json())
  } catch {
    return undefined as T
  }
}

export const employeeApi = {
  list: () => requestJson<Employee[]>(API_URL),
  create: (payload: Partial<Employee>) => requestJson<Employee>(API_URL, {
    method: 'POST', body: JSON.stringify(payload),
  }),
  update: (id: string, payload: Partial<Employee>) => requestJson<Employee>(`${API_URL}/${id}`, {
    method: 'PUT', body: JSON.stringify(payload),
  }),
  remove: (id: string) => requestJson<void>(`${API_URL}/${id}`, { method: 'DELETE' }),
}
