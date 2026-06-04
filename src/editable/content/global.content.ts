import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A visual discovery home',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Visual discovery home',
    primaryLinks: [
      { label: 'Explore', href: '/article' },
      { label: 'Images', href: '/image' },
      { label: 'Profiles', href: '/profile' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Start exploring', href: '/' },
      secondary: { label: 'Join now', href: '/signup' },
    },
  },
  footer: {
    tagline: 'Discover posts, people, and visual work',
    description: 'A clean browsing surface for image-led posts, creative profiles, articles, listings, bookmarks, and documents.',
    columns: [
      {
        title: 'Browse',
        links: [
          { label: 'Articles', href: '/article' },
          { label: 'Images', href: '/image' },
          { label: 'Profiles', href: '/profile' },
          { label: 'Listings', href: '/listing' },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Login', href: '/login' },
          { label: 'Create account', href: '/signup' },
        ],
      },
    ],
    bottomNote: 'Built for clean browsing and focused discovery.',
  },
  commonLabels: {
    readMore: 'Open',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
