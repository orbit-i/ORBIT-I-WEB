export const metadata = {
  title: 'Enterprise Software & AI Services | ORBIT-I Private Limited',
  description: 'Explore ORBIT-I enterprise software verticals: AI & ML Systems, Web Platforms, Mobile Apps, Custom ERPs, UI/UX Design, Cloud DevOps, and Enterprise APIs.',
  openGraph: {
    title: 'Enterprise Software & AI Services | ORBIT-I Private Limited',
    description: 'Explore ORBIT-I enterprise software verticals: AI & ML, Web, Mobile, Custom ERP, UI/UX, Cloud DevOps, and Enterprise APIs.',
    url: 'https://orbit-i.tech/services',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ORBIT-I Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise Software & AI Services | ORBIT-I Private Limited',
    description: 'Explore ORBIT-I enterprise software verticals.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/services',
  },
}

export default function ServicesLayout({ children }) {
  return children
}
