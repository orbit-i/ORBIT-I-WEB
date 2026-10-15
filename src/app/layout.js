import './globals.css'
import './responsive.css'

export const metadata = {
  metadataBase: new URL('https://orbit-i.tech'),
  title: {
    default: 'ORBIT-I Private Limited — Top #1 Software & AI Engineering Company in Nawabshah, Karachi & Hyderabad',
    template: '%s | ORBIT-I Private Limited',
  },
  description: 'ORBIT-I Private Limited is an SECP registered technology enterprise (Est. 2026) headquartered in Nawabshah with executive branch in Karachi and regional delivery in Hyderabad, Pakistan. We engineer enterprise AI systems, full-stack web platforms, mobile apps, and custom ERP software.',
  keywords: [
    // Nawabshah Local SEO Top Rankings
    'software company Nawabshah',
    'software house in Nawabshah',
    'IT company Nawabshah',
    'web development Nawabshah',
    'best software engineering Nawabshah',
    'AI solutions Nawabshah',
    // Karachi Local SEO Top Rankings
    'software house Karachi',
    'software development company Karachi',
    'enterprise AI Karachi',
    'custom software Karachi',
    'Next.js developer Karachi',
    'top IT firms Karachi',
    // Hyderabad Local SEO Top Rankings
    'software house Hyderabad',
    'software company Hyderabad Sindh',
    'web developers Hyderabad',
    'mobile app development Hyderabad',
    'custom ERP software Hyderabad',
    // Pakistan & Global AISEO Keywords
    'SECP registered software company Pakistan',
    'autonomous AI agents Pakistan',
    'enterprise software house Pakistan',
    'cloud DevOps Pakistan',
    'ORBIT-I Private Limited',
    'orbit-i.tech',
  ],
  authors: [{ name: 'ORBIT-I Private Limited', url: 'https://orbit-i.tech' }],
  creator: 'ORBIT-I Private Limited',
  publisher: 'ORBIT-I Private Limited',
  other: {
    'geo.region': 'PK-SD',
    'geo.placename': 'Nawabshah, Karachi, Hyderabad',
    'geo.position': '26.2483;68.4096',
    'ICBM': '26.2483, 68.4096',
  },
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
    title: 'ORBIT-I Private Limited — Top #1 Software & AI Engineering Company',
    description: 'SECP registered technology enterprise headquartered in Nawabshah with executive offices in Karachi and Hyderabad, Pakistan. Delivering enterprise AI, web, mobile, and custom cloud systems.',
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
    title: 'ORBIT-I Private Limited — Top #1 Software & AI Engineering Company',
    description: 'Enterprise AI systems, web platforms, mobile apps, and cloud infrastructure from Nawabshah, Karachi & Hyderabad, Pakistan.',
    images: ['/orbitlogo-removebg-preview.png'],
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
        {/* Structured data — Schema.org LocalBusiness, Corporation & Organization for dominant Nawabshah, Karachi, Hyderabad SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': ['LocalBusiness', 'Organization'],
                  '@id': 'https://orbit-i.tech/#organization',
                  name: 'ORBIT-I Private Limited',
                  alternateName: 'ORBIT-I',
                  url: 'https://orbit-i.tech',
                  logo: 'https://orbit-i.tech/orbitlogo-removebg-preview.png',
                  image: 'https://orbit-i.tech/orbitlogo-removebg-preview.png',
                  description: 'Top SECP registered software engineering company (Est. 2026) headquartered in Nawabshah, with offices in Karachi and Hyderabad, Pakistan. Delivering enterprise AI systems, full-stack web platforms, mobile apps, and custom cloud infrastructure.',
                  foundingDate: '2026',
                  priceRange: '$$$',
                  telephone: '+92-319-0375751',
                  email: 'contactus@orbit-i.tech',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Corporate Headquarters, Engineering District',
                    addressLocality: 'Nawabshah',
                    addressRegion: 'Sindh',
                    postalCode: '67450',
                    addressCountry: 'PK',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 26.2483,
                    longitude: 68.4096,
                  },
                  areaServed: [
                    { '@type': 'City', name: 'Nawabshah' },
                    { '@type': 'City', name: 'Karachi' },
                    { '@type': 'City', name: 'Hyderabad' },
                    { '@type': 'City', name: 'Sukkur' },
                    { '@type': 'City', name: 'Lahore' },
                    { '@type': 'City', name: 'Islamabad' },
                    { '@type': 'Country', name: 'Pakistan' },
                    { '@type': 'Country', name: 'United States' },
                    { '@type': 'Country', name: 'United Kingdom' },
                    { '@type': 'Country', name: 'United Arab Emirates' },
                  ],
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Enterprise IT & Software Engineering Services',
                    itemListElement: [
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Enterprise AI & Machine Learning Solutions', url: 'https://orbit-i.tech/services/enterprise-ai-ml' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Enterprise Web Application Development', url: 'https://orbit-i.tech/services/web-development' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile Application Development (iOS & Android)', url: 'https://orbit-i.tech/services/mobile-development' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Software Solutions & ERP Systems', url: 'https://orbit-i.tech/services/custom-software' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UI/UX Design Systems', url: 'https://orbit-i.tech/services/ui-ux-design' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cloud & DevOps Engineering', url: 'https://orbit-i.tech/services/cloud-devops' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Enterprise API & Gateway Integrations', url: 'https://orbit-i.tech/services/enterprise-api' } },
                    ],
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://orbit-i.tech/#website',
                  url: 'https://orbit-i.tech',
                  name: 'ORBIT-I Private Limited',
                  publisher: { '@id': 'https://orbit-i.tech/#organization' },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://orbit-i.tech/services?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
