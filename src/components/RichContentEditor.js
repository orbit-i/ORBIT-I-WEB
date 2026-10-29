'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Video as VideoIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Eye,
  FileCode,
  Sparkles,
  Upload,
  X,
  Check,
  ExternalLink,
  Sliders,
  Type,
  Palette,
  Maximize2,
  HelpCircle,
  FolderPlus,
  Play,
} from 'lucide-react'

export default function RichContentEditor({
  value = '',
  onChange,
  placeholder = 'Write or paste your article content here...',
  minHeight = 420,
}) {
  const [activeTab, setActiveTab] = useState('editor') // 'editor' (Code), 'visual' (WYSIWYG), 'preview'
  const [content, setContent] = useState(value || '')
  const textareaRef = useRef(null)
  const visualRef = useRef(null)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)

  // Modals state
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkForm, setLinkForm] = useState({ text: '', url: '', newTab: true })

  const [showImageModal, setShowImageModal] = useState(false)
  const [imageTab, setImageTab] = useState('upload') // 'upload' | 'url'
  const [imageForm, setImageForm] = useState({
    url: '',
    alt: 'Technical Illustration',
    caption: '',
    size: '100%',
    customWidth: '',
    align: 'center',
    linkUrl: '',
    rounded: true,
  })
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageUploadProgress, setImageUploadProgress] = useState('')

  const [showVideoModal, setShowVideoModal] = useState(false)
  const [videoTab, setVideoTab] = useState('url') // 'upload' | 'url'
  const [videoForm, setVideoForm] = useState({
    url: '',
    title: 'Product Walkthrough',
    size: '100%',
    customWidth: '',
    align: 'center',
    controls: true,
    autoplay: false,
    loop: false,
  })
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [videoUploadProgress, setVideoUploadProgress] = useState('')

  // Sync internal state when prop value changes
  useEffect(() => {
    if (value !== content) {
      setContent(value || '')
      if (visualRef.current && activeTab === 'visual') {
        visualRef.current.innerHTML = value || ''
      }
    }
  }, [value])

  const notifyChange = (newVal) => {
    setContent(newVal)
    if (onChange) onChange(newVal)
  }

  // ─── CODE EDITOR TAG INSERTION & WRAPPING ──────────────────────────────────
  const wrapOrInsertTag = useCallback(
    (openTag, closeTag, defaultPlaceholder = 'Text') => {
      const textarea = textareaRef.current
      if (!textarea) {
        // Fallback if textarea not focused or mounted
        const updated = `${content}\n${openTag}${defaultPlaceholder}${closeTag}`
        notifyChange(updated)
        return
      }

      const start = textarea.selectionStart ?? 0
      const end = textarea.selectionEnd ?? 0
      const selectedText = textarea.value.substring(start, end)
      const textToWrap = selectedText || defaultPlaceholder

      const before = textarea.value.substring(0, start)
      const after = textarea.value.substring(end)
      const replacement = `${openTag}${textToWrap}${closeTag}`
      const newContent = `${before}${replacement}${after}`

      notifyChange(newContent)

      // Reposition cursor
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + openTag.length,
          start + openTag.length + textToWrap.length
        )
      }, 20)
    },
    [content, onChange]
  )

  // ─── VISUAL EDITOR FORMATTING (EXECCOMMAND / DOM) ──────────────────────────
  const execVisualCmd = (command, val = null) => {
    if (activeTab !== 'visual') {
      setActiveTab('visual')
    }
    setTimeout(() => {
      if (visualRef.current) visualRef.current.focus()
      document.execCommand(command, false, val)
      if (visualRef.current) {
        notifyChange(visualRef.current.innerHTML)
      }
    }, 50)
  }

  // Switch between tabs safely
  const handleTabSwitch = (tab) => {
    if (tab === 'visual' && visualRef.current) {
      visualRef.current.innerHTML = content
    }
    setActiveTab(tab)
  }

  // ─── LINK CONVERSION ──────────────────────────────────────────────────────
  const openLinkModal = () => {
    let selText = ''
    if (activeTab === 'editor' && textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      selText = textareaRef.current.value.substring(start, end)
    } else if (typeof window !== 'undefined' && window.getSelection) {
      selText = window.getSelection().toString()
    }
    setLinkForm({
      text: selText || 'Learn More',
      url: '',
      newTab: true,
    })
    setShowLinkModal(true)
  }

  const applyLink = (e) => {
    e.preventDefault()
    if (!linkForm.url.trim()) return

    const targetAttr = linkForm.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
    const linkTag = `<a href="${linkForm.url.trim()}"${targetAttr} style="color:var(--accent,#6366f1);text-decoration:underline;font-weight:600;">${linkForm.text || linkForm.url}</a>`

    if (activeTab === 'editor') {
      const textarea = textareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const before = textarea.value.substring(0, start)
        const after = textarea.value.substring(end)
        notifyChange(`${before}${linkTag}${after}`)
      } else {
        notifyChange(`${content} ${linkTag}`)
      }
    } else if (activeTab === 'visual' && visualRef.current) {
      visualRef.current.focus()
      document.execCommand('insertHTML', false, linkTag)
      notifyChange(visualRef.current.innerHTML)
    } else {
      notifyChange(`${content} ${linkTag}`)
    }

    setShowLinkModal(false)
  }

  // ─── DIRECT IMAGE UPLOAD & INSERT ─────────────────────────────────────────
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    setImageUploadProgress(`Uploading ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      setImageForm((prev) => ({
        ...prev,
        url: data.url,
        alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }))
      setImageUploadProgress(`✅ Uploaded successfully: ${file.name}`)
    } catch (err) {
      alert(`Upload error: ${err.message}`)
      setImageUploadProgress('')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const insertImageIntoContent = (e) => {
    e.preventDefault()
    if (!imageForm.url.trim()) return

    const width = imageForm.size === 'custom' ? imageForm.customWidth || '100%' : imageForm.size
    const alignment =
      imageForm.align === 'center'
        ? 'margin: 20px auto; text-align: center;'
        : imageForm.align === 'left'
        ? 'margin: 20px auto 20px 0; text-align: left;'
        : 'margin: 20px 0 20px auto; text-align: right;'

    const imgTag = `<img src="${imageForm.url.trim()}" alt="${imageForm.alt || 'Technical Visual'}" style="width:${width};max-width:100%;height:auto;border-radius:${imageForm.rounded ? '14px' : '0'};display:block;margin:0 auto;box-shadow:0 10px 30px rgba(0,0,0,0.25);" />`
    
    let wrappedImg = imgTag
    if (imageForm.linkUrl) {
      wrappedImg = `<a href="${imageForm.linkUrl.trim()}" target="_blank" rel="noopener noreferrer">${imgTag}</a>`
    }

    let figureHtml = `\n<figure style="${alignment}max-width:${width};">\n  ${wrappedImg}`
    if (imageForm.caption) {
      figureHtml += `\n  <figcaption style="font-size:12px;color:var(--text-muted,#94a3b8);margin-top:8px;font-style:italic;">${imageForm.caption}</figcaption>`
    }
    figureHtml += `\n</figure>\n`

    if (activeTab === 'editor') {
      const textarea = textareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const before = textarea.value.substring(0, start)
        const after = textarea.value.substring(end)
        notifyChange(`${before}${figureHtml}${after}`)
      } else {
        notifyChange(`${content}\n${figureHtml}`)
      }
    } else if (activeTab === 'visual' && visualRef.current) {
      visualRef.current.focus()
      document.execCommand('insertHTML', false, figureHtml)
      notifyChange(visualRef.current.innerHTML)
    } else {
      notifyChange(`${content}\n${figureHtml}`)
    }

    setShowImageModal(false)
    setImageUploadProgress('')
  }

  // ─── DIRECT VIDEO UPLOAD & EMBED ──────────────────────────────────────────
  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingVideo(true)
    setVideoUploadProgress(`Uploading video ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)...`)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload video')
      }

      setVideoForm((prev) => ({
        ...prev,
        url: data.url,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }))
      setVideoUploadProgress(`✅ Video uploaded successfully: ${file.name}`)
    } catch (err) {
      alert(`Video upload error: ${err.message}`)
      setVideoUploadProgress('')
    } finally {
      setIsUploadingVideo(false)
    }
  }

  // Convert YouTube / Vimeo or return raw video HTML
  const formatVideoEmbed = (url, width, align) => {
    const cleanUrl = (url || '').trim()
    const alignmentStyle =
      align === 'center'
        ? 'margin: 24px auto;'
        : align === 'left'
        ? 'margin: 24px auto 24px 0;'
        : 'margin: 24px 0 24px auto;'

    // 1. YouTube Match
    const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    if (ytMatch && ytMatch[1]) {
      const ytId = ytMatch[1]
      return `\n<div style="${alignmentStyle}width:${width};max-width:100%;">\n  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:14px;box-shadow:0 12px 36px rgba(0,0,0,0.3);background:#000;">\n    <iframe src="https://www.youtube.com/embed/${ytId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n  </div>\n</div>\n`
    }

    // 2. Vimeo Match
    const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)/)
    if (vimeoMatch && vimeoMatch[1]) {
      const vimeoId = vimeoMatch[1]
      return `\n<div style="${alignmentStyle}width:${width};max-width:100%;">\n  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:14px;box-shadow:0 12px 36px rgba(0,0,0,0.3);background:#000;">\n    <iframe src="https://player.vimeo.com/video/${vimeoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>\n  </div>\n</div>\n`
    }

    // 3. Native MP4 / WebM video file
    return `\n<div style="${alignmentStyle}width:${width};max-width:100%;">\n  <video controls style="width:100%;height:auto;border-radius:14px;display:block;box-shadow:0 12px 36px rgba(0,0,0,0.3);background:#000;" ${videoForm.autoplay ? 'autoplay ' : ''}${videoForm.loop ? 'loop ' : ''}>\n    <source src="${cleanUrl}" type="video/mp4" />\n    Your browser does not support HTML5 video.\n  </video>\n</div>\n`
  }

  const insertVideoIntoContent = (e) => {
    e.preventDefault()
    if (!videoForm.url.trim()) return

    const width = videoForm.size === 'custom' ? videoForm.customWidth || '100%' : videoForm.size
    const videoHtml = formatVideoEmbed(videoForm.url, width, videoForm.align)

    if (activeTab === 'editor') {
      const textarea = textareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const before = textarea.value.substring(0, start)
        const after = textarea.value.substring(end)
        notifyChange(`${before}${videoHtml}${after}`)
      } else {
        notifyChange(`${content}\n${videoHtml}`)
      }
    } else if (activeTab === 'visual' && visualRef.current) {
      visualRef.current.focus()
      document.execCommand('insertHTML', false, videoHtml)
      notifyChange(visualRef.current.innerHTML)
    } else {
      notifyChange(`${content}\n${videoHtml}`)
    }

    setShowVideoModal(false)
    setVideoUploadProgress('')
  }

  const toolbarBtnStyle = {
    height: 30,
    minWidth: 30,
    padding: '0 8px',
    borderRadius: 6,
    background: 'var(--bg-card, #131b2e)',
    color: 'var(--text-primary, #f1f5f9)',
    border: '1px solid var(--border, rgba(255,255,255,0.1))',
    fontSize: 12,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    userSelect: 'none',
  }

  const selectStyle = {
    height: 30,
    padding: '0 8px',
    borderRadius: 6,
    background: 'var(--bg-card, #131b2e)',
    color: 'var(--text-primary, #f1f5f9)',
    border: '1px solid var(--border, rgba(255,255,255,0.1))',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
  }

  return (
    <div
      style={{
        background: 'var(--bg-card, #0b1120)',
        border: '1px solid var(--border, rgba(255,255,255,0.12))',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }}
    >
      {/* ── TOP HEADER / MODE SWITCHER ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          padding: '12px 16px',
          borderBottom: '1px solid var(--border, rgba(255,255,255,0.1))',
          background: 'var(--bg-elevated, #0f172a)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} style={{ color: 'var(--accent, #6366f1)' }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Rich Content & Media Studio
          </span>
          <span style={{ fontSize: 10, background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>
            2026 Pro Suite
          </span>
        </div>

        {/* Mode Buttons */}
        <div style={{ display: 'flex', background: 'var(--bg-card, #0b1120)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
          <button
            type="button"
            onClick={() => handleTabSwitch('editor')}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'editor' ? 'var(--accent, #6366f1)' : 'transparent',
              color: activeTab === 'editor' ? '#fff' : 'var(--text-muted, #94a3b8)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <FileCode size={13} /> Code Editor (HTML)
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('visual')}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'visual' ? 'var(--accent, #6366f1)' : 'transparent',
              color: activeTab === 'visual' ? '#fff' : 'var(--text-muted, #94a3b8)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Type size={13} /> Visual WYSIWYG
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('preview')}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeTab === 'preview' ? 'var(--accent, #6366f1)' : 'transparent',
              color: activeTab === 'preview' ? '#fff' : 'var(--text-muted, #94a3b8)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Eye size={13} /> Reader Preview
          </button>
        </div>
      </div>

      {/* ── TOOLBAR BAR ── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 6,
          padding: '10px 14px',
          background: 'var(--bg-elevated, #0f172a)',
          borderBottom: '1px solid var(--border, rgba(255,255,255,0.08))',
        }}
      >
        {/* Headings */}
        <div style={{ display: 'inline-flex', gap: 2, background: 'var(--bg-card)', padding: 2, borderRadius: 8, border: '1px solid var(--border)' }}>
          <button
            type="button"
            title="Heading 1"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('formatBlock', '<h1>') : wrapOrInsertTag('<h1>', '</h1>', 'Heading 1'))}
            style={toolbarBtnStyle}
          >
            H1
          </button>
          <button
            type="button"
            title="Heading 2"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('formatBlock', '<h2>') : wrapOrInsertTag('<h2>', '</h2>', 'Heading 2'))}
            style={toolbarBtnStyle}
          >
            H2
          </button>
          <button
            type="button"
            title="Heading 3"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('formatBlock', '<h3>') : wrapOrInsertTag('<h3>', '</h3>', 'Heading 3'))}
            style={toolbarBtnStyle}
          >
            H3
          </button>
          <button
            type="button"
            title="Heading 4"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('formatBlock', '<h4>') : wrapOrInsertTag('<h4>', '</h4>', 'Heading 4'))}
            style={toolbarBtnStyle}
          >
            H4
          </button>
          <button
            type="button"
            title="Paragraph"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('formatBlock', '<p>') : wrapOrInsertTag('<p>', '</p>', 'Paragraph text'))}
            style={toolbarBtnStyle}
          >
            P
          </button>
        </div>

        {/* Text Styles */}
        <div style={{ display: 'inline-flex', gap: 2, background: 'var(--bg-card)', padding: 2, borderRadius: 8, border: '1px solid var(--border)' }}>
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('bold') : wrapOrInsertTag('<strong>', '</strong>', 'Bold Text'))}
            style={toolbarBtnStyle}
          >
            <Bold size={13} />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('italic') : wrapOrInsertTag('<em>', '</em>', 'Italic Text'))}
            style={toolbarBtnStyle}
          >
            <Italic size={13} />
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('underline') : wrapOrInsertTag('<u>', '</u>', 'Underlined Text'))}
            style={toolbarBtnStyle}
          >
            <Underline size={13} />
          </button>
          <button
            type="button"
            title="Strikethrough"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('strikeThrough') : wrapOrInsertTag('<s>', '</s>', 'Strikethrough Text'))}
            style={toolbarBtnStyle}
          >
            <Strikethrough size={13} />
          </button>
          <button
            type="button"
            title="Highlight Mark"
            onClick={() =>
              activeTab === 'visual'
                ? execVisualCmd('hiliteColor', '#f59e0b')
                : wrapOrInsertTag(
                    '<mark style="background:rgba(245,158,11,0.25);color:#f59e0b;padding:2px 6px;border-radius:4px;font-weight:600;">',
                    '</mark>',
                    'Highlighted Text'
                  )
            }
            style={toolbarBtnStyle}
          >
            <Highlighter size={13} />
          </button>
        </div>

        {/* Font Size Dropdown */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              if (activeTab === 'visual') {
                execVisualCmd('fontSize', '4')
              } else {
                wrapOrInsertTag(`<span style="font-size:${e.target.value};">`, '</span>', 'Sized Text')
              }
              e.target.value = ''
            }
          }}
          style={selectStyle}
        >
          <option value="">Font Size</option>
          <option value="12px">Small (12px)</option>
          <option value="14px">Base (14px)</option>
          <option value="16px">Regular (16px)</option>
          <option value="18px">Medium (18px)</option>
          <option value="22px">Large (22px)</option>
          <option value="28px">Subhead (28px)</option>
          <option value="36px">Display (36px)</option>
        </select>

        {/* Font Family Dropdown */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              if (activeTab === 'visual') {
                execVisualCmd('fontName', e.target.value)
              } else {
                wrapOrInsertTag(`<span style="font-family:${e.target.value};">`, '</span>', 'Styled Text')
              }
              e.target.value = ''
            }
          }}
          style={selectStyle}
        >
          <option value="">Font Family</option>
          <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
          <option value="'Inter', sans-serif">Inter</option>
          <option value="'Outfit', sans-serif">Outfit</option>
          <option value="'Courier New', monospace">Monospace Code</option>
          <option value="Georgia, serif">Editorial Serif</option>
        </select>

        {/* Color Palette */}
        <div style={{ display: 'inline-flex', gap: 4, alignItems: 'center', background: 'var(--bg-card)', padding: '4px 6px', borderRadius: 8, border: '1px solid var(--border)' }}>
          {[
            { color: '#6366f1', label: 'Indigo' },
            { color: '#06b6d4', label: 'Cyan' },
            { color: '#10b981', label: 'Emerald' },
            { color: '#f59e0b', label: 'Amber' },
            { color: '#f43f5e', label: 'Rose' },
            { color: '#a855f7', label: 'Purple' },
            { color: '#ffffff', label: 'White' },
          ].map((c) => (
            <button
              key={c.color}
              type="button"
              title={c.label}
              onClick={() => {
                if (activeTab === 'visual') {
                  execVisualCmd('foreColor', c.color)
                } else {
                  wrapOrInsertTag(`<span style="color:${c.color};">`, '</span>', 'Colored Text')
                }
              }}
              style={{
                width: 15,
                height: 15,
                borderRadius: '50%',
                background: c.color,
                border: '1px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
          {/* Custom Hex Color input */}
          <input
            type="color"
            title="Custom Hex Color"
            onChange={(e) => {
              const hex = e.target.value
              if (activeTab === 'visual') {
                execVisualCmd('foreColor', hex)
              } else {
                wrapOrInsertTag(`<span style="color:${hex};">`, '</span>', 'Colored Text')
              }
            }}
            style={{ width: 18, height: 18, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
          />
        </div>

        {/* Alignment */}
        <div style={{ display: 'inline-flex', gap: 2, background: 'var(--bg-card)', padding: 2, borderRadius: 8, border: '1px solid var(--border)' }}>
          <button
            type="button"
            title="Align Left"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('justifyLeft') : wrapOrInsertTag('<div style="text-align:left;">', '</div>', 'Left aligned content'))}
            style={toolbarBtnStyle}
          >
            <AlignLeft size={13} />
          </button>
          <button
            type="button"
            title="Align Center"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('justifyCenter') : wrapOrInsertTag('<div style="text-align:center;">', '</div>', 'Center aligned content'))}
            style={toolbarBtnStyle}
          >
            <AlignCenter size={13} />
          </button>
          <button
            type="button"
            title="Align Right"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('justifyRight') : wrapOrInsertTag('<div style="text-align:right;">', '</div>', 'Right aligned content'))}
            style={toolbarBtnStyle}
          >
            <AlignRight size={13} />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div style={{ display: 'inline-flex', gap: 2, background: 'var(--bg-card)', padding: 2, borderRadius: 8, border: '1px solid var(--border)' }}>
          <button
            type="button"
            title="Bullet List"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('insertUnorderedList') : wrapOrInsertTag('<ul>\n  <li>', '</li>\n</ul>', 'Bullet item'))}
            style={toolbarBtnStyle}
          >
            <List size={13} />
          </button>
          <button
            type="button"
            title="Numbered List"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('insertOrderedList') : wrapOrInsertTag('<ol>\n  <li>', '</li>\n</ol>', 'Numbered item'))}
            style={toolbarBtnStyle}
          >
            <ListOrdered size={13} />
          </button>
          <button
            type="button"
            title="Blockquote"
            onClick={() => (activeTab === 'visual' ? execVisualCmd('formatBlock', '<blockquote>') : wrapOrInsertTag('<blockquote>', '</blockquote>', 'Insightful quote or client testimonial.'))}
            style={toolbarBtnStyle}
          >
            <Quote size={13} />
          </button>
          <button
            type="button"
            title="Code Snippet"
            onClick={() => wrapOrInsertTag('<pre><code class="language-javascript">', '</code></pre>', '// Code snippet here\nconst server = express();')}
            style={toolbarBtnStyle}
          >
            <Code size={13} />
          </button>
          <button
            type="button"
            title="Callout / Pro Tip Box"
            onClick={() =>
              wrapOrInsertTag(
                '<div style="background:rgba(99,102,241,0.08);border-left:4px solid #6366f1;padding:16px 20px;border-radius:0 10px 10px 0;margin:20px 0;">\n<strong style="color:#818cf8;display:block;margin-bottom:4px;">💡 Technical Note:</strong> ',
                '\n</div>',
                'Zero-trust security policies must be strictly enforced on all public gateway APIs.'
              )
            }
            style={{ ...toolbarBtnStyle, color: '#818cf8' }}
          >
            Callout
          </button>
        </div>

        {/* ── INTERACTIVE MEDIA BUTTONS: LINK, IMAGE, VIDEO ── */}
        <div style={{ display: 'inline-flex', gap: 4, background: 'rgba(99,102,241,0.1)', padding: 2, borderRadius: 8, border: '1px solid rgba(99,102,241,0.25)' }}>
          {/* Link button */}
          <button
            type="button"
            onClick={openLinkModal}
            title="Convert Selected Text to Link (Ctrl+K)"
            style={{ ...toolbarBtnStyle, background: 'var(--accent, #6366f1)', color: '#fff', gap: 4 }}
          >
            <LinkIcon size={13} />
            <span>Link Text</span>
          </button>

          {/* Image button */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            title="Upload Image from PC or Link External Image"
            style={{ ...toolbarBtnStyle, background: '#0284c7', color: '#fff', gap: 4 }}
          >
            <ImageIcon size={13} />
            <span>+ Image</span>
          </button>

          {/* Video button */}
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            title="Upload Video from PC or Embed YouTube/Vimeo"
            style={{ ...toolbarBtnStyle, background: '#e11d48', color: '#fff', gap: 4 }}
          >
            <VideoIcon size={13} />
            <span>+ Video</span>
          </button>
        </div>
      </div>

      {/* ── EDITOR BODY ── */}
      <div style={{ position: 'relative' }}>
        {/* 1. CODE EDITOR MODE */}
        {activeTab === 'editor' && (
          <div style={{ padding: 14 }}>
            <textarea
              ref={textareaRef}
              rows={18}
              value={content}
              onChange={(e) => notifyChange(e.target.value)}
              placeholder={placeholder}
              style={{
                width: '100%',
                minHeight,
                padding: '16px 18px',
                background: 'var(--bg, #090d16)',
                border: '1px solid var(--border, rgba(255,255,255,0.1))',
                borderRadius: 12,
                color: '#e2e8f0',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: 13.5,
                lineHeight: 1.7,
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* 2. VISUAL WYSIWYG MODE */}
        {activeTab === 'visual' && (
          <div style={{ padding: 14 }}>
            <div
              ref={visualRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => notifyChange(e.currentTarget.innerHTML)}
              style={{
                width: '100%',
                minHeight,
                padding: '24px 28px',
                background: 'var(--bg, #090d16)',
                border: '1px solid var(--border, rgba(255,255,255,0.1))',
                borderRadius: 12,
                color: 'var(--text-primary, #f8fafc)',
                fontFamily: "'Inter', sans-serif",
                fontSize: 15,
                lineHeight: 1.8,
                outline: 'none',
                overflowY: 'auto',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* 3. READER PREVIEW MODE */}
        {activeTab === 'preview' && (
          <div
            style={{
              padding: '36px 40px',
              minHeight,
              background: 'var(--bg-elevated, #0f172a)',
              color: 'var(--text-secondary, #cbd5e1)',
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              lineHeight: 1.85,
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: content || `<p style="color:var(--text-muted);font-style:italic;">No article content written yet.</p>` }}
              className="rich-preview-body"
            />
          </div>
        )}
      </div>

      {/* ── FOOTER STATUS BAR ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          background: 'var(--bg-card, #0b1120)',
          borderTop: '1px solid var(--border, rgba(255,255,255,0.08))',
          fontSize: 11,
          color: 'var(--text-muted, #94a3b8)',
        }}
      >
        <div style={{ display: 'flex', gap: 14 }}>
          <span>Words: <strong>{content.trim() ? content.trim().split(/\s+/).length : 0}</strong></span>
          <span>Characters: <strong>{content.length}</strong></span>
          <span>Mode: <strong style={{ color: 'var(--accent)' }}>{activeTab.toUpperCase()}</strong></span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>💡 Select any text and click <strong>Link Text</strong> or formatting tags.</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL 1: HYPERLINK TOOL (CONVERT TEXT TO LINK) ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {showLinkModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
          onClick={() => setShowLinkModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: 'var(--bg-card, #0f172a)',
              border: '1px solid var(--border, rgba(255,255,255,0.2))',
              borderRadius: 18,
              padding: 24,
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LinkIcon size={18} style={{ color: 'var(--accent)' }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Convert Text to Clickable Link
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={applyLink} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5, textTransform: 'uppercase' }}>
                  Anchor / Display Text *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Cloud Architecture"
                  value={linkForm.text}
                  onChange={(e) => setLinkForm({ ...linkForm, text: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-elevated, #1e293b)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5, textTransform: 'uppercase' }}>
                  Destination URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://orbit-i.tech/services or /contact"
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-elevated, #1e293b)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Quick internal links helper */}
              <div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Quick Shortcuts:</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Services', url: '/services' },
                    { label: 'Careers', url: '/careers' },
                    { label: 'Contact', url: '/contact' },
                    { label: 'Team', url: '/team' },
                    { label: 'Verify', url: '/verify' },
                    { label: 'Locations', url: '/locations' },
                  ].map((s) => (
                    <button
                      key={s.url}
                      type="button"
                      onClick={() => setLinkForm({ ...linkForm, url: s.url })}
                      style={{
                        fontSize: 10,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: 'var(--bg-elevated)',
                        color: 'var(--accent)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <input
                  type="checkbox"
                  id="link_newtab"
                  checked={linkForm.newTab}
                  onChange={(e) => setLinkForm({ ...linkForm, newTab: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="link_newtab" style={{ fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Open link in new browser tab (<code style={{ fontSize: 11 }}>target="_blank"</code>)
                </label>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: 10,
                    background: 'var(--accent, #6366f1)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Check size={14} /> Insert Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  style={{
                    padding: '11px 18px',
                    borderRadius: 10,
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL 2: IMAGE UPLOAD & SIZE ADJUSTER ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {showImageModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
          onClick={() => setShowImageModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 560,
              background: 'var(--bg-card, #0f172a)',
              border: '1px solid var(--border, rgba(255,255,255,0.2))',
              borderRadius: 20,
              padding: 26,
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ImageIcon size={20} style={{ color: '#0284c7' }} />
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Insert Image (PC Upload or External Link)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Source Tab Toggle */}
            <div style={{ display: 'flex', background: 'var(--bg-elevated)', padding: 3, borderRadius: 10, marginBottom: 18, border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 8,
                  border: 'none',
                  background: imageTab === 'upload' ? '#0284c7' : 'transparent',
                  color: imageTab === 'upload' ? '#fff' : 'var(--text-muted)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Upload size={14} /> Upload from Laptop / PC
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 8,
                  border: 'none',
                  background: imageTab === 'url' ? '#0284c7' : 'transparent',
                  color: imageTab === 'url' ? '#fff' : 'var(--text-muted)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <ExternalLink size={14} /> Link External Image URL
              </button>
            </div>

            <form onSubmit={insertImageIntoContent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Tab 1: Upload */}
              {imageTab === 'upload' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageFileUpload}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--border)',
                      borderRadius: 14,
                      padding: 24,
                      textAlign: 'center',
                      background: 'var(--bg-elevated)',
                      cursor: 'pointer',
                      transition: 'border 0.2s',
                    }}
                  >
                    <Upload size={28} style={{ color: '#0284c7', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      Click to Browse Images from your Device
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      Supports PNG, JPG, WEBP, GIF, SVG (Direct PC Upload)
                    </div>
                  </div>

                  {isUploadingImage && (
                    <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8 }}>{imageUploadProgress}</p>
                  )}
                  {!isUploadingImage && imageUploadProgress && (
                    <p style={{ fontSize: 12, color: '#22c55e', marginTop: 8 }}>{imageUploadProgress}</p>
                  )}
                </div>
              )}

              {/* Tab 2: External URL */}
              {imageTab === 'url' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5, textTransform: 'uppercase' }}>
                    External Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/... or https://cdn.example.com/photo.png"
                    value={imageForm.url}
                    onChange={(e) => setImageForm({ ...imageForm, url: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>
              )}

              {/* Live Preview if URL available */}
              {imageForm.url && (
                <div style={{ background: 'var(--bg, #000)', borderRadius: 12, padding: 12, textAlign: 'center', border: '1px solid var(--border)' }}>
                  <img
                    src={imageForm.url}
                    alt="Preview"
                    style={{ maxHeight: 160, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Live Preview</div>
                </div>
              )}

              {/* Size Adjustment Controls ("size adjustable kr sake") */}
              <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Sliders size={14} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                    Image Dimensions & Size Options
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8, marginBottom: 10 }}>
                  {[
                    { label: '100% (Full)', val: '100%' },
                    { label: '75% (Large)', val: '75%' },
                    { label: '50% (Medium)', val: '50%' },
                    { label: '33% (1/3)', val: '33%' },
                    { label: '25% (Small)', val: '25%' },
                    { label: 'Custom', val: 'custom' },
                  ].map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => setImageForm({ ...imageForm, size: s.val })}
                      style={{
                        padding: '6px',
                        borderRadius: 8,
                        border: imageForm.size === s.val ? '1px solid var(--accent)' : '1px solid var(--border)',
                        background: imageForm.size === s.val ? 'var(--accent-glow)' : 'var(--bg-card)',
                        color: imageForm.size === s.val ? 'var(--accent)' : 'var(--text-secondary)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {imageForm.size === 'custom' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Custom Width (e.g. 450px or 60%)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500px"
                      value={imageForm.customWidth}
                      onChange={(e) => setImageForm({ ...imageForm, customWidth: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: 12,
                        outline: 'none',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Layout Alignment */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5 }}>
                    Alignment
                  </label>
                  <select
                    value={imageForm.align}
                    onChange={(e) => setImageForm({ ...imageForm, align: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 10,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 12,
                      outline: 'none',
                    }}
                  >
                    <option value="center">Center Aligned</option>
                    <option value="left">Left Aligned</option>
                    <option value="right">Right Aligned</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5 }}>
                    Alt Text (SEO)
                  </label>
                  <input
                    type="text"
                    placeholder="Keywords describing image"
                    value={imageForm.alt}
                    onChange={(e) => setImageForm({ ...imageForm, alt: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 10,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 12,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5 }}>
                  Optional Caption (<code style={{ fontSize: 10 }}>&lt;figcaption&gt;</code>)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Figure 1.1: Multi-Agent Neural Architecture"
                  value={imageForm.caption}
                  onChange={(e) => setImageForm({ ...imageForm, caption: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 10,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: 12,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="submit"
                  disabled={!imageForm.url}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: 10,
                    background: imageForm.url ? '#0284c7' : 'var(--bg-elevated)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: imageForm.url ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Check size={14} /> Insert Adjusted Image
                </button>
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  style={{
                    padding: '11px 18px',
                    borderRadius: 10,
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL 3: VIDEO UPLOAD, EMBED & SIZE ADJUSTER ── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {showVideoModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
          onClick={() => setShowVideoModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 560,
              background: 'var(--bg-card, #0f172a)',
              border: '1px solid var(--border, rgba(255,255,255,0.2))',
              borderRadius: 20,
              padding: 26,
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <VideoIcon size={20} style={{ color: '#e11d48' }} />
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Insert Video (PC Upload, YouTube or Vimeo)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Source Tabs */}
            <div style={{ display: 'flex', background: 'var(--bg-elevated)', padding: 3, borderRadius: 10, marginBottom: 18, border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setVideoTab('url')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 8,
                  border: 'none',
                  background: videoTab === 'url' ? '#e11d48' : 'transparent',
                  color: videoTab === 'url' ? '#fff' : 'var(--text-muted)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <ExternalLink size={14} /> YouTube / Vimeo / MP4 URL
              </button>
              <button
                type="button"
                onClick={() => setVideoTab('upload')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 8,
                  border: 'none',
                  background: videoTab === 'upload' ? '#e11d48' : 'transparent',
                  color: videoTab === 'upload' ? '#fff' : 'var(--text-muted)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Upload size={14} /> Upload Video from PC
              </button>
            </div>

            <form onSubmit={insertVideoIntoContent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Tab 1: URL */}
              {videoTab === 'url' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5, textTransform: 'uppercase' }}>
                    Video URL (YouTube, Vimeo, or MP4) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    value={videoForm.url}
                    onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                    Auto-converts YouTube and Vimeo links into responsive embeds.
                  </span>
                </div>
              )}

              {/* Tab 2: Upload */}
              {videoTab === 'upload' && (
                <div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    style={{ display: 'none' }}
                    onChange={handleVideoFileUpload}
                  />
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--border)',
                      borderRadius: 14,
                      padding: 24,
                      textAlign: 'center',
                      background: 'var(--bg-elevated)',
                      cursor: 'pointer',
                    }}
                  >
                    <Upload size={28} style={{ color: '#e11d48', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      Click to Browse Video File from PC
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      Supports MP4, WebM, MOV (Up to 100MB)
                    </div>
                  </div>

                  {isUploadingVideo && (
                    <p style={{ fontSize: 12, color: 'var(--accent)', marginTop: 8 }}>{videoUploadProgress}</p>
                  )}
                  {!isUploadingVideo && videoUploadProgress && (
                    <p style={{ fontSize: 12, color: '#22c55e', marginTop: 8 }}>{videoUploadProgress}</p>
                  )}
                </div>
              )}

              {/* Size Adjustment Controls ("size adjustable kr sake") */}
              <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Sliders size={14} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                    Video Player Dimensions & Size
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8, marginBottom: 10 }}>
                  {[
                    { label: '100% (Full)', val: '100%' },
                    { label: '75% (Wide)', val: '75%' },
                    { label: '50% (Medium)', val: '50%' },
                    { label: 'Custom', val: 'custom' },
                  ].map((s) => (
                    <button
                      key={s.val}
                      type="button"
                      onClick={() => setVideoForm({ ...videoForm, size: s.val })}
                      style={{
                        padding: '6px',
                        borderRadius: 8,
                        border: videoForm.size === s.val ? '1px solid var(--accent)' : '1px solid var(--border)',
                        background: videoForm.size === s.val ? 'var(--accent-glow)' : 'var(--bg-card)',
                        color: videoForm.size === s.val ? 'var(--accent)' : 'var(--text-secondary)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {videoForm.size === 'custom' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Custom Player Width (e.g. 640px)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 680px"
                      value={videoForm.customWidth}
                      onChange={(e) => setVideoForm({ ...videoForm, customWidth: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: 12,
                        outline: 'none',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Alignment */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5 }}>
                  Video Alignment
                </label>
                <select
                  value={videoForm.align}
                  onChange={(e) => setVideoForm({ ...videoForm, align: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 10,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: 12,
                    outline: 'none',
                  }}
                >
                  <option value="center">Center Aligned</option>
                  <option value="left">Left Aligned</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="submit"
                  disabled={!videoForm.url}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: 10,
                    background: videoForm.url ? '#e11d48' : 'var(--bg-elevated)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: videoForm.url ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Check size={14} /> Insert Adjusted Video
                </button>
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  style={{
                    padding: '11px 18px',
                    borderRadius: 10,
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border)',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
