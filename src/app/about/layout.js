export const metadata = {
  title: 'About ORBIT-I Private Limited — SECP Registered Technology Enterprise',
  description: 'Learn about ORBIT-I Private Limited (Est. 2026), SECP registered IT enterprise with corporate headquarters in Nawabshah and regional branch in Karachi, delivering enterprise AI and custom cloud platforms.',
  keywords: [
    'about ORBIT-I',
    'software company Nawabshah',
    'SECP registered IT company',
    'software house Karachi',
    'enterprise software Sindh',
    'top technology firms Pakistan',
  ],
  openGraph: {
    title: 'About ORBIT-I Private Limited — SECP Registered Technology Enterprise',
    description: 'Learn about ORBIT-I Private Limited (Est. 2026), SECP registered IT enterprise delivering enterprise AI and custom cloud platforms.',
    url: 'https://orbit-i.tech/about',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/orbitlogo-removebg-preview.png', width: 512, height: 512, alt: 'ORBIT-I Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About ORBIT-I Private Limited — SECP Registered Technology Enterprise',
    description: 'SECP registered IT enterprise delivering enterprise AI and custom cloud platforms.',
    images: ['/orbitlogo-removebg-preview.png'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/about',
  },
}

export default function AboutLayout({ children }) {
  return children
}
