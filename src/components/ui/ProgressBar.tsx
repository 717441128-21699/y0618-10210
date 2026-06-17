import * as React from "react"
import { cn } from "@/lib/utils"

type ProgressBarColor = "primary" | "orange" | "mint" | "yellow" | "success" | "danger"

export interface ProgressBarProps {
  value: number
  max?: number
  color?: ProgressBarColor
  showPercentage?: boolean
  label?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const colorClasses: Record<ProgressBarColor, string> = {
  primary: "bg-gradient-primary",
  orange: "bg-gradient-accent",
  mint: "bg-gradient-mint",
  yellow: "bg-accent-yellow-500",
  success: "bg-emerald-500",
  danger: "bg-red-500",
}

const sizeClasses: Record<NonNullable<ProgressBarProps["size"]>, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
}

const textSizeClasses: Record<NonNullable<ProgressBarProps["size"]>, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
}

export function ProgressBar({
  value,
  max = 100,
  color = "primary",
  showPercentage = false,
  label,
  size = "md",
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(0, value), max)
  const percentage = Math.round((clampedValue / max) * 100)

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className={cn("font-medium text-text-secondary", textSizeClasses[size])}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={cn("font-semibold text-text-primary tabular-nums", textSizeClasses[size])}>
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-surface-border/50 rounded-full overflow-hidden",
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
