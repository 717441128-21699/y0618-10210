import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

type TagChipVariant = "default" | "primary" | "success" | "warning" | "danger"

export interface TagChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagChipVariant
  selected?: boolean
  removable?: boolean
  onRemove?: () => void
  size?: "sm" | "md"
}

const variantClasses: Record<TagChipVariant, { default: string; selected: string }> = {
  default: {
    default: "bg-white text-text-secondary border-surface-border hover:border-primary-300 hover:text-primary-600",
    selected: "bg-primary-600 text-white border-primary-600 shadow-sm",
  },
  primary: {
    default: "bg-primary-50 text-primary-600 border-primary-200 hover:border-primary-400",
    selected: "bg-primary-600 text-white border-primary-600 shadow-sm",
  },
  success: {
    default: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400",
    selected: "bg-emerald-600 text-white border-emerald-600 shadow-sm",
  },
  warning: {
    default: "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400",
    selected: "bg-amber-600 text-white border-amber-600 shadow-sm",
  },
  danger: {
    default: "bg-red-50 text-red-700 border-red-200 hover:border-red-400",
    selected: "bg-red-600 text-white border-red-600 shadow-sm",
  },
}

const sizeClasses: Record<NonNullable<TagChipProps["size"]>, string> = {
  sm: "px-2.5 py-1 text-xs gap-1",
  md: "px-3.5 py-1.5 text-sm gap-1.5",
}

export const TagChip = React.forwardRef<HTMLSpanElement, TagChipProps>(
  (
    {
      className,
      variant = "default",
      selected = false,
      removable = false,
      onRemove,
      size = "md",
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const isClickable = !!onClick

    return (
      <span
        ref={ref}
        onClick={onClick}
        className={cn(
          "inline-flex items-center rounded-full font-medium border",
          "transition-all duration-200 ease-out",
          isClickable && "cursor-pointer select-none active:scale-[0.97]",
          selected
            ? variantClasses[variant].selected
            : variantClasses[variant].default,
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.()
            }}
            className={cn(
              "inline-flex items-center justify-center rounded-full -mr-1",
              "transition-colors duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-current",
              selected
                ? "hover:bg-white/20"
                : "hover:bg-black/5"
            )}
            aria-label="移除标签"
          >
            <X className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
          </button>
        )}
      </span>
    )
  }
)

TagChip.displayName = "TagChip"
