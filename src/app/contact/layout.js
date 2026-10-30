export const metadata = {
  title: 'Contact Us | ORBIT-I Private Limited',
  description: 'Get in touch with ORBIT-I engineering and commercial leads in Nawabshah (+92 319 0375751) and Karachi. Request project consultations and technical discovery.',
  openGraph: {
    title: 'Contact Us | ORBIT-I Private Limited',
    description: 'Connect with ORBIT-I in Nawabshah and Karachi. We respond to all project and consultation inquiries within 24 hours.',
    url: 'https://orbit-i.tech/contact',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Contact ORBIT-I' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | ORBIT-I Private Limited',
    description: 'Connect with ORBIT-I in Nawabshah and Karachi.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/contact',
  },
}

export default function ContactLayout({ children }) {
  return children
}
