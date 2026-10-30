export const metadata = {
  title: 'About Us | ORBIT-I Private Limited',
  description: 'Learn about ORBIT-I Private Limited, an SECP-registered software and AI engineering company headquartered in Nawabshah with executive branch in Karachi.',
  openGraph: {
    title: 'About Us | ORBIT-I Private Limited',
    description: 'SECP-registered software and AI engineering company headquartered in Nawabshah with executive branch in Karachi.',
    url: 'https://orbit-i.tech/about',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'About ORBIT-I Private Limited' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | ORBIT-I Private Limited',
    description: 'SECP-registered software and AI engineering company headquartered in Nawabshah with executive branch in Karachi.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/about',
  },
}

export default function AboutLayout({ children }) {
  return children
}
