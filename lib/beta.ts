export const isBetaMode = (): boolean => {
  return false // Beta has ended
}

export const getBetaEndDate = (): Date => {
  return new Date('2024-01-01')
}

export const isBetaExpired = (): boolean => {
  return true
}

export const isBetaActive = (): boolean => {
  return false
}
