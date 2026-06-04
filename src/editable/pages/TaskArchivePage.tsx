import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
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

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Editorial cards balance large covers, headlines, and soft summaries.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Directory cards highlight identity, location, contact, and service cues.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offer cards stay fast to scan with a stronger call-to-action rhythm.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Gallery cards push imagery first with compact captions underneath.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Bookmark cards stay text-forward and quick to browse.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards keep download intent and file context clear.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards focus on identity, role, and a fast first impression.', badge: 'Profile' },
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
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = {
    '--archive-bg': preset.colors.background,
    '--archive-text': task === 'image' ? '#111111' : preset.colors.foreground,
    '--archive-surface': preset.colors.surface,
    '--archive-accent': preset.colors.accent,
  } as CSSProperties
  const heroCompact = task === 'image'
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const featured = posts.slice(0, 5)

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="border-b border-black/[0.06] bg-[linear-gradient(180deg,#ffffff_0%,#f6f7fb_100%)]">
          <div className={`mx-auto max-w-[var(--editable-container)] px-4 ${heroCompact ? 'py-6 sm:px-6 lg:px-8 lg:py-8' : 'py-10 sm:px-6 lg:px-8 lg:py-14'}`}>
            <div className={`grid ${heroCompact ? 'gap-4 lg:grid-cols-[1.05fr_0.95fr]' : 'gap-6 lg:grid-cols-[1.1fr_0.9fr]'}`}>
              <div className={`rounded-[2.4rem] border border-black/[0.08] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] ${heroCompact ? 'p-5 sm:p-6 lg:p-7' : 'p-7 sm:p-10'}`}>
                <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
                <h1 className={`mt-5 max-w-4xl font-black leading-[0.94] tracking-[-0.08em] ${heroCompact ? 'text-3xl sm:text-4xl' : 'text-5xl sm:text-6xl'}`}>
                  {voice?.headline || `Browse ${label}`}
                </h1>
                <p className={`mt-4 max-w-2xl leading-7 text-black/64 ${heroCompact ? 'text-sm sm:text-base' : 'text-base'}`}>
                  {voice?.description || SITE_CONFIG.description}
                </p>
                <div className={`mt-5 rounded-[1.6rem] border border-black/[0.08] bg-[#f7f8fc] ${heroCompact ? 'p-3 text-xs sm:text-sm' : 'p-4 text-sm'} leading-7 text-black/68`}>
                  {deck.promise}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={basePath} className="inline-flex items-center gap-2 rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-white shadow-[0_18px_38px_rgba(15,23,42,0.14)]">
                    Browse all
                  </Link>
                  <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-5 py-3 text-sm font-black text-black/78">
                    Search posts
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                {voice?.chips?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {voice.chips.map((chip) => (
                      <span key={chip} className="rounded-full border border-black/[0.08] bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-black/62">
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className={`grid gap-4 rounded-[2.4rem] border border-black/[0.08] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] ${heroCompact ? 'p-4 sm:p-5' : 'p-5'}`}>
                <form action={basePath} className="rounded-[1.5rem] border border-black/[0.08] bg-[#f7f8fc] p-4">
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-black/50">
                    <Filter className="h-4 w-4" />
                    Filter
                  </div>
                  <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-full border border-black/[0.08] bg-white px-4 text-sm font-bold outline-none">
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <button className="mt-3 h-12 w-full rounded-full bg-[var(--archive-text)] text-sm font-black text-white">Apply filter</button>
                  <p className="mt-3 text-xs font-bold text-black/45">Showing: {categoryLabel}</p>
                </form>

                <div className={`grid gap-3 ${heroCompact ? 'md:grid-cols-2 lg:grid-cols-1' : ''}`}>
                  {featured.map((post, index) => (
                    <div key={post.id || post.slug} className="overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-[#f7f8fc]">
                      <div className="relative aspect-[16/9]">
                        <img src={getImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.65))]" />
                        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                          Pick {index + 1}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]">{getCategory(post, label)}</p>
                        <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight tracking-[-0.04em]">{post.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`mt-8 flex flex-wrap items-center gap-2 overflow-hidden rounded-[1.6rem] border border-black/[0.08] bg-white p-2 shadow-[0_14px_44px_rgba(15,23,42,0.07)] ${heroCompact ? 'hidden lg:flex' : ''}`}>
              {['For you', 'Following', 'Best of Furrioo', 'Graphic Design', 'Photography', 'Illustration', '3D Art', 'UI/UX', 'Motion', 'Architecture', 'Product Design', 'Fashion'].map((chip, index) => (
                <span key={chip} className={`rounded-full px-4 py-2 text-sm font-black ${index === 0 ? 'bg-black text-white' : 'bg-[#f7f8fc] text-black/72'}`}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-black/[0.12] bg-white p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.06em]">No posts found</h2>
              <p className="mt-2 text-sm leading-7 text-black/60">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-black/[0.08] bg-white px-5 py-3 text-sm font-black text-black/80">Previous</Link> : null}
            <span className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-black/[0.08] bg-white px-5 py-3 text-sm font-black text-black/80">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = post.slug ? `${basePath}/${post.slug}` : buildPostUrl(task, post.slug || '')
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  if (index % 3 === 0) {
    return (
      <Link href={href} className="group overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_14px_44px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.14)]">
        <div className="relative aspect-[4/3] bg-black/5">
          <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black">{category}</span>
        </div>
        <div className="p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--archive-accent)]">Story {String(index + 1).padStart(2, '0')}</p>
          <h2 className="mt-2 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-black/60">{getSummary(post)}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_14px_44px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.14)] md:grid-cols-[0.95fr_1.05fr]">
      <div className="relative min-h-[200px] bg-black/5">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--archive-accent)]">Read {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-black/60">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-black/[0.08] bg-white p-5 shadow-[0_14px_44px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.14)] sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#f7f8fc] ring-1 ring-black/[0.08]">
        {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-black/60">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold text-black/60 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_14px_44px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.14)]">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-black p-5 text-white">
          <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold text-white/72">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt={post.title} className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-90 ring-1 ring-white/10" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-black/60">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">
            View listing <ArrowRight className="h-4 w-4" />
          </p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_14px_44px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.14)]">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#f7f8fc] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black/75">
          <ImageIcon className="h-3 w-3" /> Visual
        </div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-black/[0.08] bg-white p-6 shadow-[0_14px_44px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:bg-black hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-current/70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] text-current/55">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-black/[0.08] bg-white p-6 shadow-[0_14px_44px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.14)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-black p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[#f7f8fc] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-black/60">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">
        Open document <Download className="h-4 w-4" />
      </p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-black/[0.08] bg-white p-6 text-center shadow-[0_14px_44px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.14)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#f7f8fc] ring-1 ring-black/[0.08]">
        {avatar ? <img src={avatar} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-black/60">{getSummary(post)}</p>
    </Link>
  )
}
