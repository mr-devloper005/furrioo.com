import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, ChevronRight, Filter, Search, Star } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function categoryLabel(post: SitePost) {
  const content = post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post.tags?.[0] || 'Featured'
}

function safeTitle(post?: SitePost | null, fallback = 'Untitled post') {
  return post?.title || fallback
}

function TinyPreview({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block w-[160px] shrink-0 snap-start sm:w-[180px]">
      <article className="overflow-hidden rounded-[1.4rem] border border-black/[0.08] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.14)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={getEditablePostImage(post)} alt={safeTitle(post)} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.72)_100%)]" />
          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black/80">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="absolute bottom-3 left-3 right-3 line-clamp-3 text-base font-black leading-tight tracking-[-0.04em] text-white">
            {safeTitle(post)}
          </h3>
        </div>
      </article>
    </Link>
  )
}

function FeaturedCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`group relative overflow-hidden rounded-[2rem] ${pal.darkBg} text-white shadow-[0_24px_70px_rgba(15,23,42,0.28)]`}>
      <img src={getEditablePostImage(post)} alt={safeTitle(post)} className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.82))]" />
      <div className="relative flex min-h-[360px] flex-col justify-end p-6 sm:min-h-[440px] sm:p-8">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/70">{categoryLabel(post)}</p>
        <h3 className="mt-4 max-w-2xl text-3xl font-black leading-[0.96] tracking-[-0.08em] sm:text-4xl">{safeTitle(post)}</h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/72">{getExcerpt(post, 160)}</p>
        <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black transition group-hover:translate-x-0.5">
          Open story <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function CompactRowCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex gap-4 rounded-[1.5rem] border border-black/[0.08] bg-white p-3 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.12)]">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.1rem] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={safeTitle(post)} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0 py-1 pr-1">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-black/45">No. {String(index + 1).padStart(2, '0')}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight tracking-[-0.04em]">{safeTitle(post)}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/58">{getExcerpt(post, 110)}</p>
      </div>
    </Link>
  )
}

function HorizontalFeature({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[1.7rem] border border-black/[0.08] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.14)] md:grid-cols-[0.95fr_1.05fr]">
      <div className="relative min-h-[180px] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={safeTitle(post)} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="flex min-w-0 flex-col justify-between p-5 sm:p-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Featured {String(index + 1).padStart(2, '0')}</p>
          <h3 className="mt-3 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.05em]">{safeTitle(post)}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-black/58">{getExcerpt(post, 140)}</p>
        </div>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-black/80">
          Open <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

function EditorialListItem({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group flex items-start gap-4 rounded-[1.5rem] border border-black/[0.08] bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(15,23,42,0.12)]">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent)] text-sm font-black text-white shadow-[0_10px_24px_rgba(61,71,255,0.2)]">
        <Star className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-black/45">{categoryLabel(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.05em]">{safeTitle(post)}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/58">{getExcerpt(post, 125)}</p>
      </div>
    </Link>
  )
}

function Rail({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${dc.layout.rail} ${className}`}>{children}</div>
}

function SectionHeader({ eyebrow, title, description, actionHref, actionLabel }: { eyebrow: string; title: string; description?: string; actionHref?: string; actionLabel?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-black/60 sm:text-base">{description}</p> : null}
      </div>
      {actionHref ? (
        <Link href={actionHref} className="hidden items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-black text-black/78 shadow-sm sm:inline-flex">
          {actionLabel || 'View all'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts.slice(0, 5)
  const heroTitle = pagesContent.home.hero.title.join(' ')
  return (
    <section className="relative overflow-hidden border-b border-black/[0.06] bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fc_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[4%] top-[15%] hidden h-28 w-28 rounded-[2rem] border border-black/[0.06] bg-white/85 shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:block">
          {featured[0] ? <img src={getEditablePostImage(featured[0])} alt="" className="h-full w-full rounded-[2rem] object-cover" /> : null}
        </div>
        <div className="absolute left-[1%] top-[48%] hidden h-36 w-36 rounded-[1.8rem] border border-black/[0.06] bg-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:block">
          {featured[1] ? <img src={getEditablePostImage(featured[1])} alt="" className="h-full w-full rounded-[1.8rem] object-cover" /> : null}
        </div>
        <div className="absolute right-[4%] top-[12%] hidden h-44 w-40 rounded-[2rem] border border-black/[0.06] bg-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:block">
          {featured[2] ? <img src={getEditablePostImage(featured[2])} alt="" className="h-full w-full rounded-[2rem] object-cover" /> : null}
        </div>
        <div className="absolute right-[2%] top-[48%] hidden h-34 w-34 rounded-[1.8rem] border border-black/[0.06] bg-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:block">
          {featured[3] ? <img src={getEditablePostImage(featured[3])} alt="" className="h-full w-full rounded-[1.8rem] object-cover" /> : null}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[var(--slot4-accent)]">{pagesContent.home.hero.badge}</p>
          <h1 className="mt-5 text-[clamp(3.2rem,8vw,6.6rem)] font-black leading-[0.92] tracking-[-0.1em] text-black">
            {heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-black/64 sm:text-lg">
            {pagesContent.home.hero.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-black text-white shadow-[0_18px_38px_rgba(61,71,255,0.28)] transition duration-200 hover:-translate-y-0.5">
              Browse {taskLabel(primaryTask).toLowerCase()}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-6 py-3 text-sm font-black text-black/80 shadow-sm transition duration-200 hover:-translate-y-0.5">
              Start free trial
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-4 rounded-[2rem] border border-black/[0.08] bg-white/90 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <form action="/search" className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white px-5 py-3 text-sm font-black">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <label className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-[#f7f8fc] px-4 py-3">
              <Search className="h-4 w-4 shrink-0 opacity-50" />
              <input name="q" type="search" placeholder={pagesContent.home.hero.searchPlaceholder} className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-black/40" />
            </label>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            {['Projects', 'People', 'Assets', 'Images'].map((item, index) => (
              <button key={item} type="button" className={`rounded-full px-4 py-2.5 text-sm font-black ${index === 0 ? 'bg-white shadow-sm' : 'text-black/58'} border border-black/[0.06]`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        {featured[4] ? (
          <div className="mx-auto mt-10 max-w-6xl">
            <FeaturedCard post={featured[4]} href={postHref(primaryTask, featured[4], primaryRoute)} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 12)
  if (!railPosts.length) return null
  return (
    <section className="border-b border-black/[0.06] bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <Rail>
          {railPosts.map((post, index) => <TinyPreview key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
        </Rail>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts.slice(0, 8)
  if (!featured.length) return null
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeader
          eyebrow="Discover more"
          title={`A varied feed for ${taskLabel(primaryTask).toLowerCase()}`}
          description="The grid intentionally changes card shapes so the page feels curated, not repetitive."
          actionHref={primaryRoute}
          actionLabel="Browse section"
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5">
            {featured.slice(0, 3).map((post, index) => (
              <HorizontalFeature key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
          <div className="grid gap-4">
            {featured.slice(3, 7).map((post) => (
              <EditorialListItem key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const timePosts = timeSections.flatMap((section) => section.posts)
  const collection = timePosts.length ? timePosts : posts.slice(8)
  const lead = collection[0] || posts[0]
  const rest = collection.slice(1, 7)
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-black/[0.08] bg-[linear-gradient(180deg,#111111_0%,#1b1d24_100%)] p-7 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:p-9">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/55">Spotlight</p>
            <h2 className="mt-4 text-3xl font-black leading-[0.96] tracking-[-0.08em] sm:text-4xl">
              Make the important work easy to reach.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
              Search, browse, and jump into the most recent posts without losing the clean rhythm of the page.
            </p>
            <form action="/search" className="mt-7 flex rounded-full border border-white/10 bg-white/8 p-2 backdrop-blur">
              <input name="q" placeholder="Search posts" className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold text-white outline-none placeholder:text-white/40" />
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black">
                <Search className="h-4 w-4" />
                Search
              </button>
            </form>
            <div className="mt-7 flex flex-wrap gap-2">
              {['For you', 'Following', 'Best of Furrioo', 'Photography', 'Illustration', 'UI/UX'].map((chip, index) => (
                <span key={chip} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${index === 0 ? 'bg-white text-black' : 'border border-white/10 text-white/76'}`}>
                  {chip}
                </span>
              ))}
            </div>
            {lead ? (
              <Link href={postHref(primaryTask, lead, primaryRoute)} className="mt-8 block overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/20">
                <div className="relative aspect-[16/10]">
                  <img src={getEditablePostImage(lead)} alt={safeTitle(lead)} className="absolute inset-0 h-full w-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.72))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/68">{categoryLabel(lead)}</p>
                    <h3 className="mt-2 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.06em]">{safeTitle(lead)}</h3>
                  </div>
                </div>
              </Link>
            ) : null}
          </div>

          <div className="grid gap-4">
            {rest.map((post, index) => (
              <CompactRowCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="border-t border-black/[0.06] bg-[#111111] text-white">
      <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 rounded-[2.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(61,71,255,0.18),rgba(255,255,255,0.04))] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.28)] lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/55">Keep exploring</p>
            <h2 className="mt-4 text-3xl font-black leading-[0.96] tracking-[-0.08em] sm:text-4xl">
              Creative browsing, simplified.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              Move through images, profiles, articles, and supporting resources with a layout that keeps the focus on the work.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:-translate-y-0.5">
              Contact us
            </Link>
            <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/5">
              Browse posts
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
