'use client'

import type { ReactNode } from 'react'
import { ArrowUpRight, Compass, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto bg-[var(--fu-ink)] text-[var(--fu-ink-text)]">
      {/* thin amber rule keeps the footer visually tied to the accent system */}
      <div className="h-[3px] w-full bg-[linear-gradient(90deg,var(--fu-accent)_0%,rgba(245,147,49,0.15)_45%,transparent_100%)]" />

      <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div className="max-w-lg">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[0.8rem] bg-white/95">
                <img src="/favicon.png" alt="" aria-hidden="true" className="h-9 w-9 object-contain" />
              </span>
              <span className="text-xl font-bold tracking-[-0.02em] text-white">{SITE_CONFIG.name}</span>
            </Link>

            <p className="mt-5 text-[15px] leading-[1.8] text-white/60">
              {globalContent.footer?.description || SITE_CONFIG.description}
            </p>

            <form action="/search" className="mt-7 flex max-w-md items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] p-1.5 pl-4 transition focus-within:border-[var(--fu-accent-ring)]">
              <Compass className="h-4 w-4 shrink-0 text-white/40" />
              <input
                name="q"
                type="search"
                placeholder="Find something specific"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm font-medium text-white outline-none placeholder:text-white/35"
              />
              <button className="shrink-0 rounded-full bg-[var(--fu-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--fu-accent-strong)]">
                Go
              </button>
            </form>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <FooterColumn
              title="Browse"
              links={[
                ...taskLinks.map((task) => ({ label: task.label, href: task.route })),
                { label: 'Search', href: '/search' },
              ]}
            />
            <FooterColumn
              title="Site"
              links={[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ]}
            />
            <FooterColumn
              title="Account"
              links={session ? [{ label: 'Create post', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }]}
              action={
                session ? (
                  <button type="button" onClick={logout} className="text-left text-sm font-medium text-white/60 transition hover:text-white">
                    Log out
                  </button>
                ) : undefined
              }
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
              <Sparkles className="h-3.5 w-3.5 text-[var(--fu-accent)]" />
              {globalContent.footer?.bottomNote || 'Curated for clean browsing'}
            </span>
            <Link href="/contact" className="inline-flex items-center gap-1.5 font-medium text-white/60 transition hover:text-white">
              <Mail className="h-3.5 w-3.5" />
              Get in touch
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links, action }: { title: string; links: Array<{ label: string; href: string }>; action?: ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--fu-accent)]">{title}</h3>
      <div className="mt-4 grid gap-2.5">
        {links.map((link) => (
          <Link
            key={`${title}-${link.href}`}
            href={link.href}
            className="w-fit text-sm font-medium text-white/60 transition hover:translate-x-0.5 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
        {action}
      </div>
    </div>
  )
}
