import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f4f5f7',
  '--slot4-page-text': '#111317',
  '--slot4-panel-bg': '#ffffff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#5f6570',
  '--slot4-soft-muted-text': '#7d838f',
  '--slot4-accent': '#3d47ff',
  '--slot4-accent-fill': '#3d47ff',
  '--slot4-accent-soft': '#dce2ff',
  '--slot4-dark-bg': '#111111',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#e7e9f1',
  '--slot4-cream': '#ffffff',
  '--slot4-warm': '#f6f7fb',
  '--slot4-lavender': '#dce2ff',
  '--slot4-gray': '#eef1f6',
  '--slot4-body-gradient':
    'radial-gradient(circle at top left, rgba(61, 71, 255, 0.08), transparent 28%), radial-gradient(circle at top right, rgba(18, 18, 18, 0.04), transparent 24%), linear-gradient(180deg, #f8f9fc 0%, #f4f5f7 35%, #eef1f6 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-black/[0.08]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_14px_44px_rgba(15,23,42,0.08)]',
  shadowStrong: 'shadow-[0_24px_80px_rgba(15,23,42,0.18)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[148px] shrink-0 snap-start sm:w-[176px]',
  },
  type: {
    eyebrow: 'text-[11px] font-extrabold uppercase tracking-[0.28em]',
    heroTitle: 'text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl lg:text-[4.6rem]',
    sectionTitle: 'text-3xl font-black tracking-[-0.06em] sm:text-4xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-[1.8rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[1.8rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[1.8rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center rounded-full ${editablePalette.darkBg} px-7 py-3 text-sm font-black text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg`,
    secondary: `inline-flex items-center justify-center rounded-full border ${editablePalette.border} ${editablePalette.surfaceBg} px-7 py-3 text-sm font-black ${editablePalette.surfaceText} transition duration-200 hover:-translate-y-0.5 hover:bg-black/[0.03]`,
    accent: `inline-flex items-center justify-center rounded-full ${editablePalette.accentBg} px-7 py-3 text-sm font-black text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.4rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[2/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(15,23,42,0.16)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense post browsing, like the MysteryCoder reference layout.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
