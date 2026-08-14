'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const imageRoute = SITE_CONFIG.taskViews.image || '/image'

  const navItems = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Gallery', href: imageRoute },
      { label: 'Search', href: '/search' },
      { label: 'About', href: '/about' },
    ],
    [imageRoute]
  )

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

  return (
    <header className="sticky top-0 z-50 bg-[var(--fu-ink)] text-[var(--fu-ink-text)] shadow-[0_1px_0_var(--fu-ink-line)]">
      <nav className="mx-auto flex min-h-[68px] w-full max-w-[var(--editable-container)] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[0.7rem] bg-white/95 ring-1 ring-white/15 transition duration-300 group-hover:ring-[var(--fu-accent)]">
            <img src="/favicon.png" alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[17px] font-bold tracking-[-0.02em] text-white">{SITE_CONFIG.name}</span>
            <span className="hidden truncate text-[9px] font-semibold uppercase tracking-[0.24em] text-white/45 sm:block">
              {globalContent.nav.tagline}
            </span>
          </span>
        </Link>

        <div className="mx-auto hidden items-center gap-1 rounded-full bg-white/[0.04] p-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition duration-200 ${
                  active ? 'bg-white/[0.12] text-white shadow-sm' : 'text-white/62 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.04] p-2.5 text-white/80 transition hover:bg-white/[0.1] hover:text-white lg:hidden"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--fu-accent)] px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--fu-accent-strong)] sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" />
                Create
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/85 transition duration-200 hover:bg-white/[0.1] sm:inline-flex"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/85 transition duration-200 hover:bg-white/[0.1] hover:text-white sm:inline-flex"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[var(--fu-accent)] px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--fu-accent-strong)] hover:shadow-[0_10px_24px_var(--fu-accent-ring)] sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" />
                Sign up
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.04] p-2.5 text-white transition hover:bg-white/[0.1] lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[var(--fu-ink-deep)] px-4 pb-5 pt-4 lg:hidden">
          <form action="/search" className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-white/45" />
            <input
              name="q"
              type="search"
              placeholder="Search the directory"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/40"
            />
          </form>

          <div className="mt-4 grid gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-[0.9rem] px-4 py-3 text-sm font-semibold transition ${
                  isActive(item.href) ? 'bg-[var(--fu-accent)] text-white' : 'bg-white/[0.05] text-white/80 hover:bg-white/[0.1]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="rounded-full bg-[var(--fu-accent)] px-4 py-3 text-center text-sm font-semibold text-white">
                  Create
                </Link>
                <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-full border border-white/14 px-4 py-3 text-sm font-semibold text-white/85">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-full border border-white/14 px-4 py-3 text-center text-sm font-semibold text-white/85">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-full bg-[var(--fu-accent)] px-4 py-3 text-center text-sm font-semibold text-white">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
