const ratingLabels = [
  "Extremely Weak",
  "Weak",
  "Moderate",
  "Strong",
  "Very Strong",
];

export const determineRating = (score: number): string => {
  return ratingLabels[score] ?? "Unknown";
};
