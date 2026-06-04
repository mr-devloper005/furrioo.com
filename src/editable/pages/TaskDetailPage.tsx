import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

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

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
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
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = {
    '--detail-bg': preset.colors.background,
    '--detail-text': preset.colors.foreground,
    '--detail-surface': preset.colors.surface,
    '--detail-accent': preset.colors.accent,
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
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

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-black text-black/80 shadow-sm">
      <ArrowLeft className="h-4 w-4" />
      Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function HeroFrame({ post, task, children }: { post: SitePost; task: TaskKey; children?: ReactNode }) {
  const images = getImages(post)
  const heroImage = images[0]
  const secondary = images[1]
  return (
    <section className="w-full px-0 py-0">
      <div className="overflow-hidden border border-white/10 bg-[#111111] text-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[420px] p-6 sm:p-8 lg:min-h-[560px] lg:p-10">
            {heroImage ? <img src={heroImage} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-75" /> : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.8))]" />
            <div className="relative flex h-full min-h-[360px] flex-col justify-between">
              <BackLink task={task} />
              <div className="max-w-3xl">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/70">{categoryOf(post, 'Overview')}</p>
                <h1 className="mt-4 text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-6xl lg:text-7xl">{post.title}</h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">{summaryText(post) || 'A closer look at this post.'}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#details" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black">
                    View details
                  </a>
                  <a href="#related" className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm font-black text-white/90">
                    Related work
                  </a>
                </div>
              </div>
              {secondary ? (
                <div className="hidden max-w-[220px] overflow-hidden rounded-[1.6rem] border border-white/12 bg-white/10 backdrop-blur lg:block">
                  <img src={secondary} alt="" className="aspect-[4/3] w-full object-cover" />
                </div>
              ) : null}
            </div>
          </div>
          <div className="grid bg-[#f5f6fa] p-5 text-black lg:p-6">
            <div className="rounded-[1.8rem] border border-black/10 bg-white p-5 shadow-sm">
              {children || (
                <>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/45">Image overview</p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-black">{post.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-black/68">{summaryText(post) || 'A concise image summary will appear here using the post data.'}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <HeroFrame post={post} task="article">
        <div className="rounded-[1.7rem] border border-black/10 bg-white p-5 shadow-sm text-black">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/45">Editor notes</p>
          <p className="mt-3 text-sm leading-7 text-black/68">A feature-style reading view with room for body copy, supporting images, and conversation.</p>
        </div>
      </HeroFrame>
      <section id="details" className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <article className="min-w-0 rounded-[2.4rem] border border-black/10 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.10)] sm:p-8 lg:p-10">
          <BodyContent post={post} />
          {images.length ? <ImageStrip images={images.slice(0, 6)} label="Gallery" large /> : null}
          <EditableComments slug={post.slug} comments={comments} />
        </article>
        <RelatedPanel task="article" post={post} related={related} />
      </section>
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
      <HeroFrame post={post} task="listing">
        <div className="space-y-4 rounded-[1.7rem] border border-black/10 bg-white p-5 text-black shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/45">Contact</p>
          <div className="flex flex-wrap gap-2">
            {phone ? <a href={`tel:${phone}`} className="rounded-full bg-black px-4 py-2 text-sm font-black text-white">Call</a> : null}
            {email ? <a href={`mailto:${email}`} className="rounded-full border border-black/10 px-4 py-2 text-sm font-black">Email</a> : null}
            {website ? <a href={website} target="_blank" rel="noreferrer" className="rounded-full border border-black/10 px-4 py-2 text-sm font-black">Website</a> : null}
          </div>
          {address ? <p className="text-sm leading-7 text-black/62">{address}</p> : null}
        </div>
      </HeroFrame>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
        <article className="rounded-[2.4rem] border border-black/10 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.10)] sm:p-8 lg:p-10">
          <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[2rem] bg-[#f5f6fa] ring-1 ring-black/10">
              {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14 opacity-40" />}
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">Business listing</p>
              <h1 className="mt-3 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-black/68">{summaryText(post)}</p>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : <ContactAction website={website} phone={phone} email={email} />}
          {mapSrc ? <ContactAction website={website} phone={phone} email={email} /> : null}
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </section>
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
      <HeroFrame post={post} task="classified">
        <div className="space-y-4 rounded-[1.7rem] border border-black/10 bg-white p-5 text-black shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/45">Offer summary</p>
          <div className="grid gap-2 text-sm font-semibold text-black/70">
            {price ? <p>Price: {price}</p> : null}
            {condition ? <p>Condition: {condition}</p> : null}
            {location ? <p>Location: {location}</p> : null}
          </div>
        </div>
      </HeroFrame>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-7 px-4 pb-16 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <aside className="rounded-[2.5rem] border border-black/10 bg-black p-7 text-white shadow-[0_20px_70px_rgba(15,23,42,0.14)] lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] opacity-60">Classified notice</p>
          <h2 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-5xl">{post.title}</h2>
          <div className="mt-8 grid gap-3">
            {price ? <BadgeLine label="Price" value={price} /> : null}
            {condition ? <BadgeLine label="Condition" value={condition} /> : null}
            {location ? <BadgeLine label="Location" value={location} /> : null}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {phone ? <a href={`tel:${phone}`} className="rounded-full bg-white px-5 py-3 text-sm font-black text-black">Call now</a> : null}
            {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white">Email</a> : null}
            {website ? <a href={website} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white">View site</a> : null}
          </div>
        </aside>
        <article className="rounded-[2.7rem] border border-black/10 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.10)] sm:p-8 lg:p-10">
          {images.length ? <ImageStrip images={images} label="Offer images" large /> : null}
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="classified" post={post} related={related} />
        </article>
      </section>
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <>
      <HeroFrame post={post} task="image">
      </HeroFrame>
      <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[2.5rem] border border-black/10 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.10)] lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
              <Camera className="h-4 w-4 " />
              Image story
            </div>
            <h2 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-5xl text-black">{post.title}</h2>
            <p className="mt-5 text-base leading-8 text-black/68">{summaryText(post)}</p>
            <BodyContent post={post} compact />
          </aside>
          <div className="columns-1 gap-5 space-y-5 md:columns-2">
            {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
              <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_14px_44px_rgba(15,23,42,0.08)]">
                <img src={image} alt={post.title} className="w-full object-cover" />
                {index === 0 ? <figcaption className="p-5 text-sm font-bold text-black/64">Featured visual from this image post.</figcaption> : null}
              </figure>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <RelatedPanel task="image" post={post} related={related} />
        </div>
      </section>
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <HeroFrame post={post} task="sbm">
        <div className="space-y-4 rounded-[1.7rem] border border-black/10 bg-white p-5 text-black shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/45">Saved resource</p>
          <p className="text-sm leading-7 text-black/68">A compact text-led view that keeps the saved link and summary easy to review.</p>
        </div>
      </HeroFrame>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <article className="rounded-[2.7rem] border border-black/10 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.10)] sm:p-10">
          <div className="mt-2 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-black text-white"><Bookmark className="h-9 w-9" /></div>
          <h2 className="mt-7 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h2>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-black/70">{summaryText(post)}</p>
          {website ? <a href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black text-white"><ExternalLink className="h-4 w-4" /> Open saved resource</a> : null}
          <BodyContent post={post} />
        </article>
        <RelatedPanel task="sbm" post={post} related={related} />
      </section>
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <>
      <HeroFrame post={post} task="pdf">
        <div className="space-y-4 rounded-[1.7rem] border border-black/10 bg-white p-5 text-black shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/45">Document preview</p>
          <p className="text-sm leading-7 text-black/68">The page treats files like a library item, with the preview below and the metadata above.</p>
        </div>
      </HeroFrame>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <article className="rounded-[2.7rem] border border-black/10 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.10)] sm:p-9">
          <div className="grid gap-6 sm:grid-cols-[120px_1fr]">
            <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-black text-white"><FileText className="h-12 w-12" /></div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--detail-accent)]">PDF resource</p>
              <h2 className="mt-3 text-4xl font-black leading-[0.98] tracking-[-0.07em] sm:text-6xl">{post.title}</h2>
            </div>
          </div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/10 bg-[#f7f8fc]">
              <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-white p-4">
                <span className="text-sm font-black">Document preview</span>
                <a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-black text-white">
                  Download <Download className="h-4 w-4" />
                </a>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
            </div>
          ) : null}
        </article>
        <RelatedPanel task="pdf" post={post} related={related} />
      </section>
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
      <HeroFrame post={post} task="profile">
        <div className="space-y-4 rounded-[1.7rem] border border-black/10 bg-white p-5 text-black shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/45">Profile summary</p>
          <p className="text-sm leading-7 text-black/68">Identity-first profile layout with the portrait up front and supporting details alongside.</p>
        </div>
      </HeroFrame>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-[2.7rem] border border-black/10 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.10)] lg:sticky lg:top-24 lg:self-start">
          <div className="mx-auto mt-2 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[#f7f8fc] ring-1 ring-black/10">
            {images[0] ? <img src={images[0]} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
          </div>
          <h2 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.07em]">{post.title}</h2>
          {role ? <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--detail-accent)]">{role}</p> : null}
          <ContactAction website={website} email={email} />
        </aside>
        <article className="rounded-[2.7rem] border border-black/10 bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.10)] sm:p-10">
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Profile gallery" />
          <RelatedPanel task="profile" post={post} related={related} />
        </article>
      </section>
    </>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} text-black/80`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-black/10 bg-[#f7f8fc] p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-black/48"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-black/74">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--detail-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt={label} className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-black/10" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_14px_44px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-2 p-4 text-sm font-black"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[2rem] border border-black/10 bg-white p-5 text-left shadow-[0_14px_44px_rgba(15,23,42,0.08)]">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-black/45">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <a href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-black text-white">Website <ExternalLink className="h-4 w-4" /></a> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-black"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] opacity-60">{label}</span><span className="font-black">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside id="related" className="min-w-0 space-y-5">
      {related.length ? (
        <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_14px_44px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-black/45">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug || '')} className="group flex gap-3 rounded-2xl border border-black/10 bg-[#f7f8fc] p-3 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)]">
      {image && task !== 'sbm' ? <img src={image} alt={post.title} className="h-20 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white"><FileText className="h-6 w-6 opacity-45" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-black/60">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-black/10 bg-[#f7f8fc] p-5">
      <div className="flex items-center gap-2 text-lg font-black"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        <div className="rounded-[1.5rem] border border-black/10 bg-white p-5">
          <p className="text-2xl font-black tracking-[-0.04em]">Sign in to join the conversation</p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-black/62">Add your feedback for this post by signing in or creating an account.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-black px-5 py-3 text-sm font-black text-white">Sign in</Link>
            <Link href="/signup" className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black text-black/78">Start free trial</Link>
          </div>
        </div>
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.5rem] border border-black/10 bg-white p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-black/68">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-black/55">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
