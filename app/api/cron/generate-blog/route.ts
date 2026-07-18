import { NextResponse } from 'next/server';
import { generateBlogPostWithGemini } from '@/lib/blog-generator';
import { createClient } from '@supabase/supabase-js';
import { notifyIndexNow } from '@/lib/indexNow';

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const blogData = await generateBlogPostWithGemini();
    
    if (!blogData) {
      return NextResponse.json({ error: 'Failed to generate blog content' }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate a URL-friendly slug
    const slug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { data, error } = await supabase.from('blog_posts').insert([
      {
        slug,
        title: blogData.title,
        meta_description: blogData.description,
        content: blogData.content,
        primary_keyword: blogData.primary_keyword,
        word_count: blogData.content.split(/\s+/).length,
        published: true,
        published_at: new Date().toISOString()
      }
    ]).select();

    if (error) {
      console.error('Error inserting blog post:', error);
      return NextResponse.json({ error: 'Database insert failed' }, { status: 500 });
    }

    // Notify Bing via IndexNow
    const blogUrl = `https://joinsophi.com/blog/${slug}`;
    await notifyIndexNow([blogUrl]).catch(e => console.error('IndexNow error:', e));

    return NextResponse.json({ success: true, post: data[0] });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
