import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { sendChatMessage } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import VoiceButton from './VoiceButton'

// ── Home page (landing) — general ARIA platform questions
const HOME_QUICK_QUESTIONS = [
  { label: '🤖 What is ARIA?', text: 'What is ARIA and what does it do?' },
  { label: '🛒 How does it help shoppers?', text: 'How does ARIA help shoppers find products?' },
  { label: '📊 What features does ARIA have?', text: 'What features does the ARIA platform offer?' },
  { label: '🔐 How do I sign up?', text: 'How do I create an account on ARIA?' },
  { label: '🏪 Can I use it for my store?', text: 'Can store owners use ARIA for their shop?' },
]

const HOME_FOLLOWUPS = [
  { label: '💰 Is it free?', text: 'Is ARIA free to use?' },
  { label: '📱 Is there a mobile app?', text: 'Is there a mobile app for ARIA?' },
  { label: '🔒 Is my data safe?', text: 'How does ARIA keep my store data safe?' },
  { label: '🎯 How accurate is ARIA?', text: 'How accurate are ARIA\'s answers and insights?' },
]

// ── Shop owner questions
const SHOPOWNER_QUICK_QUESTIONS = [
  { label: '➕ How do I add products?', text: 'How do I add new products to my shop?' },
  { label: '📦 How does inventory work?', text: 'How does inventory tracking work for my shop?' },
  { label: '📈 Can I see my sales?', text: 'How do I view my shop sales and performance?' },
  { label: '✏️ Can I edit my products?', text: 'How do I edit or remove my products?' },
  { label: '👥 Who sees my products?', text: 'Which customers can see and buy my products?' },
]

const SHOPOWNER_FOLLOWUPS = [
  { label: '📸 Can I add product images?', text: 'Can I add images to my products?' },
  { label: '🏷️ How do I set prices?', text: 'How do I set and update product prices?' },
  { label: '📊 How do I track orders?', text: 'How do I track orders placed for my shop?' },
  { label: '🤝 Who manages the platform?', text: 'Who is the platform admin and what do they control?' },
]

// ── User (logged-in shopper) questions
const USER_QUICK_QUESTIONS = [
  { label: '🛍️ What products are available?', text: 'What products do you have available for me to buy?' },
  { label: '📦 What is in stock right now?', text: 'Which items are currently in stock?' },
  { label: '⭐ What are your best sellers?', text: 'What are the best selling products?' },
  { label: '🛒 How do I place an order?', text: 'How do I add items to cart and place an order?' },
  { label: '💰 Any deals or discounts?', text: 'Are there any deals or discounts available?' },
]

const USER_FOLLOWUPS = [
  { label: '🔍 Search by category', text: 'What categories of products do you have?' },
  { label: '💳 How does checkout work?', text: 'How does the checkout process work?' },
  { label: '📦 Tell me about shipping', text: 'What is the shipping policy?' },
  { label: '🔄 Return policy', text: 'What is the return or refund policy?' },
]

// ── Admin questions
const ADMIN_QUICK_QUESTIONS = [
  { label: '📊 Today\'s sales summary', text: 'Give me today\'s sales summary and revenue.' },
  { label: '⚠️ Low stock alerts', text: 'Which products are running low on stock?' },
  { label: '🏆 Top selling products', text: 'Show me the top selling products by revenue.' },
  { label: '👥 Customer overview', text: 'Give me an overview of our customers.' },
  { label: '📈 Revenue trends', text: 'What are the revenue trends for the last 30 days?' },
]

const ADMIN_FOLLOWUPS = [
  { label: '📉 Inventory report', text: 'Give me a full inventory report with stock levels.' },
  { label: '🎯 Sales forecast', text: 'Forecast sales for the next week based on recent trends.' },
  { label: '💡 Business insights', text: 'What are the key business insights and recommendations?' },
  { label: '🧾 Recent transactions', text: 'Show me the most recent sales transactions.' },
]

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

// pageContext: 'home' | 'shopowner' | undefined (auto-detects from role)
export default function Chatbot({ pageContext }) {
  const { role } = useAuth()

  // Determine effective context
  const context = pageContext || (role === 'admin' ? 'admin' : 'user')

  const greetingMap = {
    home: "Hi! I'm ARIA 👋 I can answer questions about this platform. What would you like to know?",
    shopowner: "Hi! I'm ARIA 👋 I'm here to help you manage your shop. What do you need help with?",
    admin: "Hello! I'm ARIA 👋 Your retail intelligence assistant. I have live access to your store data. What would you like to know?",
    user: "Hi! I'm ARIA 👋 I'm here to help you shop. Ask me about products, prices, or stock. What are you looking for?",
  }

  const quickMap = {
    home: HOME_QUICK_QUESTIONS,
    shopowner: SHOPOWNER_QUICK_QUESTIONS,
    admin: ADMIN_QUICK_QUESTIONS,
    user: USER_QUICK_QUESTIONS,
  }

  const followupMap = {
    home: HOME_FOLLOWUPS,
    shopowner: SHOPOWNER_FOLLOWUPS,
    admin: ADMIN_FOLLOWUPS,
    user: USER_FOLLOWUPS,
  }

  const labelMap = {
    home: 'General Assistant',
    shopowner: 'Shop Assistant',
    admin: 'Retail Intelligence · Admin',
    user: 'Shopping Assistant',
  }

  const tooltipMap = {
    home: 'Ask ARIA',
    shopowner: 'Ask ARIA (Shop)',
    admin: 'Ask ARIA (Admin)',
    user: 'Ask ARIA',
  }

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: 1, role: 'bot', content: greetingMap[context], timestamp: new Date(), showQuickReplies: true }])
    }
  }, [isOpen, context])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (showInput && inputRef.current) inputRef.current.focus()
  }, [showInput])

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return

    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsLoading(true)

    const historyForApi = messages.map((m) => ({ role: m.role, content: m.content }))
    // Send the effective context as the role so backend uses correct system prompt
    const response = await sendChatMessage(text, historyForApi.slice(-10), context)

    if (response) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', content: response.reply, timestamp: new Date(), showQuickReplies: true },
      ])
      setTurnCount((c) => c + 1)
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          content: "I'm having trouble connecting. Make sure the backend is running.",
          timestamp: new Date(),
        },
      ])
    }

    setIsLoading(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setMessages([])
    setShowInput(false)
    setTurnCount(0)
  }

  const currentSuggestions = turnCount === 0 ? quickMap[context] : followupMap[context]

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-ink rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center text-white z-[100] group"
          aria-label="Open ARIA chat"
        >
          <MessageCircle size={22} />
          <span className="absolute top-1 right-1 w-3 h-3 bg-amber rounded-full animate-pulse" />
          <span className="absolute bottom-full right-0 mb-2 bg-ink text-cream text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg">
            {tooltipMap[context]}
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed bottom-6 right-6 w-[360px] bg-white rounded-2xl shadow-2xl flex flex-col z-[100] border border-border overflow-hidden"
          style={{ maxHeight: '560px', minHeight: '400px' }}
        >
          {/* Header */}
          <div className="bg-ink px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber flex items-center justify-center flex-shrink-0">
                <MessageCircle size={18} className="text-ink" />
              </div>
              <div>
                <p className="font-fraunces text-amber italic text-base leading-none">ARIA</p>
                <p className="text-xs text-stone mt-0.5">{labelMap[context]}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-lg transition text-cream"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream/20" style={{ minHeight: 0 }}>
            {messages.map((msg, idx) => {
              const isLastBot = msg.role === 'bot' && idx === messages.length - 1 && !isLoading
              return (
                <div key={msg.id}>
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-amber flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <MessageCircle size={13} className="text-ink" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-ink text-cream rounded-br-sm'
                          : 'bg-white text-ink rounded-bl-sm shadow-sm border border-border/60'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{typeof msg.content === 'object' ? JSON.stringify(msg.content) : msg.content}</p>
                      <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-cream/50 text-right' : 'text-stone'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>

                  {msg.showQuickReplies && isLastBot && (
                    <div className="mt-3 ml-9 space-y-1.5">
                      {currentSuggestions.map((q) => (
                        <button
                          key={q.text}
                          onClick={() => sendMessage(q.text)}
                          className="w-full text-left px-3 py-2 bg-white border border-border hover:border-amber hover:bg-amber/5 text-ink text-xs rounded-xl transition-all leading-snug"
                        >
                          {q.label}
                        </button>
                      ))}
                      {!showInput && (
                        <button
                          onClick={() => setShowInput(true)}
                          className="text-xs text-stone hover:text-amber transition pt-1 pl-1"
                        >
                          ✏️ Type your own question...
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-amber flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={13} className="text-ink" />
                </div>
                <div className="bg-white border border-border/60 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 shadow-sm">
                  <span className="w-2 h-2 bg-amber rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-amber rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-amber rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showInput && (
            <div className="border-t border-border p-3 bg-white flex items-center gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(inputText)}
                placeholder={context === 'admin' ? 'Ask about sales, inventory...' : 'Type a question...'}
                className="flex-1 bg-cream border border-border outline-none px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-amber focus:border-transparent"
                disabled={isLoading}
              />
              <VoiceButton
                onTranscript={(transcript) => {
                  setInputText(transcript)
                  setShowInput(true)
                }}
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="w-9 h-9 bg-ink text-cream flex items-center justify-center rounded-lg hover:bg-amber disabled:opacity-40 transition flex-shrink-0"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          )}

          <div className="px-4 py-1.5 bg-ink/5 border-t border-border flex-shrink-0">
            <p className="text-[10px] text-stone text-center font-mono">Powered by Groq · llama-3.3-70b</p>
          </div>
        </div>
      )}
    </>
  )
}
