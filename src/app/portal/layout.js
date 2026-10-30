export const metadata = {
  title: 'Client Portal | ORBIT-I Private Limited',
  description: 'Authorized client access portal for tracking software deliverables, milestones, and sprint status.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
}

export default function PortalLayout({ children }) {
  return children
}
