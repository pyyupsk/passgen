import type { CharacterSet } from '@/types/CharacterSet'

import { UPPERCASE, LOWERCASE, NUMBERS, SYMBOLS } from '@/constants'
import { shuffle } from '@/utils/shuffle'

export const generatePassword = (length: number, characters: CharacterSet): string => {
  let charset = ''
  if (characters.uppercase) charset += UPPERCASE
  if (characters.lowercase) charset += LOWERCASE
  if (characters.numbers) charset += NUMBERS
  if (characters.symbols) charset += SYMBOLS

  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  return shuffle(password)
}
