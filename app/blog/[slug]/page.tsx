import React from 'react';
import Header from '@/components/Header';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { blogPostSchema } from '@/lib/schema';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export const revalidate = 3600;

async function getPost(slug: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
    
  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | Sophi Blog`,
    description: post.meta_description,
    openGraph: {
      title: post.title,
      description: post.meta_description,
      type: 'article',
      authors: [post.author_name],
      publishedTime: post.published_at,
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const schema = blogPostSchema({
    title: post.title,
    description: post.meta_description,
    slug: post.slug,
    publishedAt: post.published_at,
    updatedAt: post.updated_at,
    authorName: post.author_name,
    imageUrl: post.featured_image || 'https://joinsophi.com/logo.png',
    wordCount: post.word_count
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Script
        id={`schema-article-${post.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-800 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <article className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {post.featured_image && (
            <img src={post.featured_image} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
          )}
          
          <div className="p-8 md:p-12">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
              {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-3 mb-10 pb-10 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary">
                {post.author_name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">{post.author_name}</div>
                <div className="text-slate-500 text-xs">Career Expert</div>
              </div>
            </div>

            <div 
              className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        <div className="mt-12 bg-primary-50 rounded-2xl p-8 border border-primary-100 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Does your CV pass the ATS test?</h3>
          <p className="text-slate-600 mb-6">
            Upload your CV to Sophi and let our AI optimize it with the exact keywords recruiters are looking for.
          </p>
          <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white bg-primary rounded-xl hover:bg-primary-800 transition-colors shadow-md">
            Revamp My CV — 1500 PKR <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
