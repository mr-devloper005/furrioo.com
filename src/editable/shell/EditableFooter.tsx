'use client'

import type { CSSProperties, ReactNode } from 'react'
import { ArrowUpRight, Globe, Instagram, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const footerVars = {
    '--editable-footer-bg': '#111111',
    '--editable-footer-text': '#ffffff',
  } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer style={footerVars} className="border-t border-white/10 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_10px_30px_rgba(255,255,255,0.12)]">
                <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-12 w-12 object-contain" />
              </span>
              <span className="text-2xl font-black tracking-[-0.05em]">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/68">
              {globalContent.footer?.description || SITE_CONFIG.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.2em] text-white/60">
              <span className="rounded-full border border-white/10 px-3 py-2">Browse</span>
              <span className="rounded-full border border-white/10 px-3 py-2">Discover</span>
              <span className="rounded-full border border-white/10 px-3 py-2">Connect</span>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <FooterColumn title="Browse" links={taskLinks.map((task) => ({ label: task.label, href: task.route }))} />
            <FooterColumn title="Site" links={[{ label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }, { label: 'Search', href: '/search' }]} />
            <FooterColumn
              title="Account"
              links={session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Sign Up', href: '/signup' }]}
              action={session ? <button type="button" onClick={logout} className="text-left text-sm font-bold text-white/74 transition hover:text-white">Logout</button> : undefined}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 py-6 text-xs text-white/58 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 font-bold text-white/74 transition hover:text-white">
              Contact
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/search" className="font-bold text-white/74 transition hover:text-white">Search</Link>
            <Link href="/about" className="font-bold text-white/74 transition hover:text-white">About</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links, action }: { title: string; links: Array<{ label: string; href: string }>; action?: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.26em] text-white/45">{title}</h3>
      <div className="mt-5 grid gap-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-sm font-bold text-white/74 transition hover:text-white">
            {link.label}
          </Link>
        ))}
        {action}
      </div>
    </div>
  )
}
