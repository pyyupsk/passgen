import { ref } from "vue";

import type { CharacterSet } from "@/types/CharacterSet";
import type { Strength } from "@/types/Strength";

import { DEFAULT_PASSWORD_LENGTH } from "@/constants";
import { generatePassword } from "@/utils/password/generate";
import { calculateStrength } from "@/utils/strength/calculate";

const DEFAULT_CHARACTER_SET: CharacterSet = {
  lowercase: true,
  numbers: true,
  symbols: true,
  uppercase: true,
};

export const usePasswordGenerator = () => {
  const password = ref("");
  const strength = ref<null | Strength>(null);
  const length = ref(DEFAULT_PASSWORD_LENGTH);
  const characters = ref<CharacterSet>({ ...DEFAULT_CHARACTER_SET });

  const generate = (): void => {
    password.value = generatePassword(length.value, characters.value);
    strength.value = calculateStrength(password.value);
  };

  const regenerate = (): void => {
    generate();
  };

  // Generate initial password
  generate();

  return {
    characters,
    generate,
    length,
    password,
    regenerate,
    strength,
  };
};
