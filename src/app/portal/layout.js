export const metadata = {
  title: 'Client Portal & Project Milestone Tracker | ORBIT-I Private Limited',
  description: 'Client access portal for tracking real-time software development milestones, deliverables, repository releases, and sprint reports.',
  keywords: [
    'client portal',
    'project tracking',
    'ORBIT-I login',
    'milestone tracking',
  ],
  openGraph: {
    title: 'Client Portal | ORBIT-I Private Limited',
    description: 'Track software milestones, deliverables, and releases in real-time.',
    url: 'https://orbit-i.tech/portal',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/orbitlogo-removebg-preview.png', width: 512, height: 512, alt: 'ORBIT-I Portal' }],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/portal',
  },
}

export default function PortalLayout({ children }) {
  return children
}
