import type { Sessao } from '../models/types'

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem('token'))
}

export function saveSession({ token, usuario }: Sessao): void {
  localStorage.setItem('token', token)
  if (usuario) localStorage.setItem('usuario', usuario)
}

export function clearSession(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}

export function getUsuario(): string {
  return localStorage.getItem('usuario') || ''
}
