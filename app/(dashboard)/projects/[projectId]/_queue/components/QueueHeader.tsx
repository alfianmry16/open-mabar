'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Settings,
  ExternalLink,
  Copy,
  Check,
  Zap,
} from 'lucide-react'
import { useQueueStore } from '../store'
import { cn } from '@/lib/utils'

export function QueueHeader({ isOwner, isPublicView = false }: { isOwner: boolean, isPublicView?: boolean }) {
  const { copiedUrl, copyPublicUrl, project } = useQueueStore()

  if (!project) return null

  // Only show staff controls if user is owner AND NOT on the public view
  const showStaffControls = isOwner && !isPublicView

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {showStaffControls && (
          <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link href="/projects">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
              {project.name}
            </h1>
            {showStaffControls && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border shadow-sm",
                project.is_active
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
              )}>
                {project.is_active ? 'Aktif' : 'Nonaktif'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-slate-500 overflow-x-auto scrollbar-hide">
            <span className="text-sm text-slate-500 dark:text-slate-400">{project.game_name}</span>
            {showStaffControls && (
              <span className={`w-2 h-2 rounded-full ${project.is_active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
            )}
          </div>
        </div>
      </div>
      {showStaffControls && (
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => useQueueStore.getState().toggleProjectStatus()}
            className={cn(
              "flex-1 sm:flex-none text-[10px] h-8 px-2 sm:text-xs sm:h-9 font-bold transition-all",
              project.is_active
                ? "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 bg-emerald-50/30"
            )}
            title={project.is_active ? 'Tutup Antrian untuk Publik' : 'Buka Antrian untuk Publik'}
          >
            <Zap className={cn("h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5", project.is_active ? "text-red-400" : "text-emerald-500 fill-emerald-500")} />
            {project.is_active ? 'Tutup Antrian' : 'Buka Antrian'}
          </Button>

          <Button variant="outline" size="sm" onClick={() => copyPublicUrl(project.slug)} className="flex-1 sm:flex-none text-[10px] h-8 px-2 sm:text-xs sm:h-9">
            {copiedUrl ? <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />}
            {copiedUrl ? 'Tersalin' : 'Copy Link'}
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none text-[10px] h-8 px-2 sm:text-xs sm:h-9">
            <Link href={`/p/${project.slug}`} target="_blank">
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
              Publik
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none text-[10px] h-8 px-2 sm:text-xs sm:h-9">
            <Link href={`/projects/${project.id}/settings`}>
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
              Settings
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
