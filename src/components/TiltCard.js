'use client'

import { useRef } from 'react'

export default function TiltCard({ children, style, className, onClick }) {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const card = ref.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -8
    const rotateY = ((x - cx) / cx) * 8
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`
    card.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5}px 40px var(--card-shadow), 0 0 0 1px var(--border-hover)`
  }

  const handleMouseLeave = () => {
    const card = ref.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    card.style.boxShadow = 'none'
  }

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
