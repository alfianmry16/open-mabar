'use client'

import { Button } from '@/components/ui/button'
import {
  Copy,
  Check,
  Crown,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Youtube as YoutubeIcon,
  MessageSquare,
  Globe,
  Github,
} from 'lucide-react'
import type { Project, ProjectRole, SocialLink } from '../types'
import { getPlayerName } from '../helpers'
import { useQueueStore } from '../store'
import type { LucideIcon } from 'lucide-react'

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  'Instagram': InstagramIcon,
  'Twitter / X': TwitterIcon,
  'Youtube': YoutubeIcon,
  'Discord': MessageSquare,
  'Github': Github,
  'Lainnya': Globe,
}

export function Sidebar() {
  const { project, projectRoles, copiedUrl, copyPublicUrl, entries } = useQueueStore()

  if (!project) return null
  const owner = project.profiles

  return (
    <div className="space-y-5">
      {/* Owner Info */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3">Project Owner</h3>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold">
            {owner?.full_name?.charAt(0) || project.owner_id.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white leading-none">{owner?.full_name || 'Streamer'}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Owner / Creator</p>
          </div>
        </div>

        {owner?.social_links && owner.social_links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {owner.social_links.map((link: SocialLink, i: number) => {
              const Icon = PLATFORM_ICONS[link.platform] || Globe
              return (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all"
                  title={link.platform}
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3">Info Project</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Game</span>
            <span className="font-medium text-slate-900 dark:text-white">{project.game_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Status</span>
            <span className={`font-medium ${project.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
              {project.is_active ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Repeatable</span>
            <span className="font-medium text-slate-900 dark:text-white">{project.is_repeatable ? 'Ya' : 'Tidak'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Fast Track</span>
            <span className="font-medium text-slate-900 dark:text-white">{project.has_fast_track ? 'Ya' : 'Tidak'}</span>
          </div>
        </div>
      </div>

      {/* Public Link */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
        <h3 className="font-bold mb-2">Link Publik</h3>
        <p className="text-xs text-indigo-100 mb-3">Bagikan ke viewer kamu</p>
        <div className="bg-white/20 rounded-lg px-3 py-2 text-xs font-mono break-all mb-3">
          /p/{project.slug}
        </div>
        <Button size="sm" variant="secondary" className="w-full text-xs" onClick={() => copyPublicUrl(project.slug)}>
          {copiedUrl ? <><Check className="h-3 w-3 mr-1.5" /> Tersalin!</> : <><Copy className="h-3 w-3 mr-1.5" /> Salin Link</>}
        </Button>
      </div>

      {/* Game Roles */}
      {projectRoles.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">Game Roles</h3>
          <div className="flex flex-wrap gap-2">
            {projectRoles.map((role) => (
              <span key={role.id} className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
                {role.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {(() => {
        interface LeaderboardPlayer {
          name: string
          totalGames: number
          id: string
        }

        // Group entries by game_id and sum games_played
        const leaderboardData = (entries || []).reduce((acc: Record<string, LeaderboardPlayer>, entry) => {
          if (!entry.game_id || entry.games_played === 0) return acc
          const id = entry.game_id
          if (!acc[id]) {
            acc[id] = {
              name: getPlayerName(entry),
              totalGames: 0,
              id: entry.id
            }
          }
          acc[id].totalGames += entry.games_played
          return acc
        }, {})

        const topPlayers = Object.values(leaderboardData)
          .sort((a, b) => b.totalGames - a.totalGames)
          .slice(0, 5)

        if (topPlayers.length === 0) return null

        return (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
              <Crown className="h-4 w-4 text-amber-500" />
              Leaderboard
            </h3>
            <div className="space-y-2">
              {topPlayers.map((player, i) => (
                <div key={player.id} className="flex items-center justify-between text-sm gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-slate-200 text-slate-600' :
                        i === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-500'
                      }`}>{i + 1}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{player.name}</span>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{player.totalGames} game</span>
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
