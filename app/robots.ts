import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/upload/',
          '/result/',
          '/payment/',
          '/api/',
          '/cv-render/',
        ]
      },
      {
        userAgent: 'GPTBot',
        allow: '/'
      },
      {
        userAgent: 'Google-Extended',
        allow: '/'
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/'
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/'
      }
    ],
    sitemap: 'https://joinsophi.com/sitemap.xml',
    host: 'https://joinsophi.com'
  }
}
