export async function generateBlogPostWithGemini(): Promise<{ title: string; content: string; description: string; primary_keyword: string; featured_image_keyword?: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_key_here' || apiKey.includes('placeholder')) {
    console.warn('⚠️ GEMINI API KEY not set. Cannot generate blog post.');
    return null;
  }

  const prompt = `You are an expert SEO content writer and career coach specializing in the Pakistani and Gulf job markets.
Please write an extremely comprehensive, in-depth, and SEO-optimized blog post to be published on "Sophi - AI CV Builder". 
Your goal is to target a long-tail keyword related to CV writing, ATS optimization, or career advancement in Pakistan/UAE.
The blog should be highly converting and strongly encourage users to buy the 1500 PKR CV revamp plan.

Include the following sections:
1. Catchy Title
2. Meta Description (max 155 chars)
3. Primary Keyword
4. Content (Minimum 3000-4000 words). This must be a massively detailed guide. 
IMPORTANT HEADING FORMATTING: All major section headers MUST be wrapped in proper semantic <h2> tags (e.g. <h2>1. Master the Art of Keyword Density</h2>). Subsections must use <h3> tags. Never place section titles in plain paragraph <p> or <strong> tags. Add a "Quick Answer: ..." 40-word summary after each H2 section. Include a TL;DR at the top. Naturally weave in LSI keywords. End with a strong CTA to use Sophi.
5. Featured Image Keyword (1-2 words, e.g., "office,resume" or "interview,success")
6. Inline Image Keyword (1-2 words, e.g., "career,laptop" or "hiring,manager")

Crucially, in the exact middle of your HTML content, you MUST embed an inline image using this exact format:
<img src="https://loremflickr.com/800/400/[Inline Image Keyword]?random=1" alt="Relevant career illustration" class="w-full h-auto rounded-3xl my-10 shadow-sm object-cover" />

Format the output strictly as a JSON object with the following keys:
{
  "title": "...",
  "description": "...",
  "primary_keyword": "...",
  "featured_image_keyword": "...",
  "content": "..." // This must be proper HTML content, very long, and include the inline image
}

Do not include any markdown block wrappers like \`\`\`json around the output. Just return the raw JSON string.`;

  try {
    let response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 },
        }),
      }
    );

    if (!response.ok) {
      console.warn(`⚠️ gemini-1.5-flash returned ${response.status}, retrying with gemini-2.0-flash...`);
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7 },
          }),
        }
      );
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ Gemini API error: ${response.status} - ${errText}`);
      return null;
    }

    const data = await response.json();
    let textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (textOutput) {
      // Clean up markdown block wrappers and leading/trailing whitespace
      textOutput = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(textOutput);
    }
    return null;
  } catch (error) {
    console.error('❌ Error communicating with Gemini API for blog generation:', error);
    return null;
  }
}
