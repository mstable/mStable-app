export const getKeyTimestamp = (key: string): number => {
  const [, splitKey] = key.split('t')
  return parseInt(splitKey, 10)
}
