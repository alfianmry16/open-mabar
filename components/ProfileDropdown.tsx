"use client"

import Link from 'next/link'
import { LogOut, User, LayoutGrid } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface ProfileDropdownProps {
  displayName: string
  email?: string
}

export function ProfileDropdown({ displayName, email }: ProfileDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-full justify-start gap-2 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 sm:w-auto sm:justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col items-start gap-0.5 text-left sm:hidden md:flex">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none">{displayName}</span>
            {email && <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[100px]">{email}</span>}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            {email && <p className="text-xs leading-none text-slate-500 dark:text-slate-400">{email}</p>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/projects" className="cursor-pointer">
              <LayoutGrid className="mr-2 h-4 w-4" />
              <span>Project Saya</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Menu Profil</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault()
            const form = document.getElementById('logout-form') as HTMLFormElement
            form?.submit()
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar</span>
          <form id="logout-form" action="/signout" method="POST" className="hidden" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
