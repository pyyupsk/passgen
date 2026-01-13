import { ref } from "vue";

import type { CharacterSet } from "@/types/CharacterSet";
import type { Strength } from "@/types/Strength";

import {
  DEFAULT_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "@/constants";
import { generatePassword } from "@/utils/password/generate";
import { calculateStrength } from "@/utils/strength/calculate";

const DEFAULT_CHARACTER_SET: CharacterSet = {
  lowercase: true,
  numbers: true,
  symbols: true,
  uppercase: true,
};

const hasEnabledCharacterSet = (chars: CharacterSet): boolean => {
  return chars.lowercase || chars.uppercase || chars.numbers || chars.symbols;
};

const isValidLength = (len: number): boolean => {
  return (
    Number.isInteger(len) &&
    len >= MIN_PASSWORD_LENGTH &&
    len <= MAX_PASSWORD_LENGTH
  );
};

export const usePasswordGenerator = () => {
  const password = ref("");
  const strength = ref<null | Strength>(null);
  const error = ref<null | string>(null);
  const length = ref(DEFAULT_PASSWORD_LENGTH);
  const characters = ref<CharacterSet>({ ...DEFAULT_CHARACTER_SET });

  const generate = (): void => {
    error.value = null;

    if (!hasEnabledCharacterSet(characters.value)) {
      error.value = "At least one character set must be enabled";
      return;
    }

    if (!isValidLength(length.value)) {
      error.value = `Password length must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}`;
      return;
    }

    try {
      password.value = generatePassword(length.value, characters.value);
      strength.value = calculateStrength(password.value);
    } catch (e) {
      error.value = String(e) || "Password generation error";
      password.value = "";
      strength.value = null;
    }
  };

  const regenerate = (): void => {
    generate();
  };

  // Generate initial password
  generate();

  return {
    characters,
    error,
    generate,
    length,
    password,
    regenerate,
    strength,
  };
};
