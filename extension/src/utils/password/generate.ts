import type { CharacterSet } from "@/types/CharacterSet";

import {
  LOWERCASE,
  MAX_PASSWORD_LENGTH,
  NUMBERS,
  SYMBOLS,
  UPPERCASE,
} from "@/constants";
import { shuffle } from "@/utils/password/shuffle";

const getRandomChar = (charSet: string): string => {
  const randomValue = new Uint32Array(1);
  crypto.getRandomValues(randomValue);
  return charSet[randomValue[0]! % charSet.length]!; // NOSONAR
};

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

  // Build charset and track enabled sets
  const enabledSets: string[] = [];
  let charset = "";

  if (characters.uppercase) {
    charset += UPPERCASE;
    enabledSets.push(UPPERCASE);
  }
  if (characters.lowercase) {
    charset += LOWERCASE;
    enabledSets.push(LOWERCASE);
  }
  if (characters.numbers) {
    charset += NUMBERS;
    enabledSets.push(NUMBERS);
  }
  if (characters.symbols) {
    charset += SYMBOLS;
    enabledSets.push(SYMBOLS);
  }

  // Validate charset
  if (charset.length === 0) {
    throw new RangeError("At least one character set must be enabled");
  }

  // Validate length can accommodate all enabled sets
  if (length < enabledSets.length) {
    throw new RangeError(
      `Password length must be at least ${enabledSets.length} to include all enabled character sets`,
    );
  }

  // Guarantee at least one character from each enabled set
  const guaranteed: string[] = [];
  for (const charSet of enabledSets) {
    guaranteed.push(getRandomChar(charSet));
  }

  // Generate remaining characters from the combined charset
  const remainingLength = length - guaranteed.length;
  const randomValues = new Uint32Array(remainingLength);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = randomValues[i]! % charset.length; // NOSONAR
    guaranteed.push(charset[randomIndex]!); // NOSONAR
  }

  return shuffle(guaranteed.join(""));
};
