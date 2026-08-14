import type { CSSProperties } from 'react'

/*
  Furrioo visual system
  ---------------------
  Dark charcoal chrome + warm amber accent on a soft neutral page.
  Every surface in src/editable consumes these variables, so the whole
  site can be re-skinned by editing this single block.
*/

export const editableRootStyle = {
  // --- core furrioo tokens -------------------------------------------------
  '--fu-ink': '#1e242c',
  '--fu-ink-soft': '#272e38',
  '--fu-ink-deep': '#161b21',
  '--fu-ink-line': 'rgba(255,255,255,0.10)',
  '--fu-ink-text': '#f4f5f7',
  '--fu-ink-muted': 'rgba(244,245,247,0.62)',

  '--fu-page': '#eeeeec',
  '--fu-page-2': '#f6f6f4',
  '--fu-card': '#ffffff',
  '--fu-text': '#181c22',
  '--fu-muted': '#666e79',
  '--fu-soft': '#f3f4f2',
  '--fu-line': 'rgba(17,22,28,0.10)',

  '--fu-accent': '#f59331',
  '--fu-accent-strong': '#e8811c',
  '--fu-accent-soft': 'rgba(245,147,49,0.14)',
  '--fu-accent-ring': 'rgba(245,147,49,0.32)',
  '--fu-star': '#f5a623',

  '--fu-radius-sm': '0.7rem',
  '--fu-radius': '1rem',
  '--fu-radius-lg': '1.4rem',
  '--fu-shadow': '0 8px 26px rgba(17,22,28,0.07)',
  '--fu-shadow-lg': '0 18px 48px rgba(17,22,28,0.12)',

  '--editable-container': '1280px',

  // --- legacy slot4 aliases (kept so older class strings keep resolving) ---
  '--slot4-page-bg': '#eeeeec',
  '--slot4-page-text': '#181c22',
  '--slot4-panel-bg': '#ffffff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#666e79',
  '--slot4-soft-muted-text': '#7c848f',
  '--slot4-accent': '#f59331',
  '--slot4-accent-fill': '#f59331',
  '--slot4-accent-soft': 'rgba(245,147,49,0.16)',
  '--slot4-dark-bg': '#1e242c',
  '--slot4-dark-text': '#f4f5f7',
  '--slot4-media-bg': '#e6e7e4',
  '--slot4-cream': '#ffffff',
  '--slot4-warm': '#f6f6f4',
  '--slot4-lavender': 'rgba(245,147,49,0.16)',
  '--slot4-gray': '#f3f4f2',
  '--slot4-body-gradient': 'linear-gradient(180deg, #f1f1ef 0%, #eeeeec 340px, #eeeeec 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--fu-page)]',
  pageText: 'text-[var(--fu-text)]',
  panelBg: 'bg-[var(--fu-card)]',
  panelText: 'text-[var(--fu-text)]',
  surfaceBg: 'bg-[var(--fu-card)]',
  surfaceText: 'text-[var(--fu-text)]',
  mutedText: 'text-[var(--fu-muted)]',
  softMutedText: 'text-[var(--fu-muted)]',
  accentText: 'text-[var(--fu-accent)]',
  accentBg: 'bg-[var(--fu-accent)]',
  accentSoftBg: 'bg-[var(--fu-accent-soft)]',
  accentSoftText: 'text-[var(--fu-accent)]',
  darkBg: 'bg-[var(--fu-ink)]',
  darkText: 'text-[var(--fu-ink-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--fu-card)]',
  warmBg: 'bg-[var(--fu-page-2)]',
  lavenderBg: 'bg-[var(--fu-accent-soft)]',
  grayBg: 'bg-[var(--fu-soft)]',
  border: 'border-[var(--fu-line)]',
  darkBorder: 'border-[var(--fu-ink-line)]',
  shadow: 'shadow-[var(--fu-shadow)]',
  shadowStrong: 'shadow-[var(--fu-shadow-lg)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(12,16,20,0)_35%,rgba(12,16,20,0.82)_100%)]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-10 sm:py-12 lg:py-16',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[240px] shrink-0 snap-start sm:w-[272px]',
    masonry: 'columns-1 gap-5 sm:columns-2 xl:columns-3 [&>*]:mb-5',
  },
  type: {
    eyebrow: 'text-[11px] font-bold uppercase tracking-[0.22em]',
    heroTitle: 'text-[2.1rem] font-bold leading-[1.08] tracking-[-0.022em] sm:text-5xl lg:text-[3.4rem]',
    sectionTitle: 'text-2xl font-bold tracking-[-0.02em] sm:text-[2rem]',
    body: 'text-[15px] leading-[1.75]',
  },
  surface: {
    card: `rounded-[var(--fu-radius-lg)] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[var(--fu-radius-lg)] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[var(--fu-radius-lg)] border ${editablePalette.darkBorder} ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--fu-accent)] px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--fu-accent-strong)] hover:-translate-y-0.5 hover:shadow-[0_10px_26px_var(--fu-accent-ring)]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--fu-line)] bg-[var(--fu-card)] px-6 py-3 text-sm font-semibold text-[var(--fu-text)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--fu-accent-ring)]',
    ghostDark:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--fu-ink-line)] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-[var(--fu-ink-text)] transition duration-200 hover:bg-white/[0.09]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--fu-accent)] px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--fu-accent-strong)]',
  },
  chip: {
    base: 'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition duration-200',
    quiet: 'bg-[var(--fu-soft)] text-[var(--fu-muted)] hover:bg-[var(--fu-accent-soft)] hover:text-[var(--fu-accent-strong)]',
    active: 'bg-[var(--fu-accent)] text-white',
    dark: 'border border-[var(--fu-ink-line)] bg-white/[0.05] text-[var(--fu-ink-muted)]',
  },
  media: {
    frame: 'relative overflow-hidden rounded-[var(--fu-radius)] bg-[var(--slot4-media-bg)]',
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[var(--fu-shadow-lg)]',
    fade: 'transition duration-300 hover:opacity-85',
    zoom: 'transition duration-[700ms] ease-out group-hover:scale-[1.06]',
  },
} as const

export const aiLayoutRules = [
  'All colour lives in editableRootStyle; change the --fu-* tokens to re-skin the entire site.',
  'Home structure lives in src/editable/sections/HomeSections.tsx.',
  'Cards live in src/editable/cards/PostCards.tsx and intentionally use several different shapes.',
  'Keep dynamic post fetching intact; never replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
  'Render every post field defensively: image, summary and category can all be missing.',
] as const
