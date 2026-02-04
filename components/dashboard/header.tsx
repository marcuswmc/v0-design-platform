"use client"

import type { User } from "@supabase/supabase-js"
import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
}

interface HeaderProps {
  user: User
  profile: Profile | null
}

export function DashboardHeader({ user, profile }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search brands, colors, fonts..." 
            className="w-80 bg-secondary pl-10"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
          {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  )
}
