import Link from 'next/link'
import { ArrowRight, Compass, Layers, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const valueIcons = [Compass, Layers, Sparkles]

export default function AboutPage() {
  const about = pagesContent.about
  const imageRoute = SITE_CONFIG.taskViews.image || '/image'

  return (
    <EditableSiteShell>
      <main className="bg-[var(--fu-page)] text-[var(--fu-text)]">
        {/* hero */}
        <section className="relative overflow-hidden bg-[var(--fu-ink)] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-28 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(245,147,49,0.16),transparent_65%)]"
          />
          <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl fu-rise">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent-soft)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fu-accent)]">
                {about.badge}
              </span>
              <h1 className="mt-5 text-[2rem] font-bold leading-[1.1] tracking-[-0.025em] sm:text-4xl lg:text-[3rem]">
                {about.title}
              </h1>
              <p className="mt-5 text-[15px] leading-[1.85] text-white/60 sm:text-base">{about.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={imageRoute}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--fu-accent-strong)]"
                >
                  Open the gallery <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className={dc.button.ghostDark}>
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* body */}
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <article className="rounded-[var(--fu-radius-lg)] border border-[var(--fu-line)] bg-white p-7 shadow-[var(--fu-shadow)] sm:p-9">
              <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{pagesContent.home.intro.badge}</p>
              <h2 className="mt-3 text-2xl font-bold leading-snug tracking-[-0.02em] sm:text-[1.75rem]">
                {pagesContent.home.intro.title}
              </h2>
              <div className="mt-6 grid gap-4 text-[15px] leading-[1.85] text-[var(--fu-muted)]">
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 border-t border-[var(--fu-line)] pt-6">
                <p className={`${dc.type.eyebrow} text-[var(--fu-muted)]`}>{pagesContent.home.intro.sideBadge}</p>
                <ul className="mt-4 grid gap-3">
                  {pagesContent.home.intro.sidePoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-[1.75] text-[var(--fu-muted)]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--fu-accent)]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <div className="grid content-start gap-4 fu-stagger">
              {about.values.map((value, index) => {
                const Icon = valueIcons[index % valueIcons.length]
                return (
                  <div
                    key={value.title}
                    className="rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:border-[var(--fu-accent-ring)]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-[var(--fu-accent-strong)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold tracking-[-0.015em]">{value.title}</h3>
                    <p className="mt-2 text-sm leading-[1.75] text-[var(--fu-muted)]">{value.description}</p>
                  </div>
                )
              })}

              <div className="rounded-[var(--fu-radius)] bg-[var(--fu-ink)] p-6 text-white">
                <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>Start here</p>
                <p className="mt-3 text-[15px] leading-[1.8] text-white/60">
                  The quickest way to understand the site is to open a gallery and look around.
                </p>
                <Link
                  href={imageRoute}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--fu-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--fu-accent-strong)]"
                >
                  Browse now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
