import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useChatHistory, useSendMessage } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'
import { formatDateTime } from '../lib/utils'
import { Send, ArrowLeft } from 'lucide-react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export default function ChatPage() {
  const { threadId } = useParams()
  const { user } = useAuth()
  const { data: history, isLoading, refetch } = useChatHistory(threadId)
  const sendMessage = useSendMessage()
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const bottomRef = useRef(null)
  const stompRef = useRef(null)

  // Seed messages from history
  useEffect(() => {
    if (history?.content) {
      setMessages([...history.content].reverse())
    }
  }, [history])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem('rozgar_token')
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        client.subscribe(`/topic/thread/${threadId}`, (msg) => {
          try {
            const newMsg = JSON.parse(msg.body)
            setMessages(prev => {
              // Avoid duplicates
              if (prev.find(m => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
          } catch {}
        })
      },
      onDisconnect: () => {},
      reconnectDelay: 5000,
    })
    client.activate()
    stompRef.current = client
    return () => client.deactivate()
  }, [threadId])

  async function handleSend(e) {
    e.preventDefault()
    if (!content.trim()) return
    const text = content.trim()
    setContent('')
    try {
      await sendMessage.mutateAsync({ threadId: parseInt(threadId), content: text })
    } catch {}
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col" style={{ height: 'calc(100vh - 130px)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
        <Link to="/chat" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-sm font-semibold text-gray-900">Thread #{threadId}</h1>
          <p className="text-xs text-gray-400">Real-time negotiation chat</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-3xl mb-3">💬</div>
            <p className="text-sm font-medium text-gray-700">Start the conversation</p>
            <p className="text-xs text-gray-500 mt-1">Negotiate price, terms, and delivery directly.</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderUserId === user?.userId
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {!isMe && (
                    <span className="text-2xs text-gray-400 px-1">{msg.senderName}</span>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${isMe
                      ? 'bg-navy-700 text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-900 rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                  <span className="text-2xs text-gray-400 px-1">
                    {formatDateTime(msg.sentAt)}
                    {isMe && (
                      <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>
                    )}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="mt-4 flex gap-2 items-end border-t border-gray-100 pt-4">
        <textarea
          className="input flex-1 resize-none"
          rows={2}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="btn-primary p-2.5 flex-shrink-0 h-fit"
          disabled={!content.trim() || sendMessage.isPending}
        >
          {sendMessage.isPending
            ? <Spinner size="sm" />
            : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  )
}
