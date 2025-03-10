import type { Rating } from '@/types/Rating'

export const determineRating = (score: number): Rating => {
  switch (score) {
    case 0:
      return 'Very weak'
    case 1:
      return 'Weak'
    case 2:
      return 'Medium'
    case 3:
      return 'Strong'
    case 4:
      return 'Very strong'
    default:
      return 'Unknown'
  }
}
