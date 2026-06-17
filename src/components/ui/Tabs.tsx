import * as React from "react"
import { cn } from "@/lib/utils"

export interface TabItem {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  className?: string
  tabClassName?: string
  activeTabClassName?: string
}

export function Tabs({
  items,
  value,
  onChange,
  className,
  tabClassName,
  activeTabClassName,
}: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-surface-bg rounded-xl border border-surface-border/60",
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.value === value
        const isDisabled = item.disabled

        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled || undefined}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(item.value)}
            className={cn(
              "relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
              "transition-all duration-200 ease-out",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
              isActive
                ? cn(
                    "bg-white text-primary-600 shadow-sm",
                    activeTabClassName
                  )
                : cn(
                    "text-text-tertiary hover:text-text-secondary hover:bg-white/60",
                    isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-text-tertiary",
                    tabClassName
                  )
            )}
          >
            {item.icon}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export interface TabsContentProps {
  value: string
  currentValue: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({
  value,
  currentValue,
  children,
  className,
}: TabsContentProps) {
  if (value !== currentValue) return null

  return (
    <div
      role="tabpanel"
      className={cn("mt-4 animate-fade-in", className)}
    >
      {children}
    </div>
  )
}
