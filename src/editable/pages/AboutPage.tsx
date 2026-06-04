import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fc_100%)] text-black">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[2.6rem] border border-black/[0.08] bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10 lg:p-12">
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[var(--slot4-accent)]">{pagesContent.about.badge}</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl">
                About {SITE_CONFIG.name}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-black/64">{pagesContent.about.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/image" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black text-white">
                  Explore images
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/profile" className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#f7f8fc] px-5 py-3 text-sm font-black text-black/78">
                  View profiles
                </Link>
              </div>
              <div className="mt-10 grid gap-4 text-sm leading-7 text-black/64">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>

            <div className="grid gap-4">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className={`rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ${index === 0 ? 'lg:mt-0' : ''}`}>
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                    <Sparkles className="h-4 w-4" />
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h2 className="mt-4 text-2xl font-black tracking-[-0.05em]">{value.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-black/64">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
