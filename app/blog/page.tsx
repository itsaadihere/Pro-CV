import React from 'react';
import Header from '@/components/Header';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Revalidate this page every hour
export const revalidate = 3600;

export default async function BlogIndexPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  let posts: any[] = [];
  
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, meta_description, published_at, author_name, featured_image')
      .eq('published', true)
      .order('published_at', { ascending: false });
    
    if (data) posts = data;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Career & CV Tips Blog
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Expert career advice on ATS optimization, AI resume writing, LinkedIn profiles, cover letters, and job search strategies for Pakistani and Gulf professionals.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              {post.featured_image ? (
                <div className="aspect-video w-full overflow-hidden bg-slate-100">
                  <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-tr from-primary-50 to-gold-50 flex items-center justify-center p-6 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-primary-900 text-center line-clamp-3">{post.title}</h3>
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
                  {post.meta_description}
                </p>
                <div className="flex items-center justify-between text-sm font-medium text-slate-500 mt-auto">
                  <span>By {post.author_name}</span>
                  <span className="text-primary group-hover:translate-x-1 transition-transform">Read more →</span>
                </div>
              </div>
            </Link>
          ))}

          {posts.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              <p>No blog posts published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
