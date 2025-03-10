export const shuffle = (password: string): string => {
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}
