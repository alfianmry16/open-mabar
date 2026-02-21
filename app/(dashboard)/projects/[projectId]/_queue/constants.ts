// Role color palette for badges and tags
export const ROLE_COLORS = [
  { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
] as const

export type RoleColor = (typeof ROLE_COLORS)[number]
