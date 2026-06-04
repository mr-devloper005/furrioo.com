import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Lock, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[linear-gradient(180deg,#fffaf3_0%,#f4efe6_100%)] text-black">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-[2.4rem] border border-black/[0.08] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[var(--slot4-accent)]">{pagesContent.auth.login.badge}</p>
              <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl">
                {pagesContent.auth.login.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-black/64">{pagesContent.auth.login.description}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Fast access', Lock],
                  ['Keep browsing', Sparkles],
                  ['Manage content', ArrowRight],
                ].map(([label, Icon]) => (
                  <div key={label as string} className="rounded-[1.4rem] border border-black/[0.08] bg-[#f7f8fc] p-4">
                    <Icon className="h-4 w-4 text-black/70" />
                    <p className="mt-3 text-sm font-black text-black">{label as string}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black text-white">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-5 py-3 text-sm font-black text-black/78">
                  Back home
                </Link>
              </div>
            </article>

            <div className="rounded-[2.4rem] border border-black/[0.08] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-8 lg:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-black/45">Member access</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.06em]">{pagesContent.auth.login.formTitle}</h2>
              <p className="mt-2 text-sm leading-7 text-black/60">Sign in to continue browsing and managing submissions.</p>
              <div className="mt-6">
                <EditableLocalLoginForm />
              </div>
              <p className="mt-5 text-sm leading-7 text-black/60">
                New here?{' '}
                <Link href="/signup" className="font-black text-black underline-offset-4 hover:underline">
                  {pagesContent.auth.login.createCta}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
