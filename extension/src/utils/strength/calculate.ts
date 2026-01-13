import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommon from "@zxcvbn-ts/language-common";
import * as zxcvbnEn from "@zxcvbn-ts/language-en";

import type { Strength } from "@/types/Strength";

import { MAX_SCORE } from "@/constants";
import { determineRating } from "@/utils/strength/rating";

zxcvbnOptions.setOptions({
  dictionary: {
    ...zxcvbnCommon.dictionary,
    ...zxcvbnEn.dictionary,
  },
  graphs: zxcvbnCommon.adjacencyGraphs,
  translations: zxcvbnEn.translations,
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
