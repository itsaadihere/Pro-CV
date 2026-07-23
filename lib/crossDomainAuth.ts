// /lib/crossDomainAuth.ts
// Utility to attach single sign-on parameters when jumping from CV Builder to Career Portal

export function generateCrossdomainLink(destination: string, session: any): string {
  if (!session?.access_token) return destination

  try {
    const url = new URL(destination)
    url.searchParams.set('sso_token', session.access_token)
    if (session.refresh_token) {
      url.searchParams.set('sso_refresh', session.refresh_token)
    }
    return url.toString()
  } catch (err) {
    return destination
  }
}
