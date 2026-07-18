import React from 'react';
import Header from '@/components/Header';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { blogPostSchema } from '@/lib/schema';
import { ArrowLeft, ChevronRight, MessageCircle } from 'lucide-react';

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

            <div className="mt-12 pt-8 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Share this article</h4>
              <div className="flex gap-4">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=https://joinsophi.com/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                </a>
                <a href={`https://twitter.com/intent/tweet?url=https://joinsophi.com/blog/${post.slug}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-sky-50 hover:text-sky-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                </a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=https://joinsophi.com/blog/${post.slug}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' https://joinsophi.com/blog/' + post.slug)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
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
