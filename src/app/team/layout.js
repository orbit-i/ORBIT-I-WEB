export const metadata = {
  title: 'Executive Leadership & Engineering Team | ORBIT-I Private Limited',
  description: 'Meet the founders, software architects, AI researchers, and engineering leads driving ORBIT-I Private Limited across Nawabshah and Karachi.',
  keywords: [
    'ORBIT-I team',
    'software architects Nawabshah',
    'AI researchers Karachi',
    'leadership team ORBIT-I',
    'engineers Sindh',
  ],
  openGraph: {
    title: 'Executive Leadership & Engineering Team | ORBIT-I Private Limited',
    description: 'Meet the founders, software architects, and engineering leads at ORBIT-I.',
    url: 'https://orbit-i.tech/team',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/orbitlogo-removebg-preview.png', width: 512, height: 512, alt: 'ORBIT-I Team' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Executive Leadership & Engineering Team | ORBIT-I Private Limited',
    description: 'Meet the engineering leads and founders of ORBIT-I.',
    images: ['/orbitlogo-removebg-preview.png'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/team',
  },
}

export default function TeamLayout({ children }) {
  return children
}
