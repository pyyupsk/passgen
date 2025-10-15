import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import { translations } from '@zxcvbn-ts/language-en'

import type { Strength } from '@/types/Strength'

import { MAX_SCORE } from '@/constants'
import { determineRating } from '@/utils/determine-rating'

zxcvbnOptions.setOptions({
  translations: translations,
})

export const calculateStrength = (password: string): Strength => {
  const { score, crackTimesDisplay } = zxcvbn(password)

  const percentage = (score / MAX_SCORE) * 100
  const rating = determineRating(score)

  return { score, percentage, rating, cracktime: crackTimesDisplay.offlineSlowHashing1e4PerSecond }
}
