import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Editorial feed',
    headline: 'Long-form posts with a calmer reading rhythm.',
    description: 'Browse essays, guides, and story-led posts in a layout that gives headlines and summaries room to breathe.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Reading pages work best when the hierarchy stays clear and the pace feels steady.',
    chips: ['Editorial', 'Long reads', 'Topic filters'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fast-moving offers and time-sensitive posts.',
    description: 'Classified content should scan quickly, with practical cues and a layout that gets out of the way.',
    filterLabel: 'Filter a category',
    secondaryNote: 'Prioritize urgency, short summaries, and easy action paths.',
    chips: ['Quick scan', 'Offers', 'Short reads'],
  },
  sbm: {
    eyebrow: 'Saved resources',
    headline: 'Bookmarks and references arranged like a useful shelf.',
    description: 'These pages work best when collections stay tidy and metadata feels calm and readable.',
    filterLabel: 'Filter a collection',
    secondaryNote: 'Curated resources need clear groupings and a little breathing room.',
    chips: ['Collections', 'References', 'Tools'],
  },
  profile: {
    eyebrow: 'People and profiles',
    headline: 'Profiles with identity cues that are easy to trust.',
    description: 'Profile pages should make people and brands feel discoverable, not buried inside a generic grid.',
    filterLabel: 'Filter profiles',
    secondaryNote: 'Make identity, role, and context visible before the cards begin.',
    chips: ['Identity first', 'Trust cues', 'Discoverable'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'PDFs and documents presented like a practical archive.',
    description: 'Documents should feel useful right away, with clear file context and a simple way to open or download.',
    filterLabel: 'Filter documents',
    secondaryNote: 'Archive pages need file context and a fast browsing rhythm.',
    chips: ['Files', 'Guides', 'Archive'],
  },
  listing: {
    eyebrow: 'Business directory',
    headline: 'Listings designed for comparison and direct action.',
    description: 'Directory pages should feel practical, with enough structure to compare details without friction.',
    filterLabel: 'Filter listings',
    secondaryNote: 'Prioritize location, contact details, and quick recognition.',
    chips: ['Directory', 'Compare', 'Contact'],
  },
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Image posts with a stronger portfolio feel.',
    description: 'Image pages should lead with visuals first, then supporting text, so browsing feels closer to a curated gallery.',
    filterLabel: 'Filter visuals',
    secondaryNote: 'Let the images carry the page before long text does.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
