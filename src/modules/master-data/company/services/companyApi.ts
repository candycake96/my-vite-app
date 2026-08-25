export type Company = {
  id?: string
  code: string
  nameTh: string
  nameEn?: string | null
  taxId?: string | null
  website?: string | null
  logo?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

const API_URL = '/api/company'

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
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Request failed'

    try {
      const data = await response.json()
      if (data?.message) message = data.message
      else if (data?.error) message = data.error
    } catch {
      // ignore parse errors
    }

    throw new Error(message)
  }

  if (response.status === 204) return undefined as T

  try {
    const payload = await response.json()
    return unwrapResponse<T>(payload)
  } catch {
    return undefined as T
  }
}

export const companyApi = {
  list: () => requestJson<Company[]>(API_URL),
  create: (payload: Partial<Company>) => requestJson<Company>(API_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  update: (id: string, payload: Partial<Company>) =>
    requestJson<Company>(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: (id: string) => requestJson(`${API_URL}/${id}`, { method: 'DELETE' }),
}
