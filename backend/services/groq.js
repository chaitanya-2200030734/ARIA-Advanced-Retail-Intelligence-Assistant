import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const PRIMARY_MODEL = 'llama-3.3-70b-versatile'
const FALLBACK_MODEL = 'llama-3.1-8b-instant'

export async function sendMessage(systemPrompt, userMessage, history = []) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ]

  // Try primary model first, fall back to smaller model on rate limit
  for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    try {
      const response = await groq.chat.completions.create({
        model,
        max_tokens: 300,
        temperature: 0.3,
        messages,
      })
      return response.choices[0].message.content
    } catch (error) {
      const isRateLimit = error?.status === 429
      if (isRateLimit && model === PRIMARY_MODEL) {
        console.warn(`[Groq] ${PRIMARY_MODEL} rate limited — switching to ${FALLBACK_MODEL}`)
        continue
      }
      console.error('Groq API error:', error)
      throw error
    }
  }
}
