export const metadata = {
  title: 'Official Directory & Links | ORBIT-I Private Limited',
  description: 'Official verified links, portfolio showcases, socials, and contact channels of ORBIT-I Private Limited.',
  openGraph: {
    title: 'Official Directory & Links | ORBIT-I Private Limited',
    description: 'Official verified links, portfolio showcases, socials, and contact channels.',
    url: 'https://orbit-i.tech/links',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ORBIT-I Directory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Official Directory & Links | ORBIT-I Private Limited',
    description: 'Official verified links and resources.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/links',
  },
}

export default function LinksLayout({ children }) {
  return children
}

