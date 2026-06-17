import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type TrendDirection = "up" | "down" | "neutral"
type StatsCardVariant = "default" | "primary" | "mint" | "orange"

export interface StatsCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  trend?: {
    value: string | number
    direction: TrendDirection
    label?: string
  }
  variant?: StatsCardVariant
  className?: string
  iconClassName?: string
}

const variantClasses: Record<StatsCardVariant, {
  wrapper: string
  iconWrapper: string
  trend: Record<TrendDirection, string>
}> = {
  default: {
    wrapper: "bg-surface-card",
    iconWrapper: "bg-primary-50 text-primary-600",
    trend: {
      up: "text-emerald-600 bg-emerald-50",
      down: "text-red-600 bg-red-50",
      neutral: "text-text-tertiary bg-surface-bg",
    },
  },
  primary: {
    wrapper: "bg-gradient-primary text-white",
    iconWrapper: "bg-white/15 text-white",
    trend: {
      up: "text-white bg-white/15",
      down: "text-white bg-white/15",
      neutral: "text-white bg-white/15",
    },
  },
  mint: {
    wrapper: "bg-gradient-mint text-white",
    iconWrapper: "bg-white/15 text-white",
    trend: {
      up: "text-white bg-white/15",
      down: "text-white bg-white/15",
      neutral: "text-white bg-white/15",
    },
  },
  orange: {
    wrapper: "bg-gradient-accent text-white",
    iconWrapper: "bg-white/15 text-white",
    trend: {
      up: "text-white bg-white/15",
      down: "text-white bg-white/15",
      neutral: "text-white bg-white/15",
    },
  },
}

export function StatsCard({
  icon,
  value,
  label,
  trend,
  variant = "default",
  className,
  iconClassName,
}: StatsCardProps) {
  const styles = variantClasses[variant]
  const isPrimaryVariant = variant !== "default"

  return (
    <div
      className={cn(
        "relative rounded-2xl p-6 shadow-card border border-surface-border/60",
        "transition-all duration-300 ease-out hover:shadow-card-hover hover:-translate-y-0.5",
        "overflow-hidden",
        styles.wrapper,
        isPrimaryVariant && "border-transparent",
        className
      )}
    >
      {isPrimaryVariant && (
        <div className="absolute inset-0 bg-card-glow pointer-events-none" />
      )}
      <div className="relative flex items-start justify-between mb-5">
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl shrink-0",
            styles.iconWrapper,
            iconClassName
          )}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
              styles.trend[trend.direction]
            )}
          >
            {trend.direction === "up" && <ArrowUpRight className="w-3.5 h-3.5" />}
            {trend.direction === "down" && <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{trend.value}</span>
            {trend.label && <span className="opacity-70">{trend.label}</span>}
          </div>
        )}
      </div>
      <div className="relative">
        <div className={cn(
          "text-3xl font-bold tracking-tight mb-1.5 tabular-nums",
          !isPrimaryVariant && "text-text-primary"
        )}>
          {value}
        </div>
        <div className={cn(
          "text-sm font-medium",
          isPrimaryVariant ? "text-white/80" : "text-text-tertiary"
        )}>
          {label}
        </div>
      </div>
    </div>
  )
}
