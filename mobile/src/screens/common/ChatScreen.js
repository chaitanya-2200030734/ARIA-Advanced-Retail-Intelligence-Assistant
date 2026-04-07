import { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Audio } from 'expo-av'
import * as Speech from 'expo-speech'
import * as FileSystem from 'expo-file-system'
import { MaterialIcons } from '@expo/vector-icons'
import { useAuth } from '../../hooks/useAuth'
import { sendChatMessage } from '../../services/api'
import getEnvVars from '../../config/constants'

const API_BASE = getEnvVars.apiUrl

// ── Quick questions per role ─────────────────────────────────────────────────
const USER_QUICK = [
  { label: '🛍️ What products are available?', text: 'What products do you have available?' },
  { label: '📦 What is in stock?', text: 'Which items are currently in stock?' },
  { label: '⭐ Best sellers', text: 'What are the best selling products?' },
  { label: '🛒 How do I order?', text: 'How do I add items to cart and place an order?' },
]

const USER_FOLLOWUPS = [
  { label: '🔍 Browse by category', text: 'What categories of products do you have?' },
  { label: '💳 How does checkout work?', text: 'How does the checkout process work?' },
  { label: '📦 Shipping info', text: 'What is the shipping policy?' },
  { label: '🔄 Return policy', text: 'What is the return policy?' },
]

const ADMIN_QUICK = [
  { label: "📊 Today's sales", text: "Give me today's sales summary and revenue." },
  { label: '⚠️ Low stock alerts', text: 'Which products are running low on stock?' },
  { label: '🏆 Top sellers', text: 'Show me the top selling products.' },
  { label: '👥 Customers', text: 'Give me an overview of our customers.' },
]

const ADMIN_FOLLOWUPS = [
  { label: '📉 Inventory report', text: 'Give me a full inventory report.' },
  { label: '🎯 Sales forecast', text: 'Forecast sales for next week.' },
  { label: '💡 Business insights', text: 'What are the key business insights?' },
  { label: '🧾 Recent transactions', text: 'Show me recent sales transactions.' },
]

// ── Component ────────────────────────────────────────────────────────────────
export default function ChatScreen() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'

  const quickQuestions = isAdmin ? ADMIN_QUICK : USER_QUICK
  const followupQuestions = isAdmin ? ADMIN_FOLLOWUPS : USER_FOLLOWUPS

  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const [showInput, setShowInput] = useState(false)

  // Voice state
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recordingRef = useRef(null)
  const listRef = useRef(null)

  const greeting = isAdmin
    ? "Hello! I'm ARIA 👋 Your retail intelligence assistant. I have live access to your store data."
    : "Hi! I'm ARIA 👋 I'm here to help you shop. Ask me about products, prices, or stock."

  useEffect(() => {
    setMessages([{ id: '0', text: greeting, sender: 'aria', timestamp: new Date() }])
  }, [isAdmin])

  useEffect(() => {
    // Scroll to bottom when new message added
    if (listRef.current && messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 100)
    }
  }, [messages])

  // ── Send text message ──────────────────────────────────────────────────────
  const handleSend = async (text) => {
    const msg = (text || inputText).trim()
    if (!msg || loading) return

    setInputText('')
    setShowInput(false)
    const userMsg = { id: Date.now().toString(), text: msg, sender: 'user', timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }))

      const response = await sendChatMessage(msg, history.slice(-10), role || 'user')

      if (response?.reply) {
        const replyText = typeof response.reply === 'object'
          ? JSON.stringify(response.reply)
          : response.reply

        const ariaMsg = { id: (Date.now() + 1).toString(), text: replyText, sender: 'aria', timestamp: new Date() }
        setMessages((prev) => [...prev, ariaMsg])
        setTurnCount((c) => c + 1)

        // Speak ARIA's reply (TTS)
        speakText(replyText)
      } else {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), text: "I couldn't connect. Make sure the backend is running.", sender: 'aria', timestamp: new Date() },
        ])
      }
    } catch {
      Alert.alert('Error', 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  // ── TTS: ARIA speaks ───────────────────────────────────────────────────────
  const speakText = (text) => {
    if (!text || typeof text !== 'string') return
    // Strip any JSON or very long text before speaking
    const plain = text.replace(/[{}"[\]]/g, ' ').slice(0, 300)
    Speech.stop()
    setIsSpeaking(true)
    Speech.speak(plain, {
      language: 'en-IN',
      rate: 0.95,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    })
  }

  const stopSpeaking = () => {
    Speech.stop()
    setIsSpeaking(false)
  }

  // ── Voice recording (STT via Groq Whisper) ────────────────────────────────
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Microphone access is required for voice input.')
        return
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      recordingRef.current = recording
      setIsRecording(true)
    } catch (err) {
      console.error('Failed to start recording:', err)
      Alert.alert('Error', 'Could not start recording')
    }
  }

  const stopRecordingAndTranscribe = async () => {
    if (!recordingRef.current) return
    setIsRecording(false)

    try {
      await recordingRef.current.stopAndUnloadAsync()
      const uri = recordingRef.current.getURI()
      recordingRef.current = null

      if (!uri) {
        Alert.alert('Error', 'Could not access recorded audio')
        return
      }

      // Safely read file as base64 with error handling
      try {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
        
        if (!base64) {
          throw new Error('Failed to encode audio')
        }

        setLoading(true)
        const response = await fetch(`${API_BASE}/api/chat/transcribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64, mimeType: 'audio/m4a' }),
        })

        const data = await response.json()
        if (data?.text?.trim()) {
          handleSend(data.text.trim())
        } else {
          setLoading(false)
          Alert.alert('No speech detected', 'Please try speaking more clearly or use text input.')
        }
      } catch (encodeErr) {
        setLoading(false)
        console.error('Audio encoding error:', encodeErr)
        Alert.alert('Recording Error', 'Could not process audio. Please try typing instead.')
      }
    } catch (err) {
      console.error('Transcription error:', err)
      setLoading(false)
      Alert.alert('Error', 'Voice feature unavailable. Please type your message instead.')
    }
  }

  // ── Render message ─────────────────────────────────────────────────────────
  const currentSuggestions = turnCount === 0 ? quickQuestions : followupQuestions

  const renderMessage = ({ item, index }) => {
    const isUser = item.sender === 'user'
    const isLastAria = !isUser && index === messages.length - 1 && !loading

    return (
      <View>
        <View style={[styles.msgRow, isUser ? styles.userRow : styles.ariaRow]}>
          {!isUser && (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
          )}
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.ariaBubble]}>
            <Text style={[styles.msgText, isUser ? styles.userText : styles.ariaText]}>
              {item.text}
            </Text>
            <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.ariaTimestamp]}>
              {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>

        {/* Quick reply chips after last ARIA message */}
        {isLastAria && (
          <View style={styles.chipsContainer}>
            {currentSuggestions.map((q) => (
              <TouchableOpacity
                key={q.text}
                style={styles.chip}
                onPress={() => handleSend(q.text)}
              >
                <Text style={styles.chipText}>{q.label}</Text>
              </TouchableOpacity>
            ))}
            {!showInput && (
              <TouchableOpacity onPress={() => setShowInput(true)} style={styles.typeOwnBtn}>
                <MaterialIcons name="edit" size={13} color="#8A8278" />
                <Text style={styles.typeOwnText}>Type your own...</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Speaking indicator */}
      {isSpeaking && (
        <TouchableOpacity style={styles.speakingBar} onPress={stopSpeaking}>
          <MaterialIcons name="volume-up" size={16} color="#C97B2E" />
          <Text style={styles.speakingText}>ARIA is speaking... tap to stop</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      {/* Loading dots */}
      {loading && (
        <View style={styles.loadingRow}>
          <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color="#C97B2E" />
          </View>
        </View>
      )}

      {/* Input area */}
      <View style={styles.inputArea}>
        {showInput && (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={isAdmin ? 'Ask about sales, inventory...' : 'Ask about products, prices...'}
              placeholderTextColor="#8A8278"
              value={inputText}
              onChangeText={setInputText}
              editable={!loading}
              multiline
              returnKeyType="send"
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={!inputText.trim() || loading}
              style={[styles.sendBtn, (!inputText.trim() || loading) && styles.disabledBtn]}
            >
              <MaterialIcons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Mic button */}
        <View style={styles.micRow}>
          <TouchableOpacity
            onPress={isRecording ? stopRecordingAndTranscribe : startRecording}
            disabled={loading}
            style={[styles.micBtn, isRecording && styles.micBtnActive]}
          >
            <MaterialIcons
              name={isRecording ? 'stop' : 'mic'}
              size={24}
              color={isRecording ? '#FFFFFF' : '#C97B2E'}
            />
          </TouchableOpacity>
          <Text style={styles.micLabel}>
            {isRecording ? 'Tap to stop & send' : 'Hold mic to speak'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Groq · llama-3.3-70b · Whisper STT</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F2ED' },

  speakingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF4EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomColor: '#D8D2C8',
    borderBottomWidth: 1,
    gap: 8,
  },
  speakingText: { fontSize: 12, color: '#C97B2E', flex: 1 },

  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 4 },

  msgRow: { flexDirection: 'row', marginVertical: 4, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  ariaRow: { justifyContent: 'flex-start' },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C97B2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  avatarText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },

  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  userBubble: { backgroundColor: '#1C1814', borderBottomRightRadius: 4 },
  ariaBubble: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  msgText: { fontSize: 13, lineHeight: 19 },
  userText: { color: '#FFFFFF' },
  ariaText: { color: '#1C1814' },
  timestamp: { fontSize: 10, marginTop: 4, opacity: 0.6 },
  userTimestamp: { color: '#FFFFFF', textAlign: 'right' },
  ariaTimestamp: { color: '#8A8278' },

  // Quick reply chips
  chipsContainer: { marginLeft: 36, marginTop: 8, marginBottom: 4 },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  chipText: { fontSize: 12, color: '#1C1814' },
  typeOwnBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, paddingVertical: 4 },
  typeOwnText: { fontSize: 12, color: '#8A8278' },

  // Loading
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  loadingBubble: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Input
  inputArea: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#D8D2C8',
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F2ED',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#1C1814',
    fontSize: 13,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#1C1814',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: { opacity: 0.4 },

  micRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderColor: '#C97B2E',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  micBtnActive: {
    backgroundColor: '#C97B2E',
    borderColor: '#C97B2E',
  },
  micLabel: { fontSize: 12, color: '#8A8278' },

  footer: {
    backgroundColor: '#EDE9E0',
    paddingVertical: 4,
    alignItems: 'center',
  },
  footerText: { fontSize: 10, color: '#8A8278', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
})
