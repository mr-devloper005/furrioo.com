import Link from 'next/link'
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  MapPin,
  Megaphone,
  SearchX,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { MosaicImageCard, StatTile, getEditableRating } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

/* ------------------------------------------------------------ safe readers */

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getTitle = (post: SitePost, fallback = 'Untitled entry') => post.title?.trim() || fallback
const getSummary = (post: SitePost) =>
  (post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 sm:columns-2 xl:columns-3 [&>*]:mb-5', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', badge: 'Document' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-4', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const totalPages = pagination.totalPages || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task] || taskDeck.article
  const Icon = deck.icon
  const categoryLabel =
    category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  // Chips are built from the categories that actually appear in this page of results.
  const chips = Array.from(
    new Set(posts.map((post) => getCategory(post, '')).filter(Boolean).map((value) => value.toLowerCase()))
  ).slice(0, 10)

  const averageRating = posts.length
    ? (posts.reduce((total, post) => total + getEditableRating(post).rating, 0) / posts.length).toFixed(1)
    : '—'

  return (
    <EditableSiteShell>
      <main className="bg-[var(--fu-page)] text-[var(--fu-text)]">
        {/* ---------------------------------------------------------- hero */}
        <section className="relative overflow-hidden bg-[var(--fu-ink)] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(245,147,49,0.16),transparent_65%)]"
          />
          <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
              <div className="fu-rise min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent-soft)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fu-accent)]">
                  <Icon className="h-3.5 w-3.5" />
                  {voice?.eyebrow || label}
                </span>
                <h1 className="mt-5 max-w-2xl text-[1.9rem] font-bold leading-[1.1] tracking-[-0.025em] sm:text-4xl lg:text-[2.9rem]">
                  {voice?.headline || `Browse ${label}`}
                </h1>
                <p className="mt-4 max-w-xl text-[15px] leading-[1.8] text-white/60">
                  {voice?.description || SITE_CONFIG.description}
                </p>

                <div className="mt-7 grid max-w-md grid-cols-3 gap-3">
                  <StatTile tone="dark" value={String(pagination.total ?? posts.length)} label="Entries" />
                  <StatTile tone="dark" value={averageRating} label="Avg. score" />
                  <StatTile tone="dark" value={String(totalPages)} label="Pages" />
                </div>
              </div>

              {/* filter card */}
              <form
                action={basePath}
                className="fu-rise min-w-0 rounded-[var(--fu-radius-lg)] border border-white/10 bg-white/[0.05] p-5 backdrop-blur sm:p-6"
              >
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  {voice?.filterLabel || 'Filter'}
                </div>
                <select
                  name="category"
                  defaultValue={category}
                  aria-label="Filter by category"
                  className="mt-4 h-12 w-full rounded-full border border-white/12 bg-[var(--fu-ink-deep)] px-5 text-sm font-medium text-white outline-none transition focus:border-[var(--fu-accent-ring)]"
                >
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <button className="h-12 rounded-full bg-[var(--fu-accent)] text-sm font-semibold text-white transition hover:bg-[var(--fu-accent-strong)]">
                    Apply filter
                  </button>
                  <Link
                    href={basePath}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-sm font-semibold text-white/80 transition hover:bg-white/[0.1]"
                  >
                    Reset
                  </Link>
                </div>
                <p className="mt-3 text-xs font-medium text-white/40">Showing: {categoryLabel}</p>
              </form>
            </div>

            {chips.length ? (
              <div className={`${dc.layout.rail} mt-8`}>
                <Link
                  href={basePath}
                  className={`${dc.chip.base} shrink-0 ${category === 'all' ? 'bg-[var(--fu-accent)] text-white' : 'border border-white/12 bg-white/[0.05] text-white/70 hover:bg-white/[0.1]'}`}
                >
                  All
                </Link>
                {chips.map((chip) => {
                  const slug = chip.replace(/\s+/g, '-')
                  const active = category === slug
                  return (
                    <Link
                      key={chip}
                      href={pageHref(basePath, slug, 1)}
                      className={`${dc.chip.base} shrink-0 capitalize ${
                        active ? 'bg-[var(--fu-accent)] text-white' : 'border border-white/12 bg-white/[0.05] text-white/70 hover:bg-white/[0.1]'
                      }`}
                    >
                      {chip}
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </div>
        </section>

        {/* ------------------------------------------------------- results */}
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{deck.badge}</p>
              <h2 className="mt-2 text-xl font-bold tracking-[-0.02em] sm:text-2xl">
                {category === 'all' ? `All ${label.toLowerCase()}` : categoryLabel}
              </h2>
            </div>
            <p className="text-sm font-medium text-[var(--fu-muted)]">
              Page {page} of {totalPages}
            </p>
          </div>

          {posts.length ? (
            <div className={`${deck.archiveClass} mt-7 fu-stagger`}>
              {posts.map((post, index) => (
                <ArchivePostCard key={post.id || post.slug || index} post={post} task={task} basePath={basePath} index={index} />
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-[var(--fu-radius-lg)] border border-dashed border-[var(--fu-line)] bg-white p-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-[var(--fu-accent-strong)]">
                <SearchX className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold tracking-[-0.02em]">Nothing here yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-[1.75] text-[var(--fu-muted)]">
                Try another category, or come back shortly — new entries appear here automatically once published.
              </p>
              <Link href={basePath} className={`${dc.button.primary} mt-6`}>
                Reset filters
              </Link>
            </div>
          )}

          {totalPages > 1 ? (
            <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--fu-line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--fu-text)] transition hover:border-[var(--fu-accent-ring)] hover:text-[var(--fu-accent-strong)]"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Link>
              ) : null}

              <span className="hidden items-center gap-1.5 sm:flex">
                {Array.from({ length: Math.min(5, totalPages) }, (_, offset) => {
                  const start = Math.max(1, Math.min(page - 2, Math.max(1, totalPages - 4)))
                  return start + offset
                })
                  .filter((value) => value <= totalPages)
                  .map((value) => (
                    <Link
                      key={value}
                      href={pageHref(basePath, category, value)}
                      aria-current={value === page ? 'page' : undefined}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                        value === page
                          ? 'bg-[var(--fu-accent)] text-white'
                          : 'border border-[var(--fu-line)] bg-white text-[var(--fu-muted)] hover:text-[var(--fu-accent-strong)]'
                      }`}
                    >
                      {value}
                    </Link>
                  ))}
              </span>

              <span className="rounded-full bg-[var(--fu-ink)] px-5 py-2.5 text-sm font-semibold text-white sm:hidden">
                {page} / {totalPages}
              </span>

              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--fu-line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--fu-text)] transition hover:border-[var(--fu-accent-ring)] hover:text-[var(--fu-accent-strong)]"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

/* -------------------------------------------------------------------------
   Per-task card variants - each task gets its own shape.
   ------------------------------------------------------------------------- */

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = post.slug ? `${basePath}/${post.slug}` : buildPostUrl(task, post.slug || '')
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <MosaicImageCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const summary = getSummary(post)
  const category = getCategory(post, 'Article')

  // Every third card leads with a taller cover so the grid never marches.
  if (index % 3 === 0) {
    return (
      <Link
        href={href}
        className="group overflow-hidden rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--fu-shadow-lg)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={getImage(post)} alt={getTitle(post)} loading="lazy" className={`h-full w-full object-cover ${dc.motion.zoom}`} />
          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fu-text)] backdrop-blur">
            {category}
          </span>
        </div>
        <div className="p-5">
          <h2 className="line-clamp-2 text-[17px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
          {summary ? <p className="mt-2.5 line-clamp-3 text-sm leading-[1.7] text-[var(--fu-muted)]">{summary}</p> : null}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--fu-accent)] transition group-hover:gap-2.5">
            Read more <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="group grid overflow-hidden rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--fu-shadow-lg)] sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)] sm:aspect-auto sm:min-h-[180px]">
        <img src={getImage(post)} alt={getTitle(post)} loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
      </div>
      <div className="min-w-0 p-5">
        <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{category}</p>
        <h2 className="mt-2 line-clamp-2 text-[17px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
        {summary ? <p className="mt-2.5 line-clamp-3 text-sm leading-[1.7] text-[var(--fu-muted)]">{summary}</p> : null}
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  const { rating, reviews } = getEditableRating(post)
  const summary = getSummary(post)
  return (
    <Link
      href={href}
      className="group grid gap-5 rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-5 shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--fu-shadow-lg)] sm:grid-cols-[112px_minmax(0,1fr)]"
    >
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[var(--fu-radius-sm)] bg-[var(--fu-soft)] ring-1 ring-[var(--fu-line)]">
        {logo ? (
          <img src={logo} alt={getTitle(post)} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <BriefcaseBusiness className="h-9 w-9 text-black/25" />
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--fu-accent-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fu-accent-strong)]">
            Directory
          </span>
          {location ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--fu-muted)]">
              <MapPin className="h-3 w-3" /> {location}
            </span>
          ) : null}
        </div>
        <h2 className="mt-3 line-clamp-2 text-[17px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
        <p className="mt-2 text-[13px] font-medium text-[var(--fu-muted)]">
          <span className="text-[var(--fu-star)]">★</span> {rating} · {reviews} reviews
        </p>
        {summary ? <p className="mt-2 line-clamp-2 text-sm leading-[1.7] text-[var(--fu-muted)]">{summary}</p> : null}
        {phone || website ? (
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-[var(--fu-muted)]">
            {phone ? <span>Phone: {phone}</span> : null}
            {website ? <span>Website available</span> : null}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  const summary = getSummary(post)
  return (
    <Link
      href={href}
      className="group grid overflow-hidden rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--fu-shadow-lg)] sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]"
    >
      <div className="relative min-h-[180px] bg-[var(--fu-ink)] p-6 text-white">
        {image ? (
          <img src={image} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        ) : null}
        <div className="relative">
          <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">Classified</span>
          <p className="mt-8 text-2xl font-bold tracking-[-0.02em]">{price || 'Open offer'}</p>
          <p className="mt-2 text-sm text-white/60">{location || condition || 'Details inside'}</p>
        </div>
      </div>
      <div className="min-w-0 p-5 sm:p-6">
        <h2 className="line-clamp-2 text-[17px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
        {summary ? <p className="mt-3 line-clamp-4 text-sm leading-[1.7] text-[var(--fu-muted)]">{summary}</p> : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--fu-accent)] transition group-hover:gap-2.5">
          View offer <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  const summary = getSummary(post)
  return (
    <Link
      href={href}
      className="group block rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:border-[var(--fu-accent-ring)] hover:shadow-[var(--fu-shadow-lg)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--fu-muted)]">
          Save {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-[var(--fu-accent-strong)]">
          <Bookmark className="h-4 w-4" />
        </span>
      </div>
      <h2 className="mt-6 line-clamp-2 text-[17px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
      {summary ? <p className="mt-3 line-clamp-4 text-sm leading-[1.7] text-[var(--fu-muted)]">{summary}</p> : null}
      {website ? (
        <p className="mt-5 flex items-center gap-1.5 truncate text-xs font-semibold text-[var(--fu-accent)]">
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          {website.replace(/^https?:\/\//, '')}
        </p>
      ) : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Document')
  const summary = getSummary(post)
  return (
    <Link
      href={href}
      className="group rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--fu-shadow-lg)]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-[var(--fu-radius-sm)] bg-[var(--fu-ink)] text-white">
          <FileText className="h-6 w-6" />
        </span>
        <span className="rounded-full bg-[var(--fu-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fu-muted)]">
          {category}
        </span>
      </div>
      <h2 className="mt-6 line-clamp-2 text-[17px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
      {summary ? <p className="mt-3 line-clamp-3 text-sm leading-[1.7] text-[var(--fu-muted)]">{summary}</p> : null}
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--fu-accent)] transition group-hover:gap-2.5">
        Open document <Download className="h-4 w-4" />
      </span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const summary = getSummary(post)
  return (
    <Link
      href={href}
      className="group rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 text-center shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--fu-shadow-lg)]"
    >
      <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[var(--fu-soft)] ring-1 ring-[var(--fu-line)] transition duration-300 group-hover:ring-[var(--fu-accent-ring)]">
        {avatar ? (
          <img src={avatar} alt={getTitle(post)} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <UserRound className="h-9 w-9 text-black/25" />
        )}
      </div>
      <h2 className="mt-4 line-clamp-2 text-[16px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
      {role ? <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--fu-accent)]">{role}</p> : null}
      {summary ? <p className="mt-3 line-clamp-3 text-sm leading-[1.7] text-[var(--fu-muted)]">{summary}</p> : null}
    </Link>
  )
}
