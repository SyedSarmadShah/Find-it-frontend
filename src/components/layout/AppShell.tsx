import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../notifications/NotificationBell'
import ThemeToggle from '../ui/ThemeToggle'

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-ink text-paper shadow-glow dark:bg-paper dark:text-ink'
      : 'text-ink/70 hover:bg-black/5 dark:text-paper/70 dark:hover:bg-white/5',
  ].join(' ')

export default function AppShell() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('findit-theme')
    return stored === 'dark' ? 'dark' : 'light'
  })

  const displayName = useMemo(() => user?.full_name || user?.email || 'Campus user', [user])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('findit-theme', theme)
  }, [theme])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen overflow-x-hidden text-ink dark:text-paper">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[color:var(--app-bg)]/90 backdrop-blur-xl dark:border-white/10 dark:bg-[color:var(--app-bg)]/85">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src="/logo-find-it.png" alt="Find-It" className="h-10 w-10 rounded-2xl object-contain sm:h-11 sm:w-11" />
            <div>
              <div className="font-display text-lg font-bold tracking-tight sm:text-xl">Find-It</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-ink/45 dark:text-paper/50 sm:text-xs sm:tracking-[0.24em]">Campus recovery network</div>
            </div>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            <NavLink to="/dashboard" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/items/lost" className={navClass}>
              Lost Items
            </NavLink>
            <NavLink to="/items/found" className={navClass}>
              Found Items
            </NavLink>
            <NavLink to="/claims/review" className={navClass}>
              Claim Requests
            </NavLink>
            <NavLink
              to="/items/new"
              className={() =>
                'rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] ring-1 ring-black/20 transition hover:opacity-95 dark:bg-white dark:text-ink relative z-50'
              }
            >
              Report Item
            </NavLink>
            <NotificationBell />
            <ThemeToggle theme={theme} onToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
            <span className="ml-2 rounded-full border border-black/5 bg-black/5 px-4 py-2 text-sm text-ink/70 dark:border-white/10 dark:bg-white/5 dark:text-paper/70">
              {displayName}
            </span>
            <button className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90 dark:bg-paper dark:text-ink" onClick={() => void handleLogout()} type="button">
              Logout
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <NotificationBell />
            <ThemeToggle theme={theme} onToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-paper dark:hover:bg-white/10"
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        <div className={`fixed inset-0 z-40 lg:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <button
            type="button"
            aria-label="Close mobile menu overlay"
            onClick={() => setMenuOpen(false)}
            className={`absolute inset-0 bg-ink/45 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          />
          <aside
            id="mobile-drawer"
            className={`absolute right-0 top-0 flex h-full w-[min(88vw,20rem)] flex-col gap-3 overflow-y-auto border-l border-black/5 bg-[color:var(--app-bg)] p-4 shadow-[0_30px_100px_rgba(11,23,39,0.24)] transition-transform duration-300 dark:border-white/10 dark:bg-[color:var(--app-bg)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/45 dark:text-paper/45">Navigation</span>
              <button type="button" onClick={() => setMenuOpen(false)} className="rounded-full bg-black/5 px-3 py-2 text-sm font-medium text-ink dark:bg-white/5 dark:text-paper">
                Close
              </button>
            </div>
            <div className="grid gap-2 rounded-[1.5rem] border border-black/5 bg-white/80 p-3 shadow-glow backdrop-blur dark:border-white/10 dark:bg-white/5">
            <NavLink to="/dashboard" className={navClass} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/items/lost" className={navClass} onClick={() => setMenuOpen(false)}>
              Lost Items
            </NavLink>
            <NavLink to="/items/found" className={navClass} onClick={() => setMenuOpen(false)}>
              Found Items
            </NavLink>
            <NavLink to="/claims/review" className={navClass} onClick={() => setMenuOpen(false)}>
              Claim Requests
            </NavLink>
            <NavLink
              to="/items/new"
              onClick={() => setMenuOpen(false)}
              className={() =>
                'rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] ring-1 ring-black/20 transition hover:opacity-95 dark:bg-white dark:text-ink'
              }
            >
              Report Item
            </NavLink>
            <NavLink to="/dashboard#my-reports" className={navClass} onClick={() => setMenuOpen(false)}>
              My Reports
            </NavLink>
            <NavLink to="/profile" className={navClass} onClick={() => setMenuOpen(false)}>
              Profile
            </NavLink>
            <NavLink to="/notifications" className={navClass} onClick={() => setMenuOpen(false)}>
              Notifications
            </NavLink>
            <div className="flex items-center justify-between gap-3 rounded-full bg-black/5 px-4 py-2 text-sm text-ink/70 dark:bg-white/5 dark:text-paper/70">
              <span className="truncate">{displayName}</span>
              <button className="font-medium text-rust" onClick={() => void handleLogout()} type="button">
                Logout
              </button>
            </div>
          </div>
          </aside>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-5 sm:px-6 sm:pb-12 sm:pt-6 lg:px-8">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/5 bg-[color:var(--app-bg)]/95 backdrop-blur-lg dark:border-white/10 dark:bg-[color:var(--app-bg)]/85 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium text-ink' : 'flex flex-1 flex-col items-center gap-1 py-2 text-xs text-ink/70') }>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13l9-9 9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Home</span>
          </NavLink>
          <NavLink to="/items/lost" className={({ isActive }) => (isActive ? 'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium text-ink' : 'flex flex-1 flex-col items-center gap-1 py-2 text-xs text-ink/70') }>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Lost</span>
          </NavLink>
          <NavLink
            to="/items/new"
            className={({ isActive }) =>
              isActive
                ? 'flex flex-1 flex-col items-center gap-1 text-xs font-medium text-white bg-black rounded-xl px-3 py-2'
                : 'flex flex-1 flex-col items-center gap-1 text-xs text-white bg-black rounded-xl px-3 py-2'
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Report</span>
          </NavLink>
          <NavLink to="/items/found" className={({ isActive }) => (isActive ? 'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium text-ink' : 'flex flex-1 flex-col items-center gap-1 py-2 text-xs text-ink/70') }>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
            <span>Found</span>
          </NavLink>
          <NavLink to="/claims/review" className={({ isActive }) => (isActive ? 'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium text-ink' : 'flex flex-1 flex-col items-center gap-1 py-2 text-xs text-ink/70') }>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span>Claims</span>
          </NavLink>
          <NavLink to="/notifications" className={({ isActive }) => (isActive ? 'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium text-ink' : 'flex flex-1 flex-col items-center gap-1 py-2 text-xs text-ink/70') }>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Notifs</span>
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
