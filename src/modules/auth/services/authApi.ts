import { apiUrl } from '../../../config/api'

export async function login(payload: { username: string; password: string }) {
  try {
    const res = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    let data: any = null
    try {
      data = text ? JSON.parse(text) : null
    } catch (e) {
      data = text
    }

    if (!res.ok) {
      const message = (data && data.message) || data || `Request failed: ${res.status}`
      const err: any = new Error(message)
      err.status = res.status
      err.response = data
      throw err
    }

    return data
  } catch (err: any) {
    // Re-throw with useful message for UI
    if (err instanceof Error) throw err
    throw new Error(String(err))
  }
}

export default { login }
