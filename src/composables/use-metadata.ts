import { useHead, useSeoMeta } from '@vueuse/head'

import type { MetadataOptions } from '@/types/MetadataOptions'

const AUTHOR = 'pyyupsk'
const TWITTER_HANDLE = '@pyyupsk_'
const DEFAULT_IMAGE_DIMENSIONS = { height: 630, width: 1200 }

export const useMetadata = ({ title, description, image }: MetadataOptions) => {
  const imageMeta = image
    ? [
        {
          url: image,
          width: DEFAULT_IMAGE_DIMENSIONS.width,
          height: DEFAULT_IMAGE_DIMENSIONS.height,
          alt: title,
        },
      ]
    : undefined

  useSeoMeta({
    title,
    description,
    ogDescription: description,
    ogTitle: title,
    ogImage: imageMeta,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageMeta,
    twitterCreator: TWITTER_HANDLE,
    twitterCard: 'summary_large_image',
    author: AUTHOR,
    publisher: AUTHOR,
  })

  useHead({
    link: [
      {
        rel: 'icon',
        href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 100 100"><text y=".90em" font-size="90">🔑</text></svg>',
      },
    ],
  })
}
