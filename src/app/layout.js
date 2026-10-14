import './globals.css'
import './responsive.css'

export const metadata = {
  metadataBase: new URL('https://orbit-i.tech'),
  title: {
    default: 'ORBIT-I Private Limited — Engineering Software That Stays in Orbit',
    template: '%s | ORBIT-I Private Limited',
  },
  description: 'ORBIT-I is a SECP registered software engineering company in Nawabshah, Sindh, Pakistan. We build enterprise AI systems, web applications, mobile apps, and custom software solutions.',
  keywords: [
    'software company Pakistan',
    'software development Nawabshah',
    'enterprise AI Pakistan',
    'Spring Boot development',
    'React Next.js Pakistan',
    'custom software Sindh',
    'LangChain RAG systems',
    'mobile app development Pakistan',
    'cloud DevOps Pakistan',
    'ORBIT-I',
    'orbit-i.tech',
  ],
  authors: [{ name: 'ORBIT-I Private Limited', url: 'https://orbit-i.tech' }],
  creator: 'ORBIT-I Private Limited',
  publisher: 'ORBIT-I Private Limited',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/favicon-logo.png', type: 'image/png' }],
    apple: '/favicon-logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://orbit-i.tech',
    siteName: 'ORBIT-I Private Limited',
    title: 'ORBIT-I Private Limited — Building Ideas. Creating Impact.',
    description: 'SECP registered software engineering company delivering enterprise AI systems, web platforms, mobile apps, and cloud infrastructure from Nawabshah, Sindh, Pakistan.',
    images: [
      {
        url: '/orbitlogo-removebg-preview.png',
        width: 512,
        height: 512,
        alt: 'ORBIT-I Private Limited Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORBIT-I Private Limited — Engineering Software That Stays in Orbit',
    description: 'Enterprise AI systems, web platforms, mobile apps, and cloud infrastructure from Nawabshah, Sindh, Pakistan.',
    images: ['/orbitlogo-removebg-preview.png'],
  },
  verification: {
    // Add Google Search Console verification code here when available
    // google: 'your-verification-code',
  },
  alternates: {
    canonical: 'https://orbit-i.tech',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-logo.png" />
        <link rel="apple-touch-icon" href="/favicon-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Structured data — helps Google understand the business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ORBIT-I Private Limited',
              alternateName: 'ORBIT-I',
              url: 'https://orbit-i.tech',
              logo: 'https://orbit-i.tech/orbitlogo-removebg-preview.png',
              description: 'SECP registered software engineering company building enterprise AI systems, web platforms, mobile apps, and cloud infrastructure.',
              foundingDate: '2024',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Nawabshah',
                addressRegion: 'Sindh',
                addressCountry: 'PK',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+92-319-0375751',
                contactType: 'customer service',
                email: 'contactus@orbit-i.tech',
                availableLanguage: ['English', 'Urdu'],
              },
              sameAs: [
                'https://linkedin.com/company/orbit-i',
              ],
              serviceArea: {
                '@type': 'Place',
                name: 'Pakistan and Global',
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Software Engineering Services',
                itemListElement: [
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Enterprise AI & Machine Learning Solutions' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Web Application Development' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile Application Development' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Software Solutions' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cloud & DevOps Engineering' } },
                ],
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
