import * as React from "react"
import { cn } from "@/lib/utils"
import { AppHeader } from "@/components/layout/AppHeader"
import { SideNav } from "@/components/layout/SideNav"
import { BottomNav } from "@/components/layout/BottomNav"

export interface AppLayoutProps {
  children: React.ReactNode
  className?: string
  contentClassName?: string
  showSideNav?: boolean
  showBottomNav?: boolean
}

export function AppLayout({
  children,
  className,
  contentClassName,
  showSideNav = true,
  showBottomNav = true,
}: AppLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-surface-bg flex flex-col",
        className
      )}
    >
      <AppHeader />

      <div className="flex-1 flex">
        {showSideNav && <SideNav />}

        <main
          className={cn(
            "flex-1 min-w-0",
            "flex flex-col",
            showBottomNav && "lg:pb-0 pb-20"
          )}
        >
          <div className="flex-1 w-full">
            <div
              className={cn(
                "max-w-[1440px] mx-auto w-full",
                "px-4 sm:px-6 lg:px-8",
                "py-6 lg:py-8",
                contentClassName
              )}
            >
              {children}
            </div>
          </div>
        </main>
      </div>

      {showBottomNav && <BottomNav />}
    </div>
  )
}
