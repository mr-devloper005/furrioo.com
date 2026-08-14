'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MessageSquare, RefreshCw, Search } from 'lucide-react'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type StoredComment = {
  id: string
  name: string
  email?: string
  comment: string
  createdAt: string
  articleTitle?: string
  articleSlug?: string
}

const COMMENTS_PER_PAGE = 8
const COMMENT_KEY_PREFIX = 'slot4:article-comments:'

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return 'Just now'
  }
}

const readCommentsFromStorage = (): StoredComment[] => {
  const items: StoredComment[] = []
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key?.startsWith(COMMENT_KEY_PREFIX)) continue
    const articleSlug = key.replace(COMMENT_KEY_PREFIX, '')
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) || '[]')
      if (!Array.isArray(parsed)) continue
      for (const item of parsed) {
        if (!item || typeof item !== 'object') continue
        if (typeof item.name !== 'string' || typeof item.comment !== 'string') continue
        items.push({
          id: typeof item.id === 'string' ? item.id : `${articleSlug}-${items.length}`,
          name: item.name,
          email: typeof item.email === 'string' ? item.email : undefined,
          comment: item.comment,
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
          articleTitle: typeof item.articleTitle === 'string' ? item.articleTitle : undefined,
          articleSlug: typeof item.articleSlug === 'string' ? item.articleSlug : articleSlug,
        })
      }
    } catch {
      // Ignore corrupted local comment records.
    }
  }

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export default function CommentsPage() {
  const [comments, setComments] = useState<StoredComment[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setComments(readCommentsFromStorage())
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return comments
    return comments.filter((item) =>
      [item.name, item.email, item.comment, item.articleTitle, item.articleSlug]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    )
  }, [comments, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / COMMENTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visibleComments = filtered.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)

  function refreshComments() {
    setComments(readCommentsFromStorage())
    setPage(1)
  }

  return (
    <EditableSiteShell>
      <main className="bg-[var(--fu-page)] text-[var(--fu-text)]">
        <section className="bg-[var(--fu-ink)] text-white">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent-soft)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fu-accent)]">
              <MessageSquare className="h-3.5 w-3.5" />
              Saved locally
            </span>
            <h1 className="mt-4 text-[1.8rem] font-bold leading-[1.12] tracking-[-0.025em] sm:text-4xl">Comments</h1>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.8] text-white/60">
              Comments you have written from this browser, kept together in one place.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex flex-col gap-3 rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-4 shadow-[var(--fu-shadow)] sm:flex-row sm:items-center sm:justify-between">
            <label className="relative flex w-full items-center sm:max-w-md">
              <Search className="pointer-events-none absolute left-4 h-4 w-4 text-black/30" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                placeholder="Search comments..."
                aria-label="Search comments"
                className="h-11 w-full rounded-full border border-[var(--fu-line)] bg-[var(--fu-soft)] pl-11 pr-4 text-sm font-medium outline-none transition focus:border-[var(--fu-accent-ring)] focus:bg-white"
              />
            </label>
            <div className="flex items-center gap-3">
              <p className="text-sm text-[var(--fu-muted)]">
                {filtered.length} comment{filtered.length === 1 ? '' : 's'}
              </p>
              <button
                type="button"
                onClick={refreshComments}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--fu-line)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--fu-accent-ring)] hover:text-[var(--fu-accent-strong)]"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>
          </div>

          {visibleComments.length ? (
            <div className="mt-6 grid gap-4 fu-stagger">
              {visibleComments.map((item) => (
                <article
                  key={`${item.articleSlug}-${item.id}`}
                  className="rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-5 shadow-[var(--fu-shadow)] transition duration-300 hover:border-[var(--fu-accent-ring)]"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-xs font-bold uppercase text-[var(--fu-accent-strong)]">
                        {(item.name || '?').slice(0, 1)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="mt-0.5 text-xs text-[var(--fu-muted)]">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                    {item.articleSlug ? (
                      <Link
                        href={`/article/${item.articleSlug}`}
                        className="text-sm font-semibold text-[var(--fu-accent-strong)] fu-underline"
                      >
                        Open post
                      </Link>
                    ) : null}
                  </div>
                  {item.articleTitle ? <p className="mt-4 text-sm font-medium">{item.articleTitle}</p> : null}
                  <p className="mt-2.5 text-sm leading-[1.75] text-[var(--fu-muted)]">{item.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[var(--fu-radius-lg)] border border-dashed border-[var(--fu-line)] bg-white p-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-[var(--fu-accent-strong)]">
                <MessageSquare className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-xl font-bold tracking-[-0.02em]">No comments yet</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-[1.75] text-[var(--fu-muted)]">
                Leave a comment on any post and it will show up here.
              </p>
            </div>
          )}

          {filtered.length > COMMENTS_PER_PAGE ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-4 text-sm text-[var(--fu-muted)]">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`${dc.chip.base} ${dc.chip.quiet} disabled:opacity-40`}
                  disabled={currentPage <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className={`${dc.chip.base} ${dc.chip.quiet} disabled:opacity-40`}
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}
