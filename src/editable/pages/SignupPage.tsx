import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[linear-gradient(180deg,#1c110f_0%,#2d1a18_100%)] text-[#fff4e8] bg-color-white">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
            <div className="order-2 rounded-[2.4rem] border border-white/10 bg-white/8 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur sm:p-8 lg:order-1 lg:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/50">Site access</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.06em] text-[#fff5ea]">{pagesContent.auth.signup.formTitle}</h2>
              <p className="mt-2 text-sm leading-7 text-white/65">Create an account to unlock publishing tools and saved access.</p>
              <div className="mt-6">
                <EditableLocalSignupForm />
              </div>
              <p className="mt-5 text-sm leading-7 text-white/65">
                Already have an account?{' '}
                <Link href="/login" className="font-black text-white underline-offset-4 hover:underline">
                  {pagesContent.auth.signup.loginCta}
                </Link>
              </p>
            </div>

            <article className="order-1 rounded-[2.4rem] border border-white/10 bg-[rgba(255,255,255,0.05)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:p-8 lg:order-2 lg:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#f4c9b4]">{pagesContent.auth.signup.badge}</p>
              <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl">
                {pagesContent.auth.signup.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/72">{pagesContent.auth.signup.description}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ['Start fast', Sparkles],
                  ['Publish safely', BadgeCheck],
                  ['Sign in later', ArrowRight],
                ].map(([label, Icon]) => (
                  <div key={label as string} className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4">
                    <Icon className="h-4 w-4 text-white/80" />
                    <p className="mt-3 text-sm font-black text-white">{label as string}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#2d1a18]">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm font-black text-white/90">
                  Back home
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
