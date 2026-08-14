import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A visual directory',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'A visual directory',
    primaryLinks: [
      { label: 'Home', href: '/' },
      { label: 'Gallery', href: '/image' },
      { label: 'Search', href: '/search' },
      { label: 'About', href: '/about' },
    ],
    actions: {
      primary: { label: 'Sign up', href: '/signup' },
      secondary: { label: 'Login', href: '/login' },
    },
  },
  footer: {
    tagline: 'Galleries, profiles and updates in one place',
    description:
      'An image-led directory for businesses and independent operators. Browse visual sets, open the detail you need, and move on quickly.',
    columns: [
      {
        title: 'Browse',
        links: [
          { label: 'Gallery', href: '/image' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Login', href: '/login' },
          { label: 'Sign up', href: '/signup' },
        ],
      },
    ],
    bottomNote: 'Curated for clean browsing',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'More like this',
    published: 'Published',
  },
} as const
