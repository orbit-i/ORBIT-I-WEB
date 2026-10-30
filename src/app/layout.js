import './globals.css'
import './responsive.css'
import SiteNoticeBar from '@/components/SiteNoticeBar'
import AIChatbot from '@/components/AIChatbot'
import ScrollProgressBar from '@/components/ScrollProgressBar'
import UtmTracker from '@/components/UtmTracker'
import BackToTop from '@/components/BackToTop'
import FloatingContactButton from '@/components/FloatingContactButton'
import AnalyticsClientTracker from '@/components/AnalyticsClientTracker'
import MaintenanceGuard from '@/components/MaintenanceGuard'

export const metadata = {
  metadataBase: new URL('https://orbit-i.tech'),
  title: {
    default: 'ORBIT-I | Software & AI Development in Nawabshah & Karachi',
    template: '%s | ORBIT-I Private Limited',
  },
  description: 'SECP-registered software company building AI systems, web and mobile apps, and custom software. Request a consultation.',
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
    title: 'ORBIT-I | Software & AI Engineering Company',
    description: 'SECP-registered software company building AI systems, web and mobile apps, and custom software from Nawabshah & Karachi, Pakistan.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ORBIT-I Private Limited — Software & AI Engineering Company',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ORBIT-I | Software & AI Engineering Company',
    description: 'SECP-registered software company building AI systems, web and mobile apps, and custom software.',
    images: ['/og-image.jpg'],
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
        {/* Structured data — Schema.org Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://orbit-i.tech/#organization',
                  name: 'ORBIT-I Private Limited',
                  alternateName: 'ORBIT-I',
                  url: 'https://orbit-i.tech',
                  logo: 'https://orbit-i.tech/orbitlogo-removebg-preview.png',
                  image: 'https://orbit-i.tech/og-image.jpg',
                  description: 'SECP-registered software and AI engineering company headquartered in Nawabshah with executive branch in Karachi, Pakistan. Delivering enterprise AI systems, web platforms, mobile apps, and custom software.',
                  telephone: '+92-319-0375751',
                  email: 'contactus@orbit-i.tech',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Nawabshah',
                    addressLocality: 'Nawabshah',
                    addressRegion: 'Sindh',
                    postalCode: '67450',
                    addressCountry: 'PK',
                  },
                  sameAs: [
                    'https://www.linkedin.com/company/orbit-i-private-limited/',
                    'https://www.facebook.com/orbitiprivatelimited',
                    'https://www.instagram.com/orbiti_private_limited',
                    'https://www.tiktok.com/@orbitiprivatelimited',
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
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <MaintenanceGuard />
        <ScrollProgressBar />
        <UtmTracker />
        <AnalyticsClientTracker />
        <SiteNoticeBar />
        <div id="main-content">
          {children}
        </div>
        <FloatingContactButton />
        <BackToTop />
        <AIChatbot />
      </body>
    </html>
  )
}
