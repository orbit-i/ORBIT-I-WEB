'use client'

import Image from 'next/image'

export default function OrbitLogo({ size = 36, showText = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: showText ? 10 : 0 }}>
      <Image
        src="/orbitlogo-removebg-preview.png"
        alt="ORBIT-I Logo"
        width={size}
        height={size}
        style={{
          objectFit: 'contain',
          flexShrink: 0,
          filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.4))',
        }}
        priority
      />
      {showText && (
        <div style={{ lineHeight: 1 }}>
          <div style={{
            fontFamily: 'Space Grotesk',
            fontSize: size * 0.38,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}>
            ORBIT-I
          </div>
          <div style={{
            fontSize: size * 0.22,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: 2,
          }}>
            Private Limited
          </div>
        </div>
      )}
    </div>
  )
}
