import * as React from "react"
import { cn } from "@/lib/utils"
import { NavLink, useNavigate } from "react-router-dom"
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  User as UserIcon,
  Settings,
  LogOut,
  MessageCircle,
} from "lucide-react"
import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"

const navItems = [
  { label: "首页", to: "/" },
  { label: "课程", to: "/courses" },
  { label: "词汇", to: "/vocabulary" },
  { label: "社区", to: "/community" },
  { label: "翻译", to: "/translation" },
]

const userMenuItems = [
  {
    label: "我的进度",
    icon: <TrendingUp className="w-4 h-4" />,
    to: "/progress",
  },
  {
    label: "个人中心",
    icon: <UserIcon className="w-4 h-4" />,
    to: "/profile",
  },
  {
    label: "设置",
    icon: <Settings className="w-4 h-4" />,
    to: "/settings",
  },
]

export function AppHeader() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const userMenuRef = React.useRef<HTMLDivElement>(null)
  const [hasUnreadNotification] = React.useState(true)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-surface-border/60">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-primary shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold bg-gradient-primary bg-clip-text text-transparent tracking-tight">
                  手语桥
                </span>
                <span className="text-[10px] font-medium text-text-tertiary -mt-0.5 tracking-wide">
                  SignBridge
                </span>
              </div>
            </NavLink>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-primary-600 bg-primary-50"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-bg"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="搜索课程、词汇..."
                  className="w-48 xl:w-64 pl-9 pr-4 py-2 rounded-lg bg-surface-bg border-2 border-transparent text-sm text-text-primary placeholder:text-surface-muted transition-all duration-200 focus:outline-none focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-50"
                />
              </div>
            </form>

            <button
              type="button"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-bg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
              aria-label="消息通知"
            >
              <Bell className="w-5 h-5" />
              {hasUnreadNotification && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-orange-500 ring-2 ring-white animate-breathe" />
              )}
            </button>

            <div className="hidden sm:block" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-surface-bg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
              >
                <Avatar
                  size="sm"
                  fallback="手语用户"
                />
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-text-tertiary transition-transform duration-200",
                    userMenuOpen && "rotate-180"
                  )}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-4 lg:right-6 top-16 mt-1 w-56 bg-white rounded-xl shadow-elevation border border-surface-border/60 py-2 animate-scale-in origin-top-right">
                  <div className="px-4 py-3 border-b border-surface-border/60 mb-1">
                    <div className="text-sm font-semibold text-text-primary">手语学习者</div>
                    <div className="text-xs text-text-tertiary">user@signbridge.com</div>
                  </div>
                  <div className="py-1">
                    {userMenuItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setUserMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150",
                            isActive
                              ? "bg-primary-50 text-primary-600"
                              : "text-text-secondary hover:bg-surface-bg hover:text-text-primary"
                          )
                        }
                      >
                        {item.icon}
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                  <div className="border-t border-surface-border/60 mt-1 pt-1">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-bg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
              aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-surface-border/60 bg-white animate-fade-in">
          <div className="max-w-[1440px] mx-auto px-4 py-4 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="搜索课程、词汇..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface-bg border-2 border-transparent text-sm text-text-primary placeholder:text-surface-muted transition-all duration-200 focus:outline-none focus:border-primary-300 focus:bg-white"
                />
              </div>
            </form>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-primary-600 bg-primary-50"
                        : "text-text-secondary hover:bg-surface-bg"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="pt-2 border-t border-surface-border/60 space-y-1">
              {userMenuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-primary-600 bg-primary-50"
                        : "text-text-secondary hover:bg-surface-bg"
                    )
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="sm:hidden pt-2 border-t border-surface-border/60">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                退出登录
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
