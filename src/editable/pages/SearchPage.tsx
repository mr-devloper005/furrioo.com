import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Search, SearchX, SlidersHorizontal, Sparkles, Tag } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

/* ------------------------------------------------------------ safe readers */

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) =>
  typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images)
    ? (content.images.find((item) => typeof item === 'string') as string | undefined)
    : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}

const titleOf = (post: SitePost) => post.title?.trim() || 'Untitled entry'

const summaryOf = (post: SitePost) =>
  stripHtml(post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || '')
    .replace(/\s+/g, ' ')
    .trim()

const categoryOf = (post: SitePost) => compactRaw(getContent(post).category) || post.tags?.[0] || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [
    post.title,
    post.summary,
    content.description,
    content.body,
    content.excerpt,
    content.category,
    Array.isArray(post.tags) ? post.tags.join(' ') : '',
  ].some((value) => compactText(value).includes(query))
}

/* ----------------------------------------------------------------- cards */

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug || '') : `/article/${post.slug || ''}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const label = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const category = categoryOf(post)

  // No image: a quieter, text-forward tile so the masonry keeps its rhythm.
  if (!image) {
    return (
      <Link
        href={href}
        className="group block break-inside-avoid overflow-hidden rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-5 shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:border-[var(--fu-accent-ring)] hover:shadow-[var(--fu-shadow-lg)]"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--fu-accent-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fu-accent-strong)]">
          <Tag className="h-3 w-3" /> {category || label}
        </span>
        <h2 className="mt-4 line-clamp-3 text-[17px] font-bold leading-snug tracking-[-0.015em]">{titleOf(post)}</h2>
        {summary ? <p className="mt-3 line-clamp-4 text-sm leading-[1.7] text-[var(--fu-muted)]">{summary}</p> : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--fu-accent)] transition group-hover:gap-2.5">
          Open result <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    )
  }

  // Every fifth result gets a taller cover so the grid does not march.
  const tall = index % 5 === 0

  return (
    <Link
      href={href}
      className="group block break-inside-avoid overflow-hidden rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--fu-shadow-lg)]"
    >
      <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${tall ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
        <img
          src={image}
          alt={titleOf(post)}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-[700ms] ease-out group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fu-text)] backdrop-blur">
          {category || label}
        </span>
      </div>
      <div className="p-5">
        <h2 className="line-clamp-3 text-[16px] font-bold leading-snug tracking-[-0.015em]">{titleOf(post)}</h2>
        {summary ? <p className="mt-2.5 line-clamp-3 text-sm leading-[1.7] text-[var(--fu-muted)]">{summary}</p> : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--fu-accent)] transition group-hover:gap-2.5">
          Open result <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ page */

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)
  const primaryRoute = enabledTasks[0]?.route || '/image'

  // Topic suggestions built from whatever is actually in the result set.
  const suggestions = Array.from(
    new Set(results.map((post) => categoryOf(post).toLowerCase()).filter(Boolean))
  ).slice(0, 8)

  return (
    <EditableSiteShell>
      <main className="bg-[var(--fu-page)] text-[var(--fu-text)]">
        {/* --------------------------------------------------- search hero */}
        <section className="relative overflow-hidden bg-[var(--fu-ink)] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-32 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(245,147,49,0.18),transparent_65%)]"
          />
          <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="max-w-2xl fu-rise">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent-soft)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fu-accent)]">
                <Sparkles className="h-3.5 w-3.5" />
                {pagesContent.search.hero.badge}
              </span>
              <h1 className="mt-5 text-[1.9rem] font-bold leading-[1.1] tracking-[-0.025em] sm:text-4xl lg:text-[2.9rem]">
                {pagesContent.search.hero.title}
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-[1.8] text-white/60">{pagesContent.search.hero.description}</p>
            </div>

            <form
              action="/search"
              className="mt-8 max-w-3xl rounded-[var(--fu-radius-lg)] border border-white/10 bg-white/[0.05] p-4 backdrop-blur sm:p-5 fu-rise"
            >
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full bg-white px-5 py-3">
                <Search className="h-4 w-4 shrink-0 text-black/35" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  aria-label="Search"
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--fu-text)] outline-none placeholder:text-black/35"
                />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-full border border-white/12 bg-[var(--fu-ink-deep)] px-5 py-3">
                  <SlidersHorizontal className="h-4 w-4 shrink-0 text-white/35" />
                  <input
                    name="category"
                    defaultValue={category}
                    placeholder="Category"
                    aria-label="Category"
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/35"
                  />
                </label>
                <select
                  name="task"
                  defaultValue={task}
                  aria-label="Content type"
                  className="rounded-full border border-white/12 bg-[var(--fu-ink-deep)] px-5 py-3 text-sm font-medium text-white outline-none"
                >
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--fu-accent)] px-6 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--fu-accent-strong)]"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </form>

            {suggestions.length ? (
              <div className={`${dc.layout.rail} mt-6`}>
                {suggestions.map((topic) => (
                  <Link
                    key={topic}
                    href={`/search?category=${encodeURIComponent(topic)}`}
                    className={`${dc.chip.base} shrink-0 capitalize ${dc.chip.dark} hover:bg-white/[0.12] hover:text-white`}
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* ------------------------------------------------------- results */}
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>
                {results.length} result{results.length === 1 ? '' : 's'}
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-[-0.02em] sm:text-2xl">
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link
              href={primaryRoute}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--fu-line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--fu-text)] transition hover:border-[var(--fu-accent-ring)] hover:text-[var(--fu-accent-strong)]"
            >
              Browse latest <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-8 columns-1 gap-5 sm:columns-2 xl:columns-3 [&>*]:mb-5 fu-stagger">
              {results.map((post, index) => (
                <SearchResultCard key={post.id || post.slug || index} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[var(--fu-radius-lg)] border border-dashed border-[var(--fu-line)] bg-white p-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-[var(--fu-accent-strong)]">
                <SearchX className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold tracking-[-0.02em]">No matches found</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-[1.75] text-[var(--fu-muted)]">
                Try a shorter keyword, a different category, or clear the content type filter.
              </p>
              <Link href="/search" className={`${dc.button.primary} mt-6`}>
                Clear search
              </Link>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
