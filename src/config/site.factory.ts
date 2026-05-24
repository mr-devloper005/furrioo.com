import type { SiteFactoryRecipe } from '@/design/factory/types'

export const SITE_FACTORY_RECIPE: SiteFactoryRecipe = {
  brandPack: 'studio-dark',
  navbar: 'compact-bar',
  footer: 'editorial-footer',
  homeLayout: 'article-home',
  motionPack: 'editorial-soft',
  primaryTask: 'image',
  enabledTasks: ["image"],
  taskLayouts: {
    image: 'image-gallery',
  },
}
