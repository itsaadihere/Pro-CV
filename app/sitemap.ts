import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://joinsophi.com'

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/how-it-works`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/pricing`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/templates`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/contact`, priority: 0.5, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/privacy`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/terms`, priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  let blogPages: any[] = [];
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('published', true)

      if (posts) {
        blogPages = posts.map(post => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at),
          priority: 0.7,
          changeFrequency: 'weekly' as const
        }))
      }
    }
  } catch (err) {
    console.error("Failed to fetch blog posts for sitemap", err);
  }

  return [...staticPages, ...blogPages]
}
