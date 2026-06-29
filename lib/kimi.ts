export async function generateKimiCompletion(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.KIMI_API_KEY
  const apiBase = process.env.KIMI_API_BASE || 'https://api.moonshot.cn/v1'

  if (!apiKey) {
    throw new Error('KIMI_API_KEY is not configured in .env.local')
  }

  const response = await fetch(`${apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'moonshot-v1-32k',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 8000,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Kimi API Error Response:', errorText)
    throw new Error(`Kimi API failed with status ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  if (!data.choices || data.choices.length === 0) {
    throw new Error('Kimi API returned an empty completion response')
  }

  return data.choices[0].message.content
}
