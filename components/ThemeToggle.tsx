'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { Button } from '@/components/ui/button'

interface ThemeToggleProps {
  variant?: 'icon' | 'full'
  className?: string
}

export function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, mounted } = useTheme()

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  // Before mount: show placeholder matching server render (system/Monitor)
  // After mount: show actual theme icon
  const icon = !mounted
    ? <Monitor className="h-4 w-4" />
    : theme === 'system'
      ? <Monitor className="h-4 w-4" />
      : resolvedTheme === 'dark'
        ? <Moon className="h-4 w-4" />
        : <Sun className="h-4 w-4" />

  const label = !mounted ? 'System' : theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'

  if (variant === 'full') {
    return (
      <button
        onClick={cycleTheme}
        className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors ${className}`}
        title={`Theme: ${label}`}
      >
        {icon}
        <span>{label}</span>
      </button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className={`h-9 w-9 ${className}`}
      title={`Theme: ${label}`}
    >
      {icon}
    </Button>
  )
}
