import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://password-manager-kohl-phi.vercel.app'),
  title: 'SecurePass - Zero-Knowledge Password Manager',
  description: 'The most secure password manager with military-grade encryption. Store unlimited passwords with zero-knowledge security. Start free, upgrade to Pro for $3/month.',
  keywords: 'password manager, zero-knowledge, encryption, security, AES-256, secure passwords',
  authors: [{ name: 'SecurePass Team' }],
  openGraph: {
    title: 'SecurePass - Zero-Knowledge Password Manager',
    description: 'Store unlimited passwords with military-grade encryption. Zero-knowledge security means even we can\'t see your data.',
    url: 'https://password-manager-kohl-phi.vercel.app',
    siteName: 'SecurePass',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'SecurePass Password Manager'
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SecurePass - Zero-Knowledge Password Manager',
    description: 'The most secure password manager with military-grade encryption.',
    images: ['/twitter-image.jpg'],
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
  verification: {
    google: 'google0824e4c5c0ef59da',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WWY0GMTNQ5"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WWY0GMTNQ5');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'SecurePass',
              description: 'Zero-knowledge password manager with military-grade encryption',
              applicationCategory: 'SecurityApplication',
              operatingSystem: 'Web, iOS, Android',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                priceValidUntil: '2025-12-31',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1250',
              },
            }),
          }}
        />
      </body>
    </html>
  );
}