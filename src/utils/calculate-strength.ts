import type { Strength } from '@/types/Strength'

import { MAX_SCORE } from '@/constants'
import { determineRating } from '@/utils/determine-rating'
import { zxcvbn } from '@zxcvbn-ts/core'

export const calculateStrength = (password: string): Strength => {
  const { score, crackTimesDisplay } = zxcvbn(password)

  const percentage = (score / MAX_SCORE) * 100
  const rating = determineRating(score)

  return { percentage, rating, cracktime: crackTimesDisplay.onlineNoThrottling10PerSecond }
}
