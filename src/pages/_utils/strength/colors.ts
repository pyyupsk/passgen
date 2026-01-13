export function getStrengthBgColor(score: number): string {
  switch (score) {
    case 0:
      return "bg-red-500";
    case 1:
      return "bg-amber-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-lime-500";
    case 4:
      return "bg-emerald-500";
    default:
      return "bg-red-500";
  }
}

export function getStrengthTextColor(score: number): string {
  switch (score) {
    case 0:
      return "text-red-500";
    case 1:
      return "text-amber-500";
    case 2:
      return "text-yellow-500";
    case 3:
      return "text-lime-500";
    case 4:
      return "text-emerald-500";
    default:
      return "text-red-500";
  }
}
