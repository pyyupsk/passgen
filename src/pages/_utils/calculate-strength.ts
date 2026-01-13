import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import { translations } from "@zxcvbn-ts/language-en";

import type { Strength } from "@/pages/_types/Strength";

import { MAX_SCORE } from "@/pages/_constants";
import { determineRating } from "@/pages/_utils/determine-rating";

zxcvbnOptions.setOptions({
  translations: translations,
});

export const calculateStrength = (password: string): Strength => {
  const { crackTimesDisplay, score } = zxcvbn(password);

  const percentage = (score / MAX_SCORE) * 100;
  const rating = determineRating(score);

  return {
    cracktime: crackTimesDisplay.offlineSlowHashing1e4PerSecond,
    percentage,
    rating,
    score,
  };
};
