export const metadata = {
  title: 'Careers & Internships | ORBIT-I Private Limited',
  description: 'Join the software engineering and applied AI team at ORBIT-I. Explore full-time roles, software fellowships, and internship opportunities in Nawabshah, Karachi, and remote.',
  openGraph: {
    title: 'Careers & Internships | ORBIT-I Private Limited',
    description: 'Explore engineering positions, fellowships, and internships in Nawabshah, Karachi, and remote.',
    url: 'https://orbit-i.tech/careers',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ORBIT-I Careers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers & Internships | ORBIT-I Private Limited',
    description: 'Explore engineering positions and internships at ORBIT-I.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/careers',
  },
}

export default function CareersLayout({ children }) {
  return children
}
