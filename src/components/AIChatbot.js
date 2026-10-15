'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Sparkles, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react'

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'init',
      sender: 'bot',
      text: 'Salam! Welcome to ORBIT-I. Main ORBIT-I ka official factual AI assistant hoon. Main aap ki service inquiries, internship applications, certificate verification, aur offices ke baray mein help kar sakta hoon. Poochiye!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [botConfig, setBotConfig] = useState({ enabled: true, bot_name: 'ORBIT-I AI Assistant' })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetch('/api/chatbot/config')
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg && typeof cfg.enabled === 'boolean') {
          setBotConfig(cfg)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isTyping])

  if (!botConfig.enabled) return null

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputText
    if (!textToSend.trim() || isTyping) return

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!queryText) setInputText('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend.trim() }),
      })
      const data = await res.json()

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.answer || 'Maazrat, jawab daryaft nahi ho saka. Barah-e-karam contact@orbit-i.tech par rabta karein.',
        actionLink: data.actionLink,
        actionText: data.actionText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Network issue. Barah-e-karam hamare official contact page se direct rabta karein.',
          actionLink: '/contact',
          actionText: 'Contact ORBIT-I',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const QUICK_PROMPTS = [
    { label: '🔍 Verify Certificate', query: 'Internship Certificate verify kaise karein?' },
    { label: '💼 Open Internships', query: 'Kya internships available hain aur kaise apply karein?' },
    { label: '⚡ Enterprise AI Services', query: 'ORBIT-I konsi enterprise services aur tech stack offer karta hai?' },
    { label: '📍 Offices & Locations', query: 'Nawabshah, Karachi aur Hyderabad office kahan hain?' },
  ]

  return (
    <>
      <style>{`
        .orbit-chatbot-toggle {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #3b82f6);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4), 0 0 15px rgba(59, 130, 246, 0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .orbit-chatbot-toggle:hover {
          transform: scale(1.08);
          box-shadow: 0 14px 35px rgba(99, 102, 241, 0.6);
        }
        .orbit-chatbot-window {
          position: fixed;
          bottom: 92px;
          right: 24px;
          z-index: 9999;
          width: 380px;
          max-width: calc(100vw - 32px);
          height: 540px;
          max-height: calc(100vh - 120px);
          background: rgba(13, 17, 23, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 20px rgba(99, 102, 241, 0.2);
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }
        .chat-header {
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .chat-body {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-bubble {
          max-width: 82%;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.5;
          word-break: break-word;
        }
        .chat-bubble-user {
          align-self: flex-end;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }
        .chat-bubble-bot {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          border-bottom-left-radius: 4px;
        }
        .quick-prompt-btn {
          font-size: 11px;
          padding: 5px 10px;
          border-radius: 100px;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.25);
          color: #a5b4fc;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
        }
        .quick-prompt-btn:hover {
          background: rgba(99, 102, 241, 0.25);
          color: #fff;
        }
      `}</style>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="orbit-chatbot-toggle"
        aria-label="Toggle ORBIT-I AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #0d1117',
            }}
          />
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="orbit-chatbot-window"
          >
            {/* Header */}
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.2)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={16} color="#818cf8" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{botConfig.bot_name || 'ORBIT-I AI Assistant'}</span>
                    <span style={{ fontSize: 9, background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '1px 5px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                      <ShieldCheck size={9} /> Verified
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>Factual & Grounded Knowledge</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: 'reset',
                        sender: 'bot',
                        text: 'Salam! Chat reset ho gayi hai. Aap service inquiries, verification, ya internships ke baray mein sawal pooch sakte hain.',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ])
                  }
                  title="Clear chat"
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Quick Prompts Bar */}
            <div
              style={{
                padding: '8px 12px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                gap: 6,
                overflowX: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleSend(p.query)}
                  className="quick-prompt-btn"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div className="chat-body">
              {messages.map((m) => (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div className={`chat-bubble ${m.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                    <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{m.text}</p>
                    {m.actionLink && (
                      <div style={{ marginTop: 8 }}>
                        <Link
                          href={m.actionLink}
                          onClick={() => setIsOpen(false)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            background: '#6366f1',
                            color: '#fff',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          <span>{m.actionText || 'Explore'}</span>
                          <ExternalLink size={10} />
                        </Link>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 9, color: '#64748b', marginTop: 3, padding: '0 4px' }}>{m.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="chat-bubble chat-bubble-bot" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '8px 14px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', animation: 'pulse 1s infinite' }} />
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', animation: 'pulse 1s infinite 0.2s' }} />
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', animation: 'pulse 1s infinite 0.4s' }} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              style={{
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <input
                type="text"
                placeholder="Ask ORBIT-I factual assistant..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 10,
                  padding: '9px 12px',
                  color: '#f8fafc',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: inputText.trim() ? '#6366f1' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputText.trim() ? 'pointer' : 'default',
                  transition: 'background 0.15s',
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
