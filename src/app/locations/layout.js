export const metadata = {
  title: 'Offices & Regional Hubs in Nawabshah, Karachi & Hyderabad | ORBIT-I',
  description: 'Locate ORBIT-I Corporate Headquarters in Nawabshah, Executive Client Branch in Karachi, and regional engineering delivery in Hyderabad, Pakistan.',
  keywords: [
    'ORBIT-I locations',
    'software company Nawabshah address',
    'Karachi office ORBIT-I',
    'Hyderabad IT firm',
  ],
  openGraph: {
    title: 'Offices & Regional Hubs in Nawabshah, Karachi & Hyderabad | ORBIT-I',
    description: 'Corporate Headquarters in Nawabshah, Executive Client Branch in Karachi, and delivery in Hyderabad.',
    url: 'https://orbit-i.tech/locations',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/orbitlogo-removebg-preview.png', width: 512, height: 512, alt: 'ORBIT-I Offices' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Offices & Regional Hubs | ORBIT-I Private Limited',
    description: 'Offices in Nawabshah, Karachi & Hyderabad.',
    images: ['/orbitlogo-removebg-preview.png'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/locations',
  },
}

export default function LocationsLayout({ children }) {
  return children
}
