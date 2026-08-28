export type Side = {
  id?: string
  companyId: string
  code: string
  nameTh: string
  nameEn?: string | null
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

const API_URL = '/api/side'

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
      // Keep the fallback message when the response has no JSON body.
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

export const sideApi = {
  list: () => requestJson<Side[]>(API_URL),
  create: (payload: Partial<Side>) => requestJson<Side>(API_URL, {
    method: 'POST', body: JSON.stringify(payload),
  }),
  update: (id: string, payload: Partial<Side>) => requestJson<Side>(`${API_URL}/${id}`, {
    method: 'PUT', body: JSON.stringify(payload),
  }),
  remove: (id: string) => requestJson<void>(`${API_URL}/${id}`, { method: 'DELETE' }),
}
