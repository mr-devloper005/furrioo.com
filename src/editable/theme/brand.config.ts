import { siteIdentity } from '@/config/site.identity'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'

const { recipe } = getFactoryState()
const productKind = getProductKind(recipe)

export const slot4BrandConfig = {
  siteName: siteIdentity.name,
  tagline: siteIdentity.tagline,
  domain: siteIdentity.domain,
  baseUrl: siteIdentity.url,
  productKind,
  ogImage: siteIdentity.ogImage,
  // One house palette for every product kind: charcoal chrome + amber accent.
  accents: { primary: '#f59331', surface: '#1e242c' },
} as const

export const furriooBrand = {
  ink: '#1e242c',
  inkDeep: '#161b21',
  page: '#eeeeec',
  card: '#ffffff',
  accent: '#f59331',
  accentStrong: '#e8811c',
  text: '#181c22',
  muted: '#666e79',
  navTagline: 'A visual directory for business owners',
} as const
