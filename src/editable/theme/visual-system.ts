import { slot4BrandConfig } from './brand.config'

export type Slot4VisualPreset =
  | 'editorial-paper'
  | 'luxury-atelier'
  | 'brutalist-index'
  | 'organic-journal'
  | 'tech-directory'
  | 'retro-bulletin'
  | 'visual-gallery'

/*
  Furrioo runs a single house palette: charcoal chrome, warm amber accent,
  soft neutral paper. Every preset below is tuned to that house style so the
  site never drifts into a different colour world when a preset changes.
*/

const house = {
  ink: '#1e242c',
  inkDeep: '#161b21',
  paper: '#eeeeec',
  paperSoft: '#f6f6f4',
  surface: '#ffffff',
  text: '#181c22',
  muted: '#666e79',
  accent: '#f59331',
  accentDeep: '#e8811c',
} as const

export const visualPresets = {
  'editorial-paper': {
    label: 'Editorial Paper',
    mood: 'calm magazine authority',
    fontDirection: 'quiet sans headlines with generous reading measure',
    colors: {
      background: house.paper,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accent,
      surface: house.surface,
    },
    shape: 'soft editorial cards with fine hairline borders',
  },
  'luxury-atelier': {
    label: 'Luxury Atelier',
    mood: 'premium, restrained, polished',
    fontDirection: 'tight display headings with spacious label tracking',
    colors: {
      background: house.paper,
      foreground: house.text,
      muted: house.muted,
      primary: house.inkDeep,
      accent: house.accentDeep,
      surface: house.surface,
    },
    shape: 'large charcoal panels, amber hairlines, generous negative space',
  },
  'brutalist-index': {
    label: 'Brutalist Index',
    mood: 'bold, raw, memorable',
    fontDirection: 'condensed headings, mono labels, hard rhythm',
    colors: {
      background: house.paperSoft,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accent,
      surface: house.surface,
    },
    shape: 'flat blocks, thick rules, offset modules',
  },
  'organic-journal': {
    label: 'Organic Journal',
    mood: 'warm, natural, trustworthy',
    fontDirection: 'humanist sans with soft captions',
    colors: {
      background: house.paper,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accent,
      surface: house.surface,
    },
    shape: 'rounded cards, natural spacing, calm texture',
  },
  'tech-directory': {
    label: 'Tech Directory',
    mood: 'clean, fast, useful',
    fontDirection: 'modern sans with crisp data accents',
    colors: {
      background: house.paper,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accent,
      surface: house.surface,
    },
    shape: 'clean grids, pill filters, sharp information hierarchy',
  },
  'retro-bulletin': {
    label: 'Retro Bulletin',
    mood: 'playful, local, energetic',
    fontDirection: 'chunky headings with friendly body type',
    colors: {
      background: house.paperSoft,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accentDeep,
      surface: house.surface,
    },
    shape: 'stickers, tabs, framed modules, playful dividers',
  },
  'visual-gallery': {
    label: 'Visual Gallery',
    mood: 'cinematic, image-led, immersive',
    fontDirection: 'minimal sans with oversized display moments',
    colors: {
      background: house.paper,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accent,
      surface: house.surface,
    },
    shape: 'charcoal chrome, large media cards, amber highlights',
  },
} as const

export const visualSystem = {
  productKind: slot4BrandConfig.productKind,
  recommendedPreset: 'visual-gallery',
  ink: house.ink,
  accent: house.accent,
  radius: {
    sm: '0.7rem',
    md: '1rem',
    lg: '1.4rem',
    xl: '2rem',
  },
  motion: {
    pageLoad: 'animate-in fade-in slide-in-from-bottom-4 duration-700',
    // CSS-only equivalent defined in editable-global.css, used by the redesigned sections.
    pageLoadCss: 'fu-rise',
    staggerCss: 'fu-stagger',
    cardHover: 'transition duration-300 hover:-translate-y-1 hover:shadow-[var(--fu-shadow-lg)]',
    softHover: 'transition duration-300 hover:opacity-85',
    reduceMotionSafe: 'motion-reduce:transform-none motion-reduce:transition-none',
  },
  typography: {
    eyebrow: 'text-[11px] font-bold uppercase tracking-[0.22em]',
    heroTitle: 'text-[2.1rem] font-bold leading-[1.08] tracking-[-0.022em] sm:text-5xl lg:text-[3.4rem]',
    sectionTitle: 'text-2xl font-bold tracking-[-0.02em] sm:text-[2rem]',
    body: 'text-[15px] leading-[1.75]',
    caption: 'text-[11px] font-semibold uppercase tracking-[0.16em]',
  },
  surfaces: {
    glass: 'border border-white/12 bg-white/[0.06] backdrop-blur-xl',
    paper: 'border border-[var(--fu-line)] bg-white shadow-[var(--fu-shadow)]',
    quiet: 'border border-[var(--fu-line)] bg-[var(--fu-soft)]',
    dark: 'border border-[var(--fu-ink-line)] bg-[var(--fu-ink)] shadow-[var(--fu-shadow-lg)]',
  },
  layout: {
    // max-w-7xl is 80rem = 1280px, the same width as --editable-container.
    page: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
    sectionY: 'py-10 sm:py-12 lg:py-16',
    cardGrid: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
  },
} as const

export function getVisualPreset(name: Slot4VisualPreset = visualSystem.recommendedPreset as Slot4VisualPreset) {
  return visualPresets[name] || visualPresets['visual-gallery']
}
