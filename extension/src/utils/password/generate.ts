import type { CharacterSet } from "@/types/CharacterSet";

import { LOWERCASE, NUMBERS, SYMBOLS, UPPERCASE } from "@/constants";
import { shuffle } from "@/utils/password/shuffle";

export const generatePassword = (
  length: number,
  characters: CharacterSet,
): string => {
  let charset = "";
  if (characters.uppercase) charset += UPPERCASE;
  if (characters.lowercase) charset += LOWERCASE;
  if (characters.numbers) charset += NUMBERS;
  if (characters.symbols) charset += SYMBOLS;

  let password = "";

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    const randomIndex = randomValues[i]! % charset.length;
    password += charset[randomIndex];
  }

  return shuffle(password);
};
