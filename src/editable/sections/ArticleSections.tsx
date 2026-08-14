import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/article',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const totalPages = pagination.totalPages || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({
      ...(category && category !== 'all' ? { category } : {}),
      page: String(nextPage),
    }).toString()}`

  return (
    <main className="bg-[var(--fu-page)] text-[var(--fu-text)]">
      <section className="bg-[var(--fu-ink)] text-white">
        <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{voice.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-[1.9rem] font-bold leading-[1.1] tracking-[-0.025em] sm:text-4xl lg:text-[2.9rem]">
            {voice.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-white/60">{voice.description}</p>

          <form action={basePath} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-5">
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-white/40" />
              <select
                name="category"
                defaultValue={category || 'all'}
                aria-label="Filter by category"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm font-medium text-white outline-none"
              >
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="rounded-full bg-[var(--fu-accent)] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[var(--fu-accent-strong)]">
              Filter
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {posts.length ? (
          <div className="grid gap-5 fu-stagger">
            {posts.map((post, index) => (
              <ArticleListCard
                key={post.id || post.slug || index}
                post={post}
                href={postHref('article', post, basePath)}
                index={index + (page - 1) * (pagination.limit || 0)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--fu-radius-lg)] border border-dashed border-[var(--fu-line)] bg-white p-12 text-center">
            <h2 className="text-xl font-bold tracking-[-0.02em]">Nothing found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-[1.75] text-[var(--fu-muted)]">
              Try another category, or return to the full list.
            </p>
            <Link href={basePath} className={`${dc.button.primary} mt-6`}>
              Reset filters
            </Link>
          </div>
        )}

        {totalPages > 1 ? (
          <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {pagination.hasPrevPage ? (
              <Link
                href={pageHref(page - 1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--fu-line)] bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--fu-accent-ring)]"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Link>
            ) : null}
            <span className="rounded-full bg-[var(--fu-ink)] px-5 py-2.5 text-sm font-semibold text-white">
              {page} / {totalPages}
            </span>
            {pagination.hasNextPage ? (
              <Link
                href={pageHref(page + 1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--fu-line)] bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--fu-accent-ring)]"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className="bg-[var(--fu-page)] text-[var(--fu-text)]">
      <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/article"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fu-muted)] transition hover:gap-3 hover:text-[var(--fu-accent-strong)]"
        >
          <ChevronLeft className="h-4 w-4" /> Back to posts
        </Link>
      </section>

      <section className="mx-auto grid w-full max-w-[var(--editable-container)] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="min-w-0 rounded-[var(--fu-radius-lg)] border border-[var(--fu-line)] bg-white p-7 shadow-[var(--fu-shadow)] sm:p-9">
          <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{voice.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-2xl font-bold leading-[1.15] tracking-[-0.025em] sm:text-3xl lg:text-[2.4rem]">
            {post?.title || pagesContent.detailPages.article.fallbackTitle}
          </h1>
          <p className="mt-5 text-[15px] leading-[1.85] text-[var(--fu-muted)]">
            {post?.summary || `Details for ${slug} will render through the editable detail page.`}
          </p>
        </div>

        <aside className="min-w-0 rounded-[var(--fu-radius)] bg-[var(--fu-ink)] p-6 text-white lg:sticky lg:top-24 lg:self-start">
          <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>Reading note</p>
          <p className="mt-3 text-sm leading-[1.75] text-white/60">{voice.secondaryNote}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--fu-accent-strong)]"
          >
            Contact <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </section>
    </main>
  )
}
