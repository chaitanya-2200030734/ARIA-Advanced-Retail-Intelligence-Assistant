import express from 'express'
import Groq from 'groq-sdk'
import { toFile } from 'groq-sdk'

const router = express.Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// POST /api/transcribe
// Body: { audio: base64string, mimeType: 'audio/m4a' }
router.post('/', async (req, res, next) => {
  try {
    const { audio, mimeType = 'audio/m4a' } = req.body

    if (!audio) {
      return res.status(400).json({ error: 'No audio data provided' })
    }

    const buffer = Buffer.from(audio, 'base64')
    const ext = mimeType.includes('mp4') || mimeType.includes('m4a') ? 'm4a' : 'webm'
    const file = await toFile(buffer, `voice.${ext}`, { type: mimeType })

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: 'whisper-large-v3-turbo',
      language: 'en',
    })

    res.json({ text: transcription.text || '' })
  } catch (error) {
    console.error('Transcription error:', error)
    next(error)
  }
})

export default router
