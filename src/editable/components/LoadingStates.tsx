import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('fu-shimmer rounded-[var(--fu-radius-sm)] bg-black/[0.06]', className)} />
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white shadow-[var(--fu-shadow)]">
      <PulseBlock className="h-44 w-full rounded-none" />
      <div className="p-5">
        <PulseBlock className="h-4 w-24 rounded-full" />
        <PulseBlock className="mt-4 h-5 w-4/5" />
        <PulseBlock className="mt-2.5 h-4 w-3/5" />
        <PulseBlock className="mt-5 h-8 w-28 rounded-full" />
      </div>
    </div>
  )
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8', className)}
      aria-live="polite"
      aria-busy="true"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--fu-accent)]">{label}</p>
      <PulseBlock className="mt-5 h-12 w-3/4 max-w-2xl" />
      <PulseBlock className="mt-4 h-4 w-2/3 max-w-xl" />
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <SkeletonCard key={item} />
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading details', className }: LoadingStateProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8', className)}
      aria-live="polite"
      aria-busy="true"
    >
      <PulseBlock className="h-64 w-full rounded-[var(--fu-radius-lg)] sm:h-80" />
      <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[var(--fu-radius)] border border-[var(--fu-line)] bg-white p-6 shadow-[var(--fu-shadow)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--fu-accent)]">{label}</p>
          <PulseBlock className="mt-5 h-5 w-full" />
          <PulseBlock className="mt-3 h-4 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-4/6" />
          <PulseBlock className="mt-3 h-4 w-3/6" />
        </div>
        <div className="grid content-start gap-4">
          <PulseBlock className="h-24 w-full rounded-[var(--fu-radius)]" />
          <PulseBlock className="h-40 w-full rounded-[var(--fu-radius)]" />
        </div>
      </div>
    </div>
  )
}
