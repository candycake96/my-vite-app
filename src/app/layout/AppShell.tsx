import { IconRail } from './IconRail'
import { ModuleSubnav } from './ModuleSubnav'
import { TopCommandBar } from './TopCommandBar'
import { Outlet } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

export function AppShell() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [desktopSubnavOpen, setDesktopSubnavOpen] = useState(true)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const handleToggleSidebar = () => {
    try {
      if (window.matchMedia('(min-width: 1024px)').matches) {
        setDesktopSubnavOpen((v) => !v)
        return
      }
    } catch (e) {
      // ignore (SSR guard)
    }
    setMobileSidebarOpen((v) => !v)
  }

  useEffect(() => {
    const open = mobileSidebarOpen
    if (open) {
      const el = panelRef.current?.querySelector<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')
      el?.focus()
    }
  }, [mobileSidebarOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        try {
          if (window.matchMedia('(min-width: 1024px)').matches) {
            // do not close desktop subnav on Escape by default
            return
          }
        } catch (er) {
          // ignore
        }
        setMobileSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen bg-base-200 overflow-hidden">
      <TopCommandBar onToggleSidebar={handleToggleSidebar} sidebarOpen={mobileSidebarOpen || desktopSubnavOpen} />

      <div className="flex h-[calc(100dvh-4rem)] overflow-hidden">
        {/* Icon rail: visible only on lg+ */}
        <IconRail />

        {/* Module subnav: static on lg+ and toggleable on desktop */}
        {desktopSubnavOpen && (
          <ModuleSubnav className="w-72 hidden lg:flex lg:flex-col h-full shrink-0 overflow-y-auto" />
        )}

        {/* Main content: AppShell provides the main element and spacing for pages */}
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-none px-4 sm:px-5 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
          />

          <div className="relative z-50">
            <div
              ref={panelRef}
              id="mobile-sidebar"
              role="dialog"
              aria-modal="true"
              aria-label="เมนูหลัก"
              className="fixed left-0 top-0 h-[100dvh] w-[280px] max-w-[85vw] md:w-[320px] md:max-w-[80vw] overflow-y-auto border-r bg-white p-4"
            >
              <ModuleSubnav className="block lg:hidden" onClose={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}