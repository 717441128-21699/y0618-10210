import * as React from "react"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: AvatarSize
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
}

const iconSizeClasses: Record<AvatarSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
  xl: "w-10 h-10",
}

function getInitials(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return ""
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) {
    return trimmed.slice(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    { className, src, alt = "", fallback, size = "md", ...props },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false)
    const showImage = src && !imageError

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-primary-100 text-primary-600 font-semibold ring-2 ring-white shrink-0",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : fallback ? (
          <span className="leading-none">{getInitials(fallback)}</span>
        ) : (
          <User className={cn("text-primary-500", iconSizeClasses[size])} />
        )}
      </div>
    )
  }
)

Avatar.displayName = "Avatar"
