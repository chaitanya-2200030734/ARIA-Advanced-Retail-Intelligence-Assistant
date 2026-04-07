import { Mic } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

export default function VoiceButton({ onTranscript, disabled }) {
  const [isRecording, setIsRecording] = useState(false)
  const srRef = useRef(null)

  const handleVoiceClick = () => {
    if (isRecording) {
      srRef.current?.stop()
      return
    }

    const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SRClass) {
      toast.error('Voice requires Chrome or Edge browser')
      return
    }

    const sr = new SRClass()
    sr.lang = 'en-IN'
    sr.continuous = false
    sr.interimResults = false

    sr.onstart = () => setIsRecording(true)

    sr.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onTranscript(transcript)
    }

    sr.onend = () => setIsRecording(false)

    sr.onerror = () => {
      setIsRecording(false)
      toast.error('Microphone error — please try again')
    }

    srRef.current = sr
    sr.start()
  }

  return (
    <button
      onClick={handleVoiceClick}
      disabled={disabled}
      className={`w-9 h-9 flex items-center justify-center rounded-lg transition ${
        isRecording
          ? 'bg-rust text-white mic-pulse'
          : 'bg-cream-dark text-stone hover:text-ink disabled:opacity-50'
      }`}
    >
      <Mic size={18} />
    </button>
  )
}
