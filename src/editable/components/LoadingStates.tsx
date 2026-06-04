import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-2xl bg-black/10', className)} />
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8', className)} aria-live="polite" aria-busy="true">
      <p className="text-[11px] font-black uppercase tracking-[0.28em] text-black/45">{label}</p>
      <PulseBlock className="mt-5 h-14 w-3/4 max-w-4xl" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl" />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_14px_44px_rgba(15,23,42,0.08)]">
            <PulseBlock className="h-44 w-full rounded-[1.4rem]" />
            <PulseBlock className="mt-5 h-5 w-4/5" />
            <PulseBlock className="mt-3 h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-[2rem] border border-black/10 bg-white p-4 shadow-[0_14px_44px_rgba(15,23,42,0.08)]">
          <PulseBlock className="h-40 w-full rounded-[1.4rem]" />
          <PulseBlock className="mt-4 h-5 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
          <PulseBlock className="mt-6 h-9 w-32 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading detail', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr]', className)} aria-live="polite" aria-busy="true">
      <PulseBlock className="h-96 w-full rounded-[2.4rem]" />
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-black/45">{label}</p>
        <PulseBlock className="mt-5 h-14 w-4/5" />
        <PulseBlock className="mt-5 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
        <PulseBlock className="mt-3 h-4 w-2/3" />
      </div>
    </div>
  )
}
