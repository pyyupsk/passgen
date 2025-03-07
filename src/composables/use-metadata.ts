import type { MetadataOptions } from '@/types/MetadataOptions'

import { useHead } from '@vueuse/head'

const DEFAULT_AUTHOR = {
  name: 'pyyupsk',
  url: 'https://passgen.pyyupsk.vercel.app',
}
const TWITTER_HANDLE = '@pyyupsk_'
const DEFAULT_IMAGE_DIMENSIONS = { height: 630, width: 1200 }

export const useMetadata = ({ title, description, image }: MetadataOptions) => {
  const imageMeta = image
    ? [
        { property: 'og:image', content: image },
        { property: 'og:image:alt', content: title },
        { property: 'og:image:width', content: String(DEFAULT_IMAGE_DIMENSIONS.width) },
        { property: 'og:image:height', content: String(DEFAULT_IMAGE_DIMENSIONS.height) },
        { name: 'twitter:image', content: image },
      ]
    : []

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'author', content: DEFAULT_AUTHOR.name },
      { name: 'publisher', content: DEFAULT_AUTHOR.name },
      { property: 'og:description', content: description },
      { property: 'og:site_name', content: title },
      { property: 'og:title', content: title },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: TWITTER_HANDLE },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      ...imageMeta,
    ],
    link: [
      {
        rel: 'icon',
        href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 100 100"><text y=".90em" font-size="90">🔑</text></svg>',
      },
    ],
  })
}
