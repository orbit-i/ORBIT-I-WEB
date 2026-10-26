export const metadata = {
  title: 'Engineering Blog & Applied AI Insights | ORBIT-I Private Limited',
  description: 'Technical architectural case studies, autonomous AI agent tutorials, Next.js optimization guides, and cloud DevOps blueprints from the ORBIT-I engineering team.',
  keywords: [
    'engineering blog',
    'AI tutorials Pakistan',
    'Next.js enterprise architecture',
    'autonomous agents',
  ],
  openGraph: {
    title: 'Engineering Blog & Applied AI Insights | ORBIT-I',
    description: 'Technical case studies and AI tutorials from the ORBIT-I engineering team.',
    url: 'https://orbit-i.tech/blog',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/orbitlogo-removebg-preview.png', width: 512, height: 512, alt: 'ORBIT-I Blog' }],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/blog',
  },
}

export default function BlogLayout({ children }) {
  return children
}
