export const metadata = {
  title: 'Offices & Regional Hubs | ORBIT-I Private Limited',
  description: 'Locate ORBIT-I Corporate Headquarters in Nawabshah and Executive Client Branch in Karachi, Sindh, Pakistan. Delivering enterprise software across Pakistan and globally.',
  openGraph: {
    title: 'Offices & Regional Hubs | ORBIT-I Private Limited',
    description: 'Corporate Headquarters in Nawabshah and Executive Client Branch in Karachi, Sindh.',
    url: 'https://orbit-i.tech/locations',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ORBIT-I Offices' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Offices & Regional Hubs | ORBIT-I Private Limited',
    description: 'Offices in Nawabshah & Karachi, Sindh, Pakistan.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/locations',
  },
}

export default function LocationsLayout({ children }) {
  return children
}
