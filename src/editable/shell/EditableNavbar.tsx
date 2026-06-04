'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navVars = {
    '--editable-nav-bg': 'rgba(255,255,255,0.92)',
    '--editable-nav-text': preset.colors.foreground,
    '--editable-nav-active': preset.colors.foreground,
    '--editable-nav-active-text': '#000000f6',
    '--editable-cta-bg': preset.colors.accent,
    '--editable-cta-text': '#ffffff',
    '--editable-search-bg': '#f6f7fb',
    '--editable-border': 'rgba(17,19,23,0.10)',
    '--editable-container': '1600px',
  } as CSSProperties
  const navItems = useMemo(
    () => [
      { label: 'Images', href: SITE_CONFIG.taskViews.image || '/image' },
      { label: 'Contact', href: '/contact' },
      { label: 'about', href: '/about' },


    ],
    []
  )

  const activeMatch = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-2xl">
      <div className="h-[3px] bg-[linear-gradient(90deg,transparent,rgba(61,71,255,0.85),transparent)]" />
      <nav className="mx-auto flex min-h-[72px] w-full max-w-[var(--editable-container)] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-12 w-12 rounded-full object-contain" />
          <span className="hidden min-w-0 sm:block">
            <span className="block text-[18px] font-black tracking-[-0.05em] text-[var(--editable-cta-bg)]">{SITE_CONFIG.name}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = activeMatch(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  active
                    ? 'bg-[var(--editable-nav-active)] text-[var(--editable-nav-active-text)] shadow-sm'
                    : 'text-black/78 hover:bg-black/[0.04]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <form action="/search" className="mx-auto hidden min-w-0 flex-1 justify-center md:flex">
          <label className="flex w-full max-w-3xl items-center rounded-full border border-[var(--editable-border)] bg-[var(--editable-search-bg)] px-4 py-3 shadow-sm">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            <input
              name="q"
              type="search"
              placeholder="Search posts, profiles, or topics"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm font-bold outline-none placeholder:text-black/40"
            />
          </label>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-sm font-black text-black/80 shadow-sm md:hidden">
            <Search className="h-4 w-4" />
            Search
          </Link>
          {session ? (
            <>
              <Link href="/create" className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-4 py-2.5 text-sm font-black text-[var(--editable-cta-text)] shadow-[0_12px_30px_rgba(61,71,255,0.22)] sm:inline-flex">
                <PlusCircle className="h-4 w-4" />
                Create
              </Link>
              <button type="button" onClick={logout} className="hidden items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2.5 text-sm font-black text-black/80 sm:inline-flex">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2.5 text-sm font-black text-black/80 sm:inline-flex">
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
              <Link href="/signup" className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-4 py-2.5 text-sm font-black text-[var(--editable-cta-text)] shadow-[0_12px_30px_rgba(61,71,255,0.22)] sm:inline-flex">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center justify-center rounded-full border border-[var(--editable-border)] bg-white p-2.5 lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[rgba(255,255,255,0.98)] px-4 py-4 lg:hidden">
          <form action="/search" className="rounded-[1.4rem] border border-[var(--editable-border)] bg-[var(--editable-search-bg)] px-3 py-2">
            <label className="flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0 opacity-50" />
              <input name="q" type="search" placeholder="Search the site" className="min-w-0 flex-1 bg-transparent py-1 text-sm font-bold outline-none placeholder:text-black/40" />
            </label>
          </form>
          <div className="mt-4 grid gap-2">
            {[{ label: 'Home', href: '/' }, ...navItems, { label: 'About', href: '/about' }, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Start free trial', href: '/signup' }])].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[1.2rem] border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-black text-black/80"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
