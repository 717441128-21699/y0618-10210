import * as React from "react"
import { cn } from "@/lib/utils"
import { Inbox, Search, FileX } from "lucide-react"

type EmptyStateType = "default" | "search" | "error"

export interface EmptyStateProps {
  type?: EmptyStateType
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  iconClassName?: string
}

const defaultIcons: Record<EmptyStateType, React.ReactNode> = {
  default: <Inbox className="w-12 h-12" />,
  search: <Search className="w-12 h-12" />,
  error: <FileX className="w-12 h-12" />,
}

export function EmptyState({
  type = "default",
  icon,
  title,
  description,
  action,
  className,
  iconClassName,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-6 py-16",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-20 h-20 rounded-2xl mb-6",
          "bg-surface-bg text-surface-muted",
          iconClassName
        )}
      >
        {icon ?? defaultIcons[type]}
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-tertiary max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <div className="flex items-center justify-center">
          {action}
        </div>
      )}
    </div>
  )
}
