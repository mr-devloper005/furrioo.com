import { slot4BrandConfig } from '@/editable/theme/brand.config'

const siteName = slot4BrandConfig.siteName

export const pagesContent = {
  home: {
    metadata: {
      title: 'A visual directory of businesses, galleries and the people behind them',
      description:
        'Browse image-led profiles, galleries and updates from businesses and independent operators in one calm, easy-to-scan directory.',
      openGraphTitle: 'A visual directory of businesses, galleries and the people behind them',
      openGraphDescription:
        'Discover image-led profiles, galleries and updates from businesses and independent operators, all in one place.',
      keywords: ['visual directory', 'business gallery', 'image showcase', 'business profiles', 'discovery'],
    },
    hero: {
      badge: 'A visual directory',
      title: ['Discover the people', 'behind the businesses.'],
      description:
        'Browse profiles and galleries from owners and teams building something worth noticing — a calmer, more considered way to find and be found.',
      primaryCta: { label: 'Start browsing', href: '/image' },
      secondaryCta: { label: 'How it works', href: '/about' },
      searchPlaceholder: 'Search businesses, galleries, topics...',
      focusLabel: 'Filter',
      featureCardBadge: 'Featured picks',
      featureCardTitle: 'Galleries land here as soon as they publish.',
      featureCardDescription: 'Once content is live, this space fills with the newest visual sets from across the directory.',
    },
    rail: {
      eyebrow: 'Moving quickly',
      title: 'Getting attention this week',
    },
    feed: {
      eyebrow: 'Fresh in the directory',
      title: 'The latest galleries and updates',
      description: `New visual sets, profiles and notes from across ${siteName}, ordered so the most recent work stays easy to find.`,
      actionLabel: 'Browse the full directory',
    },
    spotlight: {
      eyebrow: 'Worth opening first',
      title: 'A closer look at standout work',
      description: 'One larger feature with supporting entries underneath, so the page has a clear point of focus.',
      featureLabel: 'Spotlight',
    },
    mosaic: {
      eyebrow: 'Keep exploring',
      title: 'A wider view of the collection',
      description: 'A looser, image-led grid for the moments when you would rather browse than search.',
    },
    aside: {
      eyebrow: 'Quick access',
      title: 'Find the right set in a few clicks.',
      description: 'Jump straight into the full gallery index, or pick up where the newest entries leave off.',
      listTitle: 'Recently added',
    },
    intro: {
      badge: 'Why it works',
      title: 'Built so a business is easy to understand at a glance.',
      paragraphs: [
        'The directory leads with imagery, because a single strong visual usually explains more than a paragraph of description.',
        'Each section changes rhythm — wide features, compact rows, loose mosaics — so browsing feels considered rather than repetitive.',
        'Everything stays fast and readable on a phone, which is where most people will find you.',
      ],
      sideBadge: 'What you get',
      sidePoints: [
        'An image-first home page with search and topic filters up front.',
        'Several card styles so the feed never reads as one long template.',
        'Detail pages with room for a full set of visuals and supporting notes.',
        'A dark, grounded chrome that keeps attention on the work itself.',
      ],
      primaryLink: { label: 'Open the gallery', href: '/image' },
      secondaryLink: { label: 'Read about the site', href: '/about' },
    },
    cta: {
      badge: 'Keep exploring',
      title: 'There is more waiting in the archive.',
      description:
        'Move between galleries, topics and recent additions without the layout getting in the way. Search when you know what you want, browse when you do not.',
      primaryCta: { label: 'Open the gallery', href: '/image' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'New entries appear here automatically as they are published.',
    },
  },
  about: {
    badge: 'About',
    title: 'A visual directory built for people who run things.',
    description: `${siteName} keeps galleries, profiles and updates in one clear browsing experience, with the imagery doing most of the talking.`,
    paragraphs: [
      'The site is built for owners, operators and small teams who want their work to be found without wading through a cluttered interface.',
      'Every page uses the same visual language, so moving from a grid to a detail view never feels like landing on a different website.',
      'The layout stays deliberately quiet: dark chrome, generous spacing, and a single warm accent used only where it helps you act.',
    ],
    values: [
      {
        title: 'Clear discovery',
        description: 'Search, filter and scan without visual clutter getting in the way of the work.',
      },
      {
        title: 'Image first',
        description: 'Galleries lead with what they look like, then fill in the supporting detail underneath.',
      },
      {
        title: 'Polished structure',
        description: 'Consistent spacing, contrast and hierarchy across every page, phone included.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${siteName}`,
    title: 'Send a short note and we will point it the right way.',
    description: 'Use this page for questions, submissions, or general support. The form stays short on purpose.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search galleries, profiles and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find galleries, listings and resources faster.',
      description: 'Use keywords, categories and content types to jump straight to the entries that matter.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit content for the site.',
    },
    locked: {
      badge: 'Member access',
      title: 'Sign in to add a new entry.',
      description: 'Use your account to open the publishing workspace and prepare a gallery for the directory.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Add something to the directory.',
      description: 'Pick the content type, add the details, and prepare a polished entry with images, links and supporting text.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit entry',
    successTitle: 'Entry saved successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back.',
      description: 'Sign in to keep browsing, manage your submissions, and add new entries from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create an account first, then sign in.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Get started',
      title: 'Create your account.',
      description: 'An account unlocks the publishing workspace and keeps your details saved between visits.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related reading',
      fallbackTitle: 'Post details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'More like this',
      fallbackTitle: 'Gallery details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const

/** Convenience alias used by the home sections. */
export const homeContent = pagesContent.home
