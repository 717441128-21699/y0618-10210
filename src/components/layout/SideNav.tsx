import * as React from "react"
import { cn } from "@/lib/utils"
import { NavLink, useLocation } from "react-router-dom"
import {
  Home,
  BookOpen,
  BookMarked,
  Users,
  Handshake,
  BarChart3,
  User,
} from "lucide-react"

const menuItems = [
  {
    to: "/",
    icon: <Home className="w-5 h-5" />,
    label: "首页",
    emoji: "🏠",
  },
  {
    to: "/courses",
    icon: <BookOpen className="w-5 h-5" />,
    label: "课程学习",
    emoji: "📚",
  },
  {
    to: "/vocabulary",
    icon: <BookMarked className="w-5 h-5" />,
    label: "手语词汇",
    emoji: "📖",
  },
  {
    to: "/community",
    icon: <Users className="w-5 h-5" />,
    label: "互动社区",
    emoji: "🎬",
  },
  {
    to: "/translation",
    icon: <Handshake className="w-5 h-5" />,
    label: "翻译预约",
    emoji: "🤝",
  },
  {
    to: "/progress",
    icon: <BarChart3 className="w-5 h-5" />,
    label: "进度中心",
    emoji: "📊",
  },
  {
    to: "/profile",
    icon: <User className="w-5 h-5" />,
    label: "个人中心",
    emoji: "👤",
  },
]

export function SideNav() {
  const location = useLocation()

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-[calc(100vh-4.5rem)] sticky top-[4.5rem] bg-white border-r border-surface-border/60">
      <div className="flex-1 overflow-y-auto py-6 px-4 hide-scrollbar">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname === item.to ||
                  location.pathname.startsWith(`${item.to}/`)

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-white bg-gradient-primary shadow-lg shadow-primary-500/25"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-bg"
                )}
              >
                <span
                  className={cn(
                    "w-5 flex items-center justify-center text-base transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )}
                  aria-hidden="true"
                >
                  {item.emoji}
                </span>
                <span className="flex-1 leading-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-l-full bg-accent-orange-500" />
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-8 p-4 rounded-2xl bg-gradient-mint/10 border border-accent-mint-200/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-mint flex items-center justify-center text-white shadow-sm">
              <span aria-hidden="true">✨</span>
            </div>
            <span className="text-sm font-bold text-text-primary">每日签到</span>
          </div>
          <p className="text-xs text-text-tertiary mb-3 leading-relaxed">
            连续签到获取学习积分，解锁专属徽章！
          </p>
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-accent-mint-500 text-white text-xs font-semibold shadow-sm hover:bg-accent-mint-600 hover:shadow transition-all duration-200 active:scale-[0.98]"
          >
            立即签到
            <span className="text-white/80">+10</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
