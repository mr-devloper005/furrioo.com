import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, Camera, Images, MessageSquare, Share2, Star, ThumbsUp } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

/* -------------------------------------------------------------------------
   Safe post readers - every field can be missing, nothing here may throw.
   ------------------------------------------------------------------------- */

const asRecord = (post?: SitePost | null) =>
  post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

export const FALLBACK_POST_IMAGE = '/placeholder.svg?height=900&width=1400'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = asRecord(post)
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const single = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return mediaUrl || contentImage || single || logo || FALLBACK_POST_IMAGE
}

export function getEditablePostImages(post?: SitePost | null, limit = 12) {
  const content = asRecord(post)
  const media = Array.isArray(post?.media)
    ? post!.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && Boolean(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && Boolean(url))
    : []
  const singles = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter(Boolean)
  return Array.from(new Set([...media, ...images, ...singles])).slice(0, limit)
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = asRecord(post)
  const raw =
    asText(content.description) ||
    asText(content.summary) ||
    asText(content.excerpt) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!clean) return ''
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null, fallback = 'Featured') {
  const content = asRecord(post)
  return asText(content.category) || post?.tags?.[0] || fallback
}

export function getEditableTitle(post?: SitePost | null, fallback = 'Untitled post') {
  return post?.title?.trim() || fallback
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  const slug = post?.slug || ''
  return slug ? `${route}/${slug}` : route
}

/** Deterministic score derived from the title so server and client always agree. */
export function getEditableRating(post?: SitePost | null) {
  const source = `${post?.title || ''}${post?.slug || ''}`
  let hash = 0
  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash + source.charCodeAt(index)) | 0
  }
  const rating = 3.8 + (Math.abs(hash) % 13) / 10
  const reviews = 24 + (Math.abs(hash >> 3) % 290)
  return { rating: Math.round(rating * 10) / 10, reviews }
}

/* -------------------------------------------------------------------------
   Shared micro components
   ------------------------------------------------------------------------- */

export function StarRating({ rating, reviews }: { rating: number; reviews?: number }) {
  const rounded = Math.round(rating)
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => (
          <Star
            key={index}
            className={`h-3.5 w-3.5 ${index < rounded ? 'fill-[var(--fu-star)] text-[var(--fu-star)]' : 'text-black/18'}`}
          />
        ))}
      </span>
      <span className="text-[13px] font-semibold text-[var(--fu-text)]">{rating.toFixed(1)}</span>
      {typeof reviews === 'number' ? <span className="text-[13px] text-[var(--fu-muted)]">({reviews})</span> : null}
    </div>
  )
}

export function CategoryPill({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' | 'accent' }) {
  const tones = {
    light: 'bg-white/92 text-[var(--fu-text)] backdrop-blur',
    dark: 'bg-black/55 text-white backdrop-blur',
    accent: 'bg-[var(--fu-accent)] text-white',
  } as const
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${tones[tone]}`}>
      {children}
    </span>
  )
}

function PostImage({ post, className = '' }: { post: SitePost; className?: string }) {
  return (
    <img
      src={getEditablePostImage(post)}
      alt={getEditableTitle(post, 'Post image')}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
    />
  )
}

/* -------------------------------------------------------------------------
   STYLE 1 - Featured overlay card (large, cinematic)
   ------------------------------------------------------------------------- */

export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  const excerpt = getEditableExcerpt(post, 170)
  return (
    <Link
      href={href}
      className="group relative block min-w-0 overflow-hidden rounded-[var(--fu-radius-lg)] bg-[var(--fu-ink)] shadow-[var(--fu-shadow-lg)]"
    >
      <div className="relative min-h-[380px] sm:min-h-[440px] lg:min-h-[520px]">
        <PostImage post={post} className={`absolute inset-0 opacity-80 ${dc.motion.zoom}`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,20,0.05)_25%,rgba(12,16,20,0.88)_100%)]" />
        <div className="relative flex h-full min-h-[380px] flex-col justify-end p-6 sm:min-h-[440px] sm:p-8 lg:min-h-[520px]">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryPill tone="accent">{label}</CategoryPill>
            <CategoryPill tone="dark">{getEditableCategory(post)}</CategoryPill>
          </div>
          <h3 className="mt-4 max-w-2xl text-2xl font-bold leading-[1.18] tracking-[-0.02em] text-white sm:text-3xl lg:text-[2.4rem]">
            {getEditableTitle(post)}
          </h3>
          {excerpt ? <p className="mt-3 max-w-xl text-sm leading-[1.75] text-white/70">{excerpt}</p> : null}
          <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--fu-accent)] px-5 py-2.5 text-sm font-semibold text-white transition duration-300 group-hover:gap-3">
            View gallery <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   STYLE 2 - Image-first rail card
   ------------------------------------------------------------------------- */

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const excerpt = getEditableExcerpt(post, 88)
  return (
    <Link
      href={href}
      className={`group ${dc.layout.minRailCard} block overflow-hidden rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:border-[var(--fu-accent-ring)] hover:shadow-[var(--fu-shadow-lg)]`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        <PostImage post={post} className={`absolute inset-0 ${dc.motion.zoom}`} />
        <span className="absolute left-3 top-3">
          <CategoryPill>{getEditableCategory(post)}</CategoryPill>
        </span>
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-[10px] font-bold text-white backdrop-blur">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[var(--fu-text)]">
          {getEditableTitle(post)}
        </h3>
        {excerpt ? <p className="mt-2 line-clamp-2 text-[13px] leading-[1.6] text-[var(--fu-muted)]">{excerpt}</p> : null}
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   STYLE 3 - Compact numbered index row
   ------------------------------------------------------------------------- */

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const excerpt = getEditableExcerpt(post, 96)
  return (
    <Link
      href={href}
      className="group flex min-w-0 items-start gap-4 rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--fu-accent-ring)] hover:shadow-[var(--fu-shadow)]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-[13px] font-bold text-[var(--fu-accent-strong)] transition duration-300 group-hover:bg-[var(--fu-accent)] group-hover:text-white">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="min-w-0">
        <span className={`block ${dc.type.eyebrow} text-[var(--fu-accent)]`}>{getEditableCategory(post)}</span>
        <span className="mt-1.5 block line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--fu-text)]">
          {getEditableTitle(post)}
        </span>
        {excerpt ? <span className="mt-1.5 block line-clamp-2 text-[13px] leading-[1.6] text-[var(--fu-muted)]">{excerpt}</span> : null}
      </span>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   STYLE 4 - Horizontal editorial card
   ------------------------------------------------------------------------- */

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const excerpt = getEditableExcerpt(post, 190)
  return (
    <Link
      href={href}
      className="group grid min-w-0 gap-0 overflow-hidden rounded-[var(--fu-radius-lg)] border border-[var(--fu-line)] bg-white shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:border-[var(--fu-accent-ring)] hover:shadow-[var(--fu-shadow-lg)] sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)] sm:aspect-auto sm:min-h-[210px]">
        <PostImage post={post} className={`absolute inset-0 ${dc.motion.zoom}`} />
      </div>
      <div className="min-w-0 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{getEditableCategory(post)}</span>
          <span className="text-[11px] font-semibold text-[var(--fu-muted)]">· No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="mt-2.5 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.015em] text-[var(--fu-text)] sm:text-[1.4rem]">
          {getEditableTitle(post)}
        </h2>
        {excerpt ? <p className="mt-3 line-clamp-3 text-sm leading-[1.75] text-[var(--fu-muted)]">{excerpt}</p> : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--fu-accent)] transition group-hover:gap-2.5">
          Read more <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   STYLE 5 - Directory review card (header · media · body · action bar)
   ------------------------------------------------------------------------- */

export function DirectoryReviewCard({ post, href }: { post: SitePost; href: string }) {
  const { rating, reviews } = getEditableRating(post)
  const excerpt = getEditableExcerpt(post, 150)
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--fu-shadow-lg)]">
      <div className="flex items-center gap-3 border-b border-[var(--fu-line)] px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-[var(--fu-accent-strong)]">
          <Camera className="h-4 w-4" />
        </span>
        <span className="truncate text-sm font-medium text-[var(--fu-muted)]">{getEditableCategory(post, 'Directory')}</span>
      </div>

      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        <PostImage post={post} className={`absolute inset-0 ${dc.motion.zoom}`} />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[17px] font-bold leading-snug tracking-[-0.015em] text-[var(--fu-text)]">
          <Link href={href} className="transition hover:text-[var(--fu-accent-strong)]">
            {getEditableTitle(post)}
          </Link>
        </h3>
        <div className="mt-3">
          <StarRating rating={rating} reviews={reviews} />
        </div>
        {excerpt ? <p className="mt-3 line-clamp-2 text-sm leading-[1.7] text-[var(--fu-muted)]">{excerpt}</p> : null}
        <Link href={href} className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--fu-accent)] transition hover:gap-2.5">
          Read more
        </Link>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--fu-line)] px-5 py-3.5 text-[13px] font-medium text-[var(--fu-muted)]">
        <span className="inline-flex items-center gap-1.5 transition hover:text-[var(--fu-accent-strong)]">
          <ThumbsUp className="h-4 w-4" /> Helpful
        </span>
        <span className="inline-flex items-center gap-1.5 transition hover:text-[var(--fu-accent-strong)]">
          <MessageSquare className="h-4 w-4" /> Comment
        </span>
        <span className="inline-flex items-center gap-1.5 transition hover:text-[var(--fu-accent-strong)]">
          <Share2 className="h-4 w-4" /> Share
        </span>
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------
   STYLE 6 - Mosaic / masonry tile (image-first, overlay caption)
   ------------------------------------------------------------------------- */

export function MosaicImageCard({ post, href, index = 0 }: { post: SitePost; href: string; index?: number }) {
  const shapes = ['aspect-[4/5]', 'aspect-[4/3]', 'aspect-[1/1]', 'aspect-[3/4]', 'aspect-[16/11]', 'aspect-[5/6]']
  const shape = shapes[index % shapes.length]
  const count = getEditablePostImages(post).length
  return (
    <Link
      href={href}
      className="group block break-inside-avoid overflow-hidden rounded-[var(--fu-radius)] bg-[var(--slot4-media-bg)] shadow-[var(--fu-shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--fu-shadow-lg)]"
    >
      <div className={`relative w-full ${shape}`}>
        <PostImage post={post} className={`absolute inset-0 ${dc.motion.zoom}`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,20,0.35)_0%,rgba(12,16,20,0)_38%,rgba(12,16,20,0.85)_100%)]" />
        <span className="absolute left-3 top-3">
          <CategoryPill>{getEditableCategory(post, 'Gallery')}</CategoryPill>
        </span>
        {count > 1 ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
            <Images className="h-3 w-3" /> {count}
          </span>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="line-clamp-3 text-[15px] font-semibold leading-snug text-white drop-shadow-sm">
            {getEditableTitle(post)}
          </h3>
        </div>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   STYLE 7 - Mini sidebar row (thumbnail + two lines)
   ------------------------------------------------------------------------- */

export function MiniListRow({ post, href }: { post: SitePost; href: string }) {
  const excerpt = getEditableExcerpt(post, 74)
  return (
    <Link
      href={href}
      className="group flex min-w-0 gap-3 rounded-[var(--fu-radius-sm)] p-2 transition duration-300 hover:bg-[var(--fu-soft)]"
    >
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[0.6rem] bg-[var(--slot4-media-bg)]">
        <PostImage post={post} className={`absolute inset-0 ${dc.motion.zoom}`} />
      </span>
      <span className="min-w-0">
        <span className="block line-clamp-2 text-[13px] font-semibold leading-snug text-[var(--fu-text)] transition group-hover:text-[var(--fu-accent-strong)]">
          {getEditableTitle(post)}
        </span>
        {excerpt ? <span className="mt-1 block line-clamp-2 text-[12px] leading-[1.5] text-[var(--fu-muted)]">{excerpt}</span> : null}
      </span>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   Small stat tile used by the hero and detail sidebars
   ------------------------------------------------------------------------- */

export function StatTile({ value, label, tone = 'light' }: { value: string; label: string; tone?: 'light' | 'dark' }) {
  const isDark = tone === 'dark'
  return (
    <div
      className={`rounded-[var(--fu-radius-sm)] px-4 py-3.5 transition duration-300 hover:-translate-y-0.5 ${
        isDark ? 'border border-white/12 bg-white/[0.05]' : 'bg-white shadow-[var(--fu-shadow)]'
      }`}
    >
      <p className={`text-xl font-bold tracking-[-0.02em] ${isDark ? 'text-white' : 'text-[var(--fu-text)]'}`}>{value}</p>
      <p className={`mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${isDark ? 'text-white/45' : 'text-[var(--fu-muted)]'}`}>
        {label}
      </p>
    </div>
  )
}

export const editableCardStyles = {
  feature: EditorialFeatureCard,
  rail: RailPostCard,
  compact: CompactIndexCard,
  horizontal: ArticleListCard,
  review: DirectoryReviewCard,
  mosaic: MosaicImageCard,
  mini: MiniListRow,
} as const

export { pal as editableCardPalette }
