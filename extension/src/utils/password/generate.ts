import type { CharacterSet } from "@/types/CharacterSet";

import {
  LOWERCASE,
  MAX_PASSWORD_LENGTH,
  NUMBERS,
  SYMBOLS,
  UPPERCASE,
} from "@/constants";
import { shuffle } from "@/utils/password/shuffle";

export const generatePassword = (
  length: number,
  characters: CharacterSet,
): string => {
  // Validate length
  if (!Number.isInteger(length) || length <= 0) {
    throw new RangeError("Password length must be a positive integer");
  }
  if (length > MAX_PASSWORD_LENGTH) {
    throw new RangeError(
      `Password length must not exceed ${MAX_PASSWORD_LENGTH}`,
    );
  }

  let charset = "";
  if (characters.uppercase) charset += UPPERCASE;
  if (characters.lowercase) charset += LOWERCASE;
  if (characters.numbers) charset += NUMBERS;
  if (characters.symbols) charset += SYMBOLS;

  // Validate charset
  if (charset.length === 0) {
    throw new RangeError("At least one character set must be enabled");
  }

  let password = "";

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    const randomIndex = randomValues[i]! % charset.length; // NOSONAR
    password += charset[randomIndex];
  }

  return shuffle(password);
};
