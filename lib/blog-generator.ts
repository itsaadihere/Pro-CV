export async function generateBlogPostWithGemini(): Promise<{ title: string; content: string; description: string; primary_keyword: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_key_here' || apiKey.includes('placeholder')) {
    console.warn('⚠️ GEMINI API KEY not set. Cannot generate blog post.');
    return null;
  }

  const prompt = `You are an expert SEO content writer and career coach specializing in the Pakistani and Gulf job markets.
Please write an SEO-optimized blog post to be published on "Sophi - AI CV Builder". 
Your goal is to target a long-tail keyword related to CV writing, ATS optimization, or career advancement in Pakistan/UAE.
The blog should be converting and encourage users to buy the 1500 PKR CV revamp plan.

Include the following sections:
1. Catchy Title
2. Meta Description (max 155 chars)
3. Primary Keyword
4. Content (1500+ words). Use H2 and H3 tags. Add a "Quick Answer" 40-word summary after each H2. Include a TL;DR at the top. Naturally weave in LSI keywords. End with a strong CTA to use Sophi.

Format the output strictly as a JSON object with the following keys:
{
  "title": "...",
  "description": "...",
  "primary_keyword": "...",
  "content": "..." // This should be HTML or Markdown content
}

Do not include any markdown block wrappers like \`\`\`json around the output. Just return the raw JSON string.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
      console.error(`❌ Gemini API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    let textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (textOutput) {
      // Remove any json markdown wrapping if it exists
      textOutput = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(textOutput);
    }
    return null;
  } catch (error) {
    console.error('❌ Error communicating with Gemini API for blog generation:', error);
    return null;
  }
}
