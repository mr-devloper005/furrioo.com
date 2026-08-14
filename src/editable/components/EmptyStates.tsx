import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'New entries appear here automatically once this section has content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'rounded-[var(--fu-radius-lg)] border border-dashed border-[var(--fu-line)] bg-white p-10 text-center shadow-[var(--fu-shadow)] sm:p-12',
        className
      )}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--fu-accent-soft)] text-[var(--fu-accent-strong)]">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-xl font-bold tracking-[-0.02em] text-[var(--fu-text)]">{title}</h2>
      <p className="mx-auto mt-2.5 max-w-md text-sm leading-[1.75] text-[var(--fu-muted)]">{description}</p>
      <Link
        href={actionHref}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--fu-accent)] px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--fu-accent-strong)]"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically. The layout stays ready even while the feed is empty.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your note has been saved and routed to the right place."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
