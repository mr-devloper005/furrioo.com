'use client'

import Link from 'next/link'
import { Clock3, Images, Mail, MessageSquare, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const lanes = [
  {
    icon: Images,
    title: 'Submissions',
    body: 'Share a gallery, a profile update, or a set of visuals you would like considered for the directory.',
  },
  {
    icon: MessageSquare,
    title: 'Corrections and edits',
    body: 'Spotted something out of date on an entry? Send the details and we will get it updated.',
  },
  {
    icon: Sparkles,
    title: 'Everything else',
    body: 'Partnerships, feedback on the site, or a question that does not fit anywhere above.',
  },
]

export default function ContactPage() {
  const copy = pagesContent.contact

  return (
    <EditableSiteShell>
      <main className="bg-[var(--fu-page)] text-[var(--fu-text)]">
        <section className="relative overflow-hidden bg-[var(--fu-ink)] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(245,147,49,0.16),transparent_65%)]"
          />
          <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="max-w-2xl fu-rise">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent-soft)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fu-accent)]">
                <Mail className="h-3.5 w-3.5" />
                {copy.eyebrow}
              </span>
              <h1 className="mt-5 text-[1.9rem] font-bold leading-[1.1] tracking-[-0.025em] sm:text-4xl lg:text-[2.9rem]">
                {copy.title}
              </h1>
              <p className="mt-4 text-[15px] leading-[1.85] text-white/60">{copy.description}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
            <div className="grid content-start gap-4 fu-stagger">
              {lanes.map((lane) => (
                <div
                  key={lane.title}
                  className="rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:border-[var(--fu-accent-ring)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-[var(--fu-accent-strong)]">
                    <lane.icon className="h-4 w-4" />
                  </span>
                  <h2 className="mt-4 text-lg font-bold tracking-[-0.015em]">{lane.title}</h2>
                  <p className="mt-2 text-sm leading-[1.75] text-[var(--fu-muted)]">{lane.body}</p>
                </div>
              ))}

              <div className="rounded-[var(--fu-radius)] bg-[var(--fu-ink)] p-6 text-white">
                <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>Before you write</p>
                <p className="mt-3 flex items-start gap-2.5 text-sm leading-[1.75] text-white/60">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--fu-accent)]" />
                  Messages are read in the order they arrive. Adding a link or a reference to the entry you mean makes it much
                  faster to sort.
                </p>
                <Link
                  href="/search"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/55 transition hover:gap-3 hover:text-white"
                >
                  Search the site first
                </Link>
              </div>
            </div>

            <div className="min-w-0">
              <div className="mb-4">
                <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{copy.formTitle}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em]">Tell us what you need</h2>
              </div>
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
