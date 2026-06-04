import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Visual discovery for articles, images, and profiles',
      description: 'Explore a modern gallery of posts, people, and creative work through a clean browsing experience.',
      openGraphTitle: 'Visual discovery for articles, images, and profiles',
      openGraphDescription: 'Browse a polished mix of image-led posts, profiles, and resources in one connected space.',
      keywords: ['creative discovery', 'image gallery', 'profiles', 'articles', 'portfolio browsing'],
    },
    hero: {
      badge: 'Creative discoveries',
      title: ["The world's best visual work", 'lives on one clean grid.'],
      description: 'Browse feature stories, image posts, and creator profiles through a focused layout with quick search, topic chips, and strong visual cards.',
      primaryCta: { label: 'Explore posts', href: '/article' },
      secondaryCta: { label: 'Browse images', href: '/image' },
      searchPlaceholder: 'Search posts, people, topics, or visuals',
      focusLabel: 'Filter',
      featureCardBadge: 'featured picks',
      featureCardTitle: 'A premium browsing surface for discovery.',
      featureCardDescription: 'The layout stays image-led and easy to scan, while supporting every active content type.',
    },
    intro: {
      badge: 'Why it feels different',
      title: 'Built to make exploration feel intentional, fast, and polished.',
      paragraphs: [
        'The homepage is designed like a modern editorial feed with a centered hero, fast filters, and a strong cadence of cards.',
        'Each section changes its rhythm so the page feels curated rather than repetitive, while still keeping the whole site easy to use on mobile.',
        'From images to profiles, the structure keeps the most useful content visible without losing the sense of browsing a real destination.',
      ],
      sideBadge: 'What you get',
      sidePoints: [
        'Fresh homepage structure with a large hero and quick-entry controls.',
        'Mixed card styles so the feed feels more like a hand-built magazine.',
        'Cleaner reading and detail pages with room for media and supporting text.',
        'A dark footer and clear utility navigation that keep the site grounded.',
      ],
      primaryLink: { label: 'Go to images', href: '/image' },
      secondaryLink: { label: 'View profiles', href: '/profile' },
    },
    cta: {
      badge: 'Keep browsing',
      title: 'A clean, contemporary space for creative discovery.',
      description: 'Switch between articles, visuals, profiles, listings, and supporting resources without the layout ever feeling cluttered.',
      primaryCta: { label: 'Open the feed', href: '/article' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'New posts are surfaced here with a stronger visual rhythm and clear entry points.',
    },
  },
  about: {
    badge: 'About',
    title: 'A simple place to browse useful content and creative work.',
    description: `${slot4BrandConfig.siteName} keeps posts, profiles, and image-led content in one clear browsing experience.`,
    paragraphs: [
      'The layout is built for people who want to move quickly from inspiration to detail without fighting the interface.',
      'Every page uses the same visual language so the experience stays familiar even when the content type changes.',
    ],
    values: [
      {
        title: 'Clear discovery',
        description: 'The site makes it easy to scan, search, and open content without visual clutter.',
      },
      {
        title: 'Flexible content',
        description: 'Articles, images, profiles, and listings all fit into the same system without feeling forced.',
      },
      {
        title: 'Polished structure',
        description: 'Strong spacing, contrast, and hierarchy keep the experience feeling modern and complete.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Send a short note and we will route it to the right place.',
    description: 'Use this page for questions, publishing requests, or general support. The form stays simple and focused.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, people, and content across the site.',
    },
    hero: {
      badge: 'Search the collection',
      title: 'Find posts, profiles, and visuals faster.',
      description: 'Use keywords, categories, and content types to jump straight to the posts that matter most.',
      placeholder: 'Search by keyword, title, category, or creator',
    },
    resultsTitle: 'Recent searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Sign in to create new content.',
      description: 'Use your account to open the publishing workspace and prepare a post for the active sections of the site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a polished post with images, links, and supporting text.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back.',
      description: 'Sign in to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
