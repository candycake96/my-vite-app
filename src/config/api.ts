export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000'

export function apiUrl(path: string) {
  const base = API_BASE_URL.replace(/\/+$/g, '')
  if (!path) return base
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export default { API_BASE_URL, apiUrl }
