export const isBetaMode = (): boolean => {
  return process.env.NEXT_PUBLIC_BETA_MODE === 'true'
}

export const getBetaEndDate = (): Date => {
  return new Date(process.env.NEXT_PUBLIC_BETA_END_DATE || '2099-01-01')
}

export const isBetaExpired = (): boolean => {
  return new Date() > getBetaEndDate()
}

export const isBetaActive = (): boolean => {
  return isBetaMode() && !isBetaExpired()
}
