import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, Compass, Layers, Search, Sparkles, TrendingUp } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { homeContent } from '@/editable/content/pages.content'
import {
  ArticleListCard,
  CompactIndexCard,
  DirectoryReviewCard,
  EditorialFeatureCard,
  MiniListRow,
  MosaicImageCard,
  RailPostCard,
  StatTile,
  getEditableCategory,
  getEditableExcerpt,
  getEditablePostImage,
  getEditableRating,
  getEditableTitle,
  postHref,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

/* ---------------------------------------------------------------- helpers */

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

/** Builds the topic chip list from whatever categories the live feed contains. */
function deriveTopics(posts: SitePost[], limit = 8) {
  const counts = new Map<string, number>()
  for (const post of posts) {
    const raw = getEditableCategory(post, '')
    const label = raw ? raw.replace(/[-_]+/g, ' ').trim() : ''
    if (!label) continue
    const key = label.toLowerCase()
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

/** Headline numbers computed from the live feed instead of hard-coded claims. */
function deriveStats(posts: SitePost[]) {
  if (!posts.length) return []
  const ratings = posts.map((post) => getEditableRating(post).rating)
  const average = ratings.reduce((total, value) => total + value, 0) / ratings.length
  const topics = deriveTopics(posts, 50).length
  const size = posts.length >= 20 ? `${Math.floor(posts.length / 10) * 10}+` : String(posts.length)
  return [
    { value: size, label: 'Collections' },
    { value: average.toFixed(1), label: 'Avg. rating' },
    { value: topics ? String(topics) : 'Daily', label: topics ? 'Topics' : 'Updated' },
  ]
}

function SectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  align = 'left',
}: {
  eyebrow: string
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
  align?: 'left' | 'center'
}) {
  const centered = align === 'center'
  return (
    <div className={`flex flex-wrap items-end gap-4 ${centered ? 'flex-col items-center text-center' : 'justify-between'}`}>
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{eyebrow}</p>
        <h2 className={`mt-2.5 ${dc.type.sectionTitle} text-[var(--fu-text)]`}>{title}</h2>
        {description ? <p className="mt-3 text-[15px] leading-[1.75] text-[var(--fu-muted)]">{description}</p> : null}
      </div>
      {actionHref && !centered ? (
        <Link
          href={actionHref}
          className="hidden items-center gap-2 rounded-full border border-[var(--fu-line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--fu-text)] transition duration-300 hover:border-[var(--fu-accent-ring)] hover:text-[var(--fu-accent-strong)] sm:inline-flex"
        >
          {actionLabel || 'View all'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}

function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

/* ------------------------------------------------------------------ HERO */

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const hero = homeContent.hero
  const collage = posts.slice(0, 5)
  const stats = deriveStats(posts)
  const [lead, ...rest] = collage

  return (
    <section className="relative overflow-hidden bg-[var(--fu-ink)] text-[var(--fu-ink-text)]">
      {/* soft amber wash so the dark block never reads as flat black */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(245,147,49,0.18),transparent_65%)]"
      />
      <Shell className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          <div className="fu-rise min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent-soft)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fu-accent)]">
              <Sparkles className="h-3.5 w-3.5" />
              {hero.badge}
            </span>

            <h1 className="mt-6 max-w-xl text-[2.2rem] font-bold leading-[1.08] tracking-[-0.025em] text-white sm:text-5xl lg:text-[3.5rem]">
              {hero.title.map((line, index) => (
                <span key={line} className="block">
                  {index === hero.title.length - 1 ? <span className="text-[var(--fu-accent)]">{line}</span> : line}
                </span>
              ))}
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-[1.85] text-white/60 sm:text-base">{hero.description}</p>

            <form
              action="/search"
              className="mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] transition focus-within:shadow-[0_16px_46px_rgba(245,147,49,0.24)]"
            >
              <Search className="h-4 w-4 shrink-0 text-black/35" />
              <input
                name="q"
                type="search"
                placeholder={hero.searchPlaceholder}
                aria-label="Search the directory"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm font-medium text-[var(--fu-text)] outline-none placeholder:text-black/35"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-[var(--fu-accent)] px-6 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--fu-accent-strong)]"
              >
                Search
              </button>
            </form>

            {stats.length ? (
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <StatTile key={stat.label} value={stat.value} label={stat.label} />
                ))}
              </div>
            ) : (
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={primaryRoute} className={dc.button.primary}>
                  {hero.primaryCta.label}
                </Link>
                <Link href={hero.secondaryCta.href} className={dc.button.ghostDark}>
                  {hero.secondaryCta.label}
                </Link>
              </div>
            )}
          </div>

          {/* collage: one wide lead tile + a two-up row underneath */}
          <div className="fu-rise min-w-0">
            {lead ? (
              <div className="grid gap-4">
                <Link
                  href={postHref(primaryTask, lead, primaryRoute)}
                  className="group relative block overflow-hidden rounded-[var(--fu-radius-lg)] bg-black/25 ring-1 ring-white/10"
                >
                  <div className="relative aspect-[16/9]">
                    <img
                      src={getEditablePostImage(lead)}
                      alt={getEditableTitle(lead, 'Featured')}
                      className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(12,16,20,0.8)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--fu-accent)]">
                        {getEditableCategory(lead, taskLabel(primaryTask))}
                      </p>
                      <h2 className="mt-1.5 line-clamp-2 text-lg font-semibold leading-snug text-white sm:text-xl">
                        {getEditableTitle(lead)}
                      </h2>
                    </div>
                  </div>
                </Link>

                {rest.length ? (
                  <div className="grid grid-cols-2 gap-4">
                    {rest.slice(0, 2).map((post) => (
                      <Link
                        key={post.id || post.slug}
                        href={postHref(primaryTask, post, primaryRoute)}
                        className="group relative block overflow-hidden rounded-[var(--fu-radius)] bg-black/25 ring-1 ring-white/10"
                      >
                        <div className="relative aspect-[4/3]">
                          <img
                            src={getEditablePostImage(post)}
                            alt={getEditableTitle(post, 'Featured')}
                            className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(12,16,20,0.82)_100%)]" />
                          <p className="absolute inset-x-0 bottom-0 line-clamp-2 p-3.5 text-[13px] font-semibold leading-snug text-white">
                            {getEditableTitle(post)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-[var(--fu-radius-lg)] border border-white/10 bg-white/[0.04] p-10 text-center">
                <Layers className="mx-auto h-8 w-8 text-white/30" />
                <p className="mt-4 text-sm font-semibold text-white/70">{hero.featureCardTitle}</p>
                <p className="mt-2 text-sm leading-7 text-white/45">{hero.featureCardDescription}</p>
              </div>
            )}
          </div>
        </div>
      </Shell>
    </section>
  )
}

/* ------------------------------------------------------------- STORY RAIL */

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(3, 15)
  if (!railPosts.length) return null

  return (
    <section className="border-b border-[var(--fu-line)] bg-[var(--fu-page-2)]">
      <Shell className="py-10 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-[var(--fu-accent-strong)]">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div>
              <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{homeContent.rail.eyebrow}</p>
              <h2 className="text-lg font-bold tracking-[-0.015em] text-[var(--fu-text)] sm:text-xl">{homeContent.rail.title}</h2>
            </div>
          </div>
          <Link
            href={primaryRoute}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--fu-muted)] transition hover:text-[var(--fu-accent-strong)]"
          >
            See everything <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className={`${dc.layout.rail} mt-6 fu-stagger`}>
          {railPosts.map((post, index) => (
            <RailPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </Shell>
    </section>
  )
}

/* ---------------------------------------------------------- MAIN FEED GRID */

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feed = posts.slice(0, 9)
  if (!feed.length) return null
  const topics = deriveTopics(posts, 7)

  return (
    <section className="bg-[var(--fu-page)]">
      <Shell className="py-12 sm:py-14 lg:py-16">
        <SectionHeading
          align="center"
          eyebrow={homeContent.feed.eyebrow}
          title={homeContent.feed.title}
          description={homeContent.feed.description}
        />

        {topics.length ? (
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Link href={primaryRoute} className={`${dc.chip.base} ${dc.chip.active}`}>
              All
            </Link>
            {topics.map((topic) => (
              <Link
                key={topic.label}
                href={`${primaryRoute}?category=${encodeURIComponent(topic.label.replace(/\s+/g, '-'))}`}
                className={`${dc.chip.base} ${dc.chip.quiet} capitalize`}
              >
                {topic.label}
                <span className="text-[10px] opacity-60">{topic.count}</span>
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-9 grid gap-5 fu-stagger md:grid-cols-2 xl:grid-cols-3">
          {feed.map((post) => (
            <DirectoryReviewCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href={primaryRoute} className={dc.button.primary}>
            {homeContent.feed.actionLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Shell>
    </section>
  )
}

/* ------------------------------------------------- MIXED COLLECTION BLOCKS */

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const timePosts = timeSections.flatMap((section) => section.posts)
  const pool = timePosts.length ? timePosts : posts
  if (!pool.length) return null

  const feature = pool[0]
  const horizontal = pool.slice(1, 3)
  const compact = pool.slice(3, 7)
  const mosaic = pool.slice(7, 13)
  const sidebar = pool.slice(1, 5)
  const spotlight = timeSections[0]

  return (
    <>
      {/* editorial split: one hero card + supporting rows */}
      <section className="border-y border-[var(--fu-line)] bg-white">
        <Shell className="py-12 sm:py-14 lg:py-16">
          <SectionHeading
            eyebrow={spotlight?.eyebrow || homeContent.spotlight.eyebrow}
            title={spotlight?.title || homeContent.spotlight.title}
            description={spotlight?.description || homeContent.spotlight.description}
            actionHref={spotlight?.href || primaryRoute}
            actionLabel="Open section"
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <EditorialFeatureCard
              post={feature}
              href={postHref(primaryTask, feature, primaryRoute)}
              label={homeContent.spotlight.featureLabel}
            />

            <div className="grid min-w-0 content-start gap-4">
              {horizontal.map((post, index) => (
                <ArticleListCard
                  key={post.id || post.slug}
                  post={post}
                  href={postHref(primaryTask, post, primaryRoute)}
                  index={index}
                />
              ))}
              {compact.slice(0, 2).map((post, index) => (
                <CompactIndexCard
                  key={post.id || post.slug}
                  post={post}
                  href={postHref(primaryTask, post, primaryRoute)}
                  index={index + horizontal.length}
                />
              ))}
            </div>
          </div>
        </Shell>
      </section>

      {/* discovery mosaic + a quiet dark aside */}
      {mosaic.length ? (
        <section className="bg-[var(--fu-page)]">
          <Shell className="py-12 sm:py-14 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0">
                <SectionHeading
                  eyebrow={homeContent.mosaic.eyebrow}
                  title={homeContent.mosaic.title}
                  description={homeContent.mosaic.description}
                />
                <div className="mt-7 columns-1 gap-5 sm:columns-2 xl:columns-3 [&>*]:mb-5">
                  {mosaic.map((post, index) => (
                    <MosaicImageCard
                      key={post.id || post.slug}
                      post={post}
                      href={postHref(primaryTask, post, primaryRoute)}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-[var(--fu-radius-lg)] bg-[var(--fu-ink)] p-6 text-white">
                  <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{homeContent.aside.eyebrow}</p>
                  <h3 className="mt-3 text-xl font-bold leading-snug tracking-[-0.015em]">{homeContent.aside.title}</h3>
                  <p className="mt-3 text-sm leading-[1.75] text-white/55">{homeContent.aside.description}</p>
                  <Link
                    href={primaryRoute}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--fu-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--fu-accent-strong)]"
                  >
                    <Compass className="h-4 w-4" />
                    Browse {taskLabel(primaryTask).toLowerCase()}
                  </Link>
                </div>

                {sidebar.length ? (
                  <div className="mt-5 rounded-[var(--fu-radius-lg)] border border-[var(--fu-line)] bg-white p-4">
                    <p className={`${dc.type.eyebrow} px-2 text-[var(--fu-muted)]`}>{homeContent.aside.listTitle}</p>
                    <div className="mt-3 grid gap-1">
                      {sidebar.map((post) => (
                        <MiniListRow key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </aside>
            </div>
          </Shell>
        </section>
      ) : null}
    </>
  )
}

/* -------------------------------------------------------------------- CTA */

export function EditableHomeCta() {
  const cta = homeContent.cta
  return (
    <section id="get-app" className="bg-[var(--fu-ink)] text-white">
      <Shell className="py-14 sm:py-16">
        <div className="grid gap-8 rounded-[var(--fu-radius-lg)] border border-white/10 bg-[linear-gradient(120deg,rgba(245,147,49,0.16),rgba(255,255,255,0.03))] p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-11">
          <div className="max-w-2xl">
            <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{cta.badge}</p>
            <h2 className="mt-3 text-2xl font-bold leading-[1.15] tracking-[-0.02em] sm:text-[2.1rem]">{cta.title}</h2>
            <p className="mt-4 text-[15px] leading-[1.8] text-white/60">{cta.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={cta.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent)] px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--fu-accent-strong)]"
            >
              {cta.primaryCta.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={cta.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.1]"
            >
              {cta.secondaryCta.label}
            </Link>
          </div>
        </div>
      </Shell>
    </section>
  )
}

export { getEditableExcerpt }
