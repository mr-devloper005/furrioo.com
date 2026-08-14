import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Images, PenLine, Rocket } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

const steps = [
  { icon: PenLine, label: 'Create your account', note: 'Name, email and a password — that is all.' },
  { icon: Images, label: 'Add your first entry', note: 'Upload visuals and write a short summary.' },
  { icon: Rocket, label: 'Appear in the directory', note: 'Your entry joins the browsing surface.' },
]

export default function SignupPage() {
  const copy = pagesContent.auth.signup

  return (
    <EditableSiteShell>
      <main className="bg-[var(--fu-page)] text-[var(--fu-text)]">
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid overflow-hidden rounded-[var(--fu-radius-lg)] shadow-[var(--fu-shadow-lg)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
            {/* form panel first on desktop, second on mobile */}
            <div className="order-2 bg-white p-8 sm:p-10 lg:order-1 lg:p-12">
              <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{copy.formTitle}</p>
              <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em]">Set up your account</h2>
              <p className="mt-2 text-sm leading-[1.75] text-[var(--fu-muted)]">
                It takes about thirty seconds and unlocks the publishing workspace.
              </p>

              <EditableLocalSignupForm />

              <p className="mt-6 text-sm leading-[1.75] text-[var(--fu-muted)]">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-[var(--fu-accent-strong)] fu-underline">
                  {copy.loginCta}
                </Link>
              </p>
            </div>

            {/* dark panel */}
            <div className="relative order-1 overflow-hidden bg-[var(--fu-ink)] p-8 text-white sm:p-10 lg:order-2 lg:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(245,147,49,0.2),transparent_65%)]"
              />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent-soft)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fu-accent)]">
                  {copy.badge}
                </span>
                <h1 className="mt-6 text-3xl font-bold leading-[1.12] tracking-[-0.025em] sm:text-4xl">{copy.title}</h1>
                <p className="mt-4 max-w-md text-[15px] leading-[1.85] text-white/60">{copy.description}</p>

                <ol className="mt-9 grid gap-3">
                  {steps.map((step, index) => (
                    <li key={step.label} className="flex items-start gap-3 rounded-[var(--fu-radius-sm)] border border-white/10 bg-white/[0.04] p-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--fu-accent)] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-sm font-semibold text-white">
                          <step.icon className="h-3.5 w-3.5 text-[var(--fu-accent)]" />
                          {step.label}
                        </span>
                        <span className="mt-0.5 block text-[13px] text-white/50">{step.note}</span>
                      </span>
                    </li>
                  ))}
                </ol>

                <Link
                  href="/"
                  className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-white/55 transition hover:gap-3 hover:text-white"
                >
                  Back to home <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
