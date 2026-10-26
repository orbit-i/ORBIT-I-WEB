export const metadata = {
  title: 'Enterprise Software & AI Engineering Services | ORBIT-I Private Limited',
  description: 'Explore ORBIT-I 7 enterprise software verticals: AI & ML Systems, Web Platforms, Mobile Apps, Custom ERPs, UI/UX Design Systems, Cloud DevOps, and Enterprise APIs.',
  keywords: [
    'software services Nawabshah',
    'AI development Karachi',
    'web development company Sindh',
    'mobile app development Pakistan',
    'cloud devops engineering',
    'custom software solutions',
  ],
  openGraph: {
    title: 'Enterprise Software & AI Engineering Services | ORBIT-I',
    description: 'Explore ORBIT-I 7 enterprise software verticals: AI & ML, Web, Mobile, ERP, UI/UX, Cloud DevOps, and Enterprise APIs.',
    url: 'https://orbit-i.tech/services',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/orbitlogo-removebg-preview.png', width: 512, height: 512, alt: 'ORBIT-I Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise Software & AI Engineering Services | ORBIT-I',
    description: 'Explore ORBIT-I 7 enterprise software verticals.',
    images: ['/orbitlogo-removebg-preview.png'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/services',
  },
}

export default function ServicesLayout({ children }) {
  return children
}
