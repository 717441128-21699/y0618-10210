import * as React from "react"
import { cn } from "@/lib/utils"
import { NavLink, useLocation } from "react-router-dom"
import { Home, BookOpen, BookMarked, Users, User } from "lucide-react"

const tabs = [
  {
    to: "/",
    icon: Home,
    label: "首页",
  },
  {
    to: "/courses",
    icon: BookOpen,
    label: "课程",
  },
  {
    to: "/vocabulary",
    icon: BookMarked,
    label: "词汇",
  },
  {
    to: "/community",
    icon: Users,
    label: "社区",
  },
  {
    to: "/profile",
    icon: User,
    label: "我的",
  },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-surface-border/60 pb-safe">
      <div className="max-w-[1440px] mx-auto px-2">
        <div className="flex items-end justify-around pt-1.5 pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive =
              tab.to === "/"
                ? location.pathname === "/"
                : location.pathname === tab.to ||
                  location.pathname.startsWith(`${tab.to}/`)

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive: navIsActive }) => {
                  const active = navIsActive || isActive
                  return cn(
                    "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 min-w-0",
                    "transition-all duration-200 ease-out",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1 rounded-lg mx-0.5",
                    active
                      ? "text-accent-orange-500"
                      : "text-text-tertiary hover:text-text-secondary"
                  )
                }}
              >
                {({ isActive: navIsActive }) => {
                  const active = navIsActive || isActive
                  return (
                    <>
                      <div
                        className={cn(
                          "relative flex items-center justify-center transition-all duration-200 ease-out",
                          active && "scale-110 -translate-y-0.5"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5 transition-all duration-200",
                            active &&
                              "[filter:drop-shadow(0_2px_6px_rgba(255,107,53,0.4))]"
                          )}
                          strokeWidth={active ? 2.5 : 2}
                        />
                        {active && (
                          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-orange-500" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-medium leading-tight transition-all duration-200",
                          active && "font-semibold"
                        )}
                      >
                        {tab.label}
                      </span>
                    </>
                  )
                }}
              </NavLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
