import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';

// Initialize application on startup
// Note: This runs on server-side during Next.js initialization
if (typeof window === 'undefined') {
  // Only run on server
  import('@/lib/startup/init').then(({ initializeApplication }) => {
    initializeApplication().catch((error) => {
      console.error('Failed to initialize application:', error);
    });
  });
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LUMINES - Browser-Based Unity IDE',
  description: 'A comprehensive Unity development IDE running entirely in the browser',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
