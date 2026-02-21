// Pure helper functions — no React dependencies

import type { QueueEntry, ProjectRole } from './types'
import { ROLE_COLORS } from './constants'

export function getPlayerName(entry: QueueEntry): string {
  if (entry.display_name) return entry.display_name
  if (entry.game_id) return entry.game_id
  if (entry.profiles?.full_name) return entry.profiles.full_name
  if (entry.profiles?.email) return entry.profiles.email.split('@')[0]
  return 'Unknown'
}

export function getTimeAgo(dateStr: string): string {
  const now = Date.now()
  const diff = now - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'baru saja'
  if (mins < 60) return `${mins}m lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}j lalu`
  const days = Math.floor(hours / 24)
  return `${days}h lalu`
}

export function getRoleName(roleId: string, roles: ProjectRole[]): string | null {
  return roles.find((r) => r.id === roleId)?.name || null
}

export function getRoleColor(roleId: string, roles: ProjectRole[]) {
  const idx = roles.findIndex((r) => r.id === roleId)
  return ROLE_COLORS[idx >= 0 ? idx % ROLE_COLORS.length : 0]
}
