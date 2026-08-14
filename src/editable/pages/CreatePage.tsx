'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'w-full rounded-[var(--fu-radius-sm)] border border-[var(--fu-line)] bg-[var(--fu-soft)] px-4 py-3 text-sm font-medium text-[var(--fu-text)] outline-none transition placeholder:text-black/35 focus:border-[var(--fu-accent-ring)] focus:bg-white'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((item) => item.enabled), [])
  const task = (enabledTasks[0]?.key || 'article') as TaskKey
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="bg-[var(--fu-page)] text-[var(--fu-text)]">
          <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[var(--fu-radius-lg)] shadow-[var(--fu-shadow-lg)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div className="flex min-h-56 items-center justify-center bg-[var(--fu-ink)] p-10">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-[var(--fu-accent)]">
                  <Lock className="h-8 w-8" />
                </span>
              </div>
              <div className="bg-white p-8 sm:p-10">
                <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>{pagesContent.create.locked.badge}</p>
                <h1 className="mt-3 text-2xl font-bold leading-snug tracking-[-0.02em] sm:text-3xl">
                  {pagesContent.create.locked.title}
                </h1>
                <p className="mt-4 text-[15px] leading-[1.8] text-[var(--fu-muted)]">{pagesContent.create.locked.description}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/login" className={dc.button.primary}>
                    Login <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className={dc.button.secondary}>
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="bg-[var(--fu-page)] text-[var(--fu-text)]">
        <section className="relative overflow-hidden bg-[var(--fu-ink)] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(245,147,49,0.18),transparent_65%)]"
          />
          <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent-soft)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--fu-accent)]">
              {pagesContent.create.hero.badge}
            </span>
            <h1 className="mt-4 max-w-2xl text-[1.8rem] font-bold leading-[1.12] tracking-[-0.025em] sm:text-4xl">
              {pagesContent.create.hero.title}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.8] text-white/60">{pagesContent.create.hero.description}</p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto w-full max-w-3xl">
            <form
              onSubmit={submit}
              className="min-w-0 rounded-[var(--fu-radius-lg)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)] sm:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--fu-line)] pb-5">
                <div className="min-w-0">
                  <p className={`${dc.type.eyebrow} text-[var(--fu-accent)]`}>Create {activeTask?.label || 'entry'}</p>
                  <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-[var(--fu-soft)] px-4 py-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--fu-accent)] text-[11px] font-bold uppercase text-white">
                    {(session.name || session.email || '?').slice(0, 1)}
                  </span>
                  <span className="truncate text-[13px] font-semibold text-[var(--fu-muted)]">{session.name || session.email}</span>
                </span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea
                  className={`${fieldClass} min-h-24`}
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="Short summary"
                  required
                />
                <textarea
                  className={`${fieldClass} min-h-48`}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Main content, details, notes, or description"
                  required
                />
              </div>

              {created ? (
                <div className="mt-5 rounded-[var(--fu-radius-sm)] border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4" /> {pagesContent.create.successTitle}
                  </p>
                  <p className="mt-1 text-sm opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button
                type="submit"
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--fu-accent)] px-6 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--fu-accent-strong)]"
              >
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
