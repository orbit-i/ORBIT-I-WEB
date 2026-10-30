export const metadata = {
  title: 'Engineering Blog & Insights | ORBIT-I Private Limited',
  description: 'Technical architectural case studies, applied AI insights, Next.js optimization guides, and cloud DevOps blueprints from the ORBIT-I engineering team.',
  openGraph: {
    title: 'Engineering Blog & Insights | ORBIT-I Private Limited',
    description: 'Technical architectural case studies, applied AI insights, and cloud engineering guides.',
    url: 'https://orbit-i.tech/blog',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ORBIT-I Engineering Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Blog & Insights | ORBIT-I Private Limited',
    description: 'Technical case studies and AI insights from the ORBIT-I engineering team.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/blog',
  },
}

export default function BlogLayout({ children }) {
  return children
}
