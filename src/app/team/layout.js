export const metadata = {
  title: 'Engineering Team & Leadership | ORBIT-I Private Limited',
  description: 'Meet the founders, software architects, AI researchers, and engineering leads driving ORBIT-I Private Limited across Nawabshah and Karachi.',
  openGraph: {
    title: 'Engineering Team & Leadership | ORBIT-I Private Limited',
    description: 'Meet the founders, software architects, and engineering leads at ORBIT-I.',
    url: 'https://orbit-i.tech/team',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ORBIT-I Engineering Team' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Team & Leadership | ORBIT-I Private Limited',
    description: 'Meet the engineering leads and founders of ORBIT-I.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/team',
  },
}

export default function TeamLayout({ children }) {
  return children
}
