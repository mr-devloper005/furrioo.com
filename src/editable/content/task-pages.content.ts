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
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Browse the work before you read a word about it.',
    description:
      'Every entry leads with its visuals, so you can scan the grid, open what catches your eye, and get the supporting detail underneath.',
    filterLabel: 'Filter the gallery',
    secondaryNote: 'Let the imagery carry the page before the text does.',
    chips: ['Gallery', 'Visual first', 'Portfolio'],
  },
  article: {
    eyebrow: 'Reading room',
    headline: 'Longer posts with a calmer reading rhythm.',
    description: 'Guides, notes and story-led posts laid out so headlines and summaries have room to breathe.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Reading pages work best when the hierarchy stays clear and the pace stays steady.',
    chips: ['Editorial', 'Long reads', 'Topics'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fast-moving offers and time-sensitive posts.',
    description: 'Built to scan quickly, with the practical details up front and the layout out of the way.',
    filterLabel: 'Filter a category',
    secondaryNote: 'Prioritise urgency, short summaries, and easy action paths.',
    chips: ['Quick scan', 'Offers', 'Short reads'],
  },
  sbm: {
    eyebrow: 'Saved resources',
    headline: 'Bookmarks and references arranged like a useful shelf.',
    description: 'Collections stay tidy and the metadata stays calm, so finding something again is quick.',
    filterLabel: 'Filter a collection',
    secondaryNote: 'Curated resources need clear groupings and a little breathing room.',
    chips: ['Collections', 'References', 'Tools'],
  },
  profile: {
    eyebrow: 'People and profiles',
    headline: 'The people and teams behind the work.',
    description: 'Profiles that make identity and context visible before you scroll into the detail.',
    filterLabel: 'Filter profiles',
    secondaryNote: 'Make identity, role, and context visible before the cards begin.',
    chips: ['Identity first', 'Context', 'Discoverable'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'Documents presented like a practical archive.',
    description: 'Clear file context and a simple way to open or download, without hunting through a wall of links.',
    filterLabel: 'Filter documents',
    secondaryNote: 'Archive pages need file context and a fast browsing rhythm.',
    chips: ['Files', 'Guides', 'Archive'],
  },
  listing: {
    eyebrow: 'Business directory',
    headline: 'Listings built for comparison and direct contact.',
    description: 'Enough structure to compare details side by side, with the contact route always one tap away.',
    filterLabel: 'Filter listings',
    secondaryNote: 'Prioritise location, contact details, and quick recognition.',
    chips: ['Directory', 'Compare', 'Contact'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
