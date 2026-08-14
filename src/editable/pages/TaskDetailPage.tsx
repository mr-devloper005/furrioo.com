import Link from 'next/link'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Building2,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Images,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Tag,
  ThumbsUp,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ------------------------------------------------------------ safe readers */

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return Array.from(new Set([...media, ...images, ...singleImages])).slice(0, 12)
}

const titleOf = (post?: SitePost | null, fallback = 'Untitled entry') => post?.title?.trim() || fallback

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || ''
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi,
    (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`
  )

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(
    /(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi,
    (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`
  )

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) =>
  (post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

/* ---------------------------------------------------------------- wrapper */

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--fu-page)] text-[var(--fu-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ------------------------------------------------------------ shared parts */

function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fu-muted)] transition hover:gap-3 hover:text-[var(--fu-accent-strong)]"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

/** Wide cinematic banner used at the top of every detail page. */
function DetailBanner({ post, task, ratio = 'aspect-[21/9]' }: { post: SitePost; task: TaskKey; ratio?: string }) {
  const image = getImages(post)[0]
  return (
    <div className="relative overflow-hidden rounded-[var(--fu-radius-lg)] bg-[var(--fu-ink)] shadow-[var(--fu-shadow-lg)]">
      <div className={`relative w-full ${ratio} min-h-[240px]`}>
        {image ? (
          <img src={image} alt={titleOf(post)} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--fu-ink-soft)]">
            <Layers className="h-10 w-10 text-white/25" />
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,20,0.28)_0%,rgba(12,16,20,0.1)_40%,rgba(12,16,20,0.88)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <span className="inline-flex items-center rounded-full bg-white/92 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fu-text)] backdrop-blur">
            {categoryOf(post, getTaskConfig(task)?.label || 'Entry')}
          </span>
          <h1 className="mt-3 max-w-3xl text-2xl font-bold leading-[1.14] tracking-[-0.022em] text-white sm:text-3xl lg:text-[2.5rem]">
            {titleOf(post)}
          </h1>
        </div>
      </div>
    </div>
  )
}

function SidebarCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-5 shadow-[var(--fu-shadow)]">
      <p className={`${dc.type.eyebrow} text-[var(--fu-muted)]`}>{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function ShareRow() {
  return (
    <div className="flex items-center gap-4 text-[13px] font-medium text-[var(--fu-muted)]">
      <span className="inline-flex items-center gap-1.5 transition hover:text-[var(--fu-accent-strong)]">
        <ThumbsUp className="h-4 w-4" /> Helpful
      </span>
      <span className="inline-flex items-center gap-1.5 transition hover:text-[var(--fu-accent-strong)]">
        <Share2 className="h-4 w-4" /> Share
      </span>
    </div>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  const html = formatPlainText(getBody(post))
  if (!html) {
    return (
      <p className="mt-6 text-[15px] leading-[1.85] text-[var(--fu-muted)]">
        {summaryText(post) || 'Full details for this entry will appear here once they are published.'}
      </p>
    )
  }
  return (
    <div
      className={`article-content mt-6 max-w-none ${compact ? 'text-[14px] leading-[1.8]' : 'text-[15px] leading-[1.9]'}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-7 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[var(--fu-radius-sm)] border border-[var(--fu-line)] bg-[var(--fu-soft)] p-4">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fu-muted)]">
            <Icon className="h-3.5 w-3.5" /> {label}
          </div>
          <p className="mt-1.5 break-words text-sm font-medium leading-6 text-[var(--fu-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, columns = 4 }: { images: string[]; label: string; columns?: number }) {
  if (!images.length) return null
  const gridClass = columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
  return (
    <section className="mt-9">
      <p className={`${dc.type.eyebrow} text-[var(--fu-muted)]`}>{label}</p>
      <div className={`mt-4 grid gap-3 ${gridClass}`}>
        {images.slice(0, columns === 2 ? 4 : 8).map((image, index) => (
          <span
            key={`${image}-${index}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-[var(--fu-radius-sm)] bg-[var(--slot4-media-bg)] ring-1 ring-[var(--fu-line)]"
          >
            <img
              src={image}
              alt={`${label} ${index + 1}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-[700ms] ease-out group-hover:scale-105"
            />
          </span>
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white shadow-[var(--fu-shadow)]">
      <div className="flex items-center gap-2 px-5 py-4 text-sm font-semibold">
        <MapPin className="h-4 w-4 text-[var(--fu-accent)]" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-5 text-left shadow-[var(--fu-shadow)]">
      <p className={`${dc.type.eyebrow} text-[var(--fu-muted)]`}>Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--fu-accent-strong)]"
          >
            Website <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--fu-line)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--fu-accent-ring)]"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
        ) : null}
        {email ? (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--fu-line)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--fu-accent-ring)]"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
        ) : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[var(--fu-radius-sm)] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, related, title }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean; title?: string }) {
  const taskConfig = getTaskConfig(task)
  if (!related.length) return null
  return (
    <div id="related" className="rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-5 shadow-[var(--fu-shadow)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold tracking-[-0.015em]">{title || pagesContent.detailPages.image.relatedTitle}</h2>
        <Link
          href={taskConfig?.route || '/'}
          className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fu-accent)] transition hover:text-[var(--fu-accent-strong)]"
        >
          View all
        </Link>
      </div>
      <div className="mt-4 grid gap-1">
        {related.map((item) => (
          <RelatedCard key={item.id || item.slug} task={task} post={item} />
        ))}
      </div>
    </div>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const summary = summaryText(post)
  return (
    <Link
      href={buildPostUrl(task, post.slug || '')}
      className="group flex gap-3 rounded-[var(--fu-radius-sm)] p-2 transition duration-300 hover:bg-[var(--fu-soft)]"
    >
      {image && task !== 'sbm' ? (
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[0.6rem] bg-[var(--slot4-media-bg)]">
          <img
            src={image}
            alt={titleOf(post)}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-[700ms] group-hover:scale-105"
          />
        </span>
      ) : (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[0.6rem] bg-[var(--fu-soft)]">
          <FileText className="h-5 w-5 text-black/25" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block line-clamp-2 text-[13px] font-semibold leading-snug transition group-hover:text-[var(--fu-accent-strong)]">
          {titleOf(post)}
        </span>
        {summary ? <span className="mt-1 block line-clamp-2 text-[12px] leading-[1.5] text-[var(--fu-muted)]">{summary}</span> : null}
      </span>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   IMAGE detail - the flagship layout for this site
   ------------------------------------------------------------------------- */

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const taskConfig = getTaskConfig('image')
  const gallery = images.slice(1)
  const category = categoryOf(post, 'Gallery')

  return (
    <>
      <Shell className="pt-7">
        <BackLink task="image" />
      </Shell>

      <Shell className="pt-5">
        <DetailBanner post={post} task="image" />
      </Shell>

      <Shell className="grid gap-7 pb-16 pt-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <article className="rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] sm:p-8">
            <BodyContent post={post} />
            <div className="mt-7 border-t border-[var(--fu-line)] pt-5">
              <ShareRow />
            </div>
          </article>

          {gallery.length ? (
            <div className="mt-6 rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] sm:p-8">
              <ImageStrip images={gallery} label="More from this gallery" />
            </div>
          ) : null}
        </div>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-5 text-center shadow-[var(--fu-shadow)]">
            <p className={`${dc.type.eyebrow} text-[var(--fu-muted)]`}>Images in this set</p>
            <p className="mt-2 text-3xl font-bold tracking-[-0.03em] text-[var(--fu-text)]">{images.length || 1}</p>
          </div>

          <SidebarCard title="About this post">
            <div className="grid gap-3 text-sm">
              <span className="flex items-center gap-2.5 text-[var(--fu-muted)]">
                <Tag className="h-4 w-4 text-[var(--fu-accent)]" />
                <span className="truncate capitalize text-[var(--fu-text)]">{category}</span>
              </span>
              <span className="flex items-center gap-2.5 text-[var(--fu-muted)]">
                <Images className="h-4 w-4 text-[var(--fu-accent)]" />
                <span className="truncate text-[var(--fu-text)]">{taskConfig?.label || 'Gallery'}</span>
              </span>
              <span className="flex items-center gap-2.5 text-[var(--fu-muted)]">
                <Globe2 className="h-4 w-4 text-[var(--fu-accent)]" />
                <span className="truncate text-[var(--fu-text)]">{SITE_CONFIG.name}</span>
              </span>
            </div>
          </SidebarCard>

          <RelatedPanel task="image" post={post} related={related} />

          <Link
            href={taskConfig?.route || '/'}
            className="flex items-center justify-center gap-2 rounded-[var(--fu-radius)] bg-[var(--fu-ink)] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[var(--fu-ink-soft)]"
          >
            Browse the full gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </Shell>
    </>
  )
}

/* -------------------------------------------------------------------------
   Other task layouts
   ------------------------------------------------------------------------- */

function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <Shell className="pt-7">
        <BackLink task="article" />
      </Shell>
      <Shell className="pt-5">
        <DetailBanner post={post} task="article" ratio="aspect-[21/9]" />
      </Shell>
      <Shell className="grid gap-7 pb-16 pt-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <article className="min-w-0 rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] sm:p-8 lg:p-10">
          {summaryText(post) ? (
            <p className="border-l-2 border-[var(--fu-accent)] pl-4 text-[17px] font-medium leading-[1.8] text-[var(--fu-text)]">
              {summaryText(post)}
            </p>
          ) : null}
          <BodyContent post={post} />
          {images.length > 1 ? <ImageStrip images={images.slice(1)} label="Gallery" columns={2} /> : null}
          <div className="mt-7 border-t border-[var(--fu-line)] pt-5">
            <ShareRow />
          </div>
          <EditableComments slug={post.slug} comments={comments} />
        </article>
        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
          <RelatedPanel task="article" post={post} related={related} title={pagesContent.detailPages.article.relatedTitle} />
        </aside>
      </Shell>
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <>
      <Shell className="pt-7">
        <BackLink task="listing" />
      </Shell>
      <Shell className="pt-5">
        <DetailBanner post={post} task="listing" />
      </Shell>
      <Shell className="grid gap-7 pb-16 pt-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        <article className="min-w-0 rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-5">
            <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[var(--fu-radius-sm)] bg-[var(--fu-soft)] ring-1 ring-[var(--fu-line)]">
              {logo ? (
                <img src={logo} alt={titleOf(post)} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-9 w-9 text-black/25" />
              )}
            </span>
            <div className="min-w-0">
              <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>Business listing</p>
              <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em] sm:text-2xl">{titleOf(post)}</h2>
              {summaryText(post) ? <p className="mt-2 text-sm leading-[1.75] text-[var(--fu-muted)]">{summaryText(post)}</p> : null}
            </div>
          </div>
          <InfoGrid
            items={[
              ['Location', address, MapPin],
              ['Phone', phone, Phone],
              ['Email', email, Mail],
              ['Website', website, Globe2],
            ]}
          />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
          <ContactAction website={website} phone={phone} email={email} />
          {mapSrc ? <MapBox src={mapSrc} label={address || titleOf(post)} /> : null}
          <RelatedPanel task="listing" post={post} related={related} title={pagesContent.detailPages.listing.relatedTitle} />
        </aside>
      </Shell>
    </>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <Shell className="pt-7">
        <BackLink task="classified" />
      </Shell>
      <Shell className="grid gap-7 pb-16 pt-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-8">
        <aside className="min-w-0 rounded-[var(--fu-radius)] bg-[var(--fu-ink)] p-6 text-white shadow-[var(--fu-shadow-lg)] lg:sticky lg:top-24 lg:self-start">
          <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>Classified notice</p>
          <h1 className="mt-3 text-2xl font-bold leading-snug tracking-[-0.02em]">{titleOf(post)}</h1>
          <div className="mt-6 grid gap-2.5">
            {price ? <BadgeLine label="Price" value={price} /> : null}
            {condition ? <BadgeLine label="Condition" value={condition} /> : null}
            {location ? <BadgeLine label="Location" value={location} /> : null}
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {phone ? (
              <a href={`tel:${phone}`} className="rounded-full bg-[var(--fu-accent)] px-5 py-2.5 text-sm font-semibold text-white">
                Call now
              </a>
            ) : null}
            {email ? (
              <a href={`mailto:${email}`} className="rounded-full border border-white/14 px-5 py-2.5 text-sm font-semibold text-white">
                Email
              </a>
            ) : null}
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/14 px-5 py-2.5 text-sm font-semibold text-white"
              >
                View site
              </a>
            ) : null}
          </div>
        </aside>
        <div className="min-w-0">
          <article className="rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] sm:p-8">
            {images.length ? <ImageStrip images={images} label="Offer images" columns={2} /> : null}
            <BodyContent post={post} />
          </article>
          <div className="mt-5">
            <RelatedPanel task="classified" post={post} related={related} />
          </div>
        </div>
      </Shell>
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <Shell className="pt-7">
        <BackLink task="sbm" />
      </Shell>
      <Shell className="grid gap-7 pb-16 pt-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <article className="min-w-0 rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] sm:p-9">
          <span className="flex h-14 w-14 items-center justify-center rounded-[var(--fu-radius-sm)] bg-[var(--fu-accent-soft)] text-[var(--fu-accent-strong)]">
            <Bookmark className="h-6 w-6" />
          </span>
          <h1 className="mt-6 text-2xl font-bold leading-snug tracking-[-0.02em] sm:text-3xl">{titleOf(post)}</h1>
          {summaryText(post) ? <p className="mt-4 text-[15px] leading-[1.85] text-[var(--fu-muted)]">{summaryText(post)}</p> : null}
          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--fu-accent-strong)]"
            >
              <ExternalLink className="h-4 w-4" /> Open saved resource
            </a>
          ) : null}
          <BodyContent post={post} />
        </article>
        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
          <RelatedPanel task="sbm" post={post} related={related} />
        </aside>
      </Shell>
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <>
      <Shell className="pt-7">
        <BackLink task="pdf" />
      </Shell>
      <Shell className="grid gap-7 pb-16 pt-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <article className="min-w-0 rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] sm:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <span className="flex h-20 w-20 items-center justify-center rounded-[var(--fu-radius-sm)] bg-[var(--fu-ink)] text-white">
              <FileText className="h-8 w-8" />
            </span>
            <div className="min-w-0">
              <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>Document</p>
              <h1 className="mt-1.5 text-2xl font-bold leading-snug tracking-[-0.02em]">{titleOf(post)}</h1>
            </div>
          </div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-8 overflow-hidden rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-[var(--fu-soft)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--fu-line)] bg-white p-4">
                <span className="text-sm font-semibold">Document preview</span>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--fu-accent-strong)]"
                >
                  Download <Download className="h-3.5 w-3.5" />
                </a>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={titleOf(post)} className="h-[70vh] w-full" />
            </div>
          ) : null}
        </article>
        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
          <RelatedPanel task="pdf" post={post} related={related} />
        </aside>
      </Shell>
    </>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <Shell className="pt-7">
        <BackLink task="profile" />
      </Shell>
      <Shell className="grid gap-7 pb-16 pt-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-8">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-7 text-center shadow-[var(--fu-shadow)]">
            <span className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[var(--fu-soft)] ring-1 ring-[var(--fu-line)]">
              {images[0] ? (
                <img src={images[0]} alt={titleOf(post)} className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-12 w-12 text-black/25" />
              )}
            </span>
            <h1 className="mt-5 text-xl font-bold leading-snug tracking-[-0.02em]">{titleOf(post)}</h1>
            {role ? <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--fu-accent)]">{role}</p> : null}
          </div>
          <ContactAction website={website} email={email} />
        </aside>
        <div className="min-w-0">
          <article className="rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] sm:p-8">
            {summaryText(post) ? <p className="text-[15px] leading-[1.85] text-[var(--fu-muted)]">{summaryText(post)}</p> : null}
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Profile gallery" />
          </article>
          <div className="mt-5">
            <RelatedPanel task="profile" post={post} related={related} title={pagesContent.detailPages.profile.relatedTitle} />
          </div>
        </div>
      </Shell>
    </>
  )
}

/* ---------------------------------------------------------------- comments */

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-[var(--fu-soft)] p-5 sm:p-6">
      <div className="flex items-center gap-2 text-base font-bold tracking-[-0.015em]">
        <MessageCircle className="h-5 w-5 text-[var(--fu-accent)]" />
        Comments
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-[var(--fu-muted)]">{comments.length}</span>
      </div>

      <div className="mt-5 rounded-[var(--fu-radius-sm)] border border-[var(--fu-line)] bg-white p-5">
        <p className="text-base font-bold tracking-[-0.015em]">Join the conversation</p>
        <p className="mt-1.5 max-w-xl text-sm leading-[1.75] text-[var(--fu-muted)]">
          Sign in to leave feedback on this entry, or create an account in a few seconds.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link
            href="/login"
            className="rounded-full bg-[var(--fu-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--fu-accent-strong)]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-[var(--fu-line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--fu-text)] transition hover:border-[var(--fu-accent-ring)]"
          >
            Create account
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[var(--fu-radius-sm)] border border-[var(--fu-line)] bg-white p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-xs font-bold uppercase text-[var(--fu-accent-strong)]">
                {(comment.name || '?').slice(0, 1)}
              </span>
              <p className="text-sm font-semibold">{comment.name}</p>
            </div>
            <p className="mt-2.5 text-sm leading-[1.7] text-[var(--fu-muted)]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? (
          <p className="text-sm text-[var(--fu-muted)]">No comments yet on {slug || 'this entry'}. Be the first to add one.</p>
        ) : null}
      </div>
    </section>
  )
}
