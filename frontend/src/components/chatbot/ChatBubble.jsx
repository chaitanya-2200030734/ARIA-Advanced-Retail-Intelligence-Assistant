import InlineChart from './InlineChart'

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user'
  const isChart = typeof message.content === 'object' && message.content?.type === 'chart'

  if (isChart) {
    return (
      <div className="flex justify-start">
        <InlineChart {...message.content} />
      </div>
    )
  }

  const time = new Date(message.timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs px-4 py-2 rounded-2xl ${
        isUser
          ? 'bg-ink text-cream rounded-br-none'
          : 'bg-cream-dark text-ink rounded-tl-none'
      }`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className={`text-xs mt-1 font-mono ${isUser ? 'text-cream/60' : 'text-stone'}`}>
          {time}
        </p>
      </div>
    </div>
  )
}
