import './globals.css';

import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import Header from '@/components/header';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E Auction - ARG Supply Tech',
  description: 'Online bidding module - ARG Supply Tech',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <UserProvider>
        <body className={inter.className}>
          <NextTopLoader crawl={true} easing="ease" />
          <Header />
          <div className="page-wrapper container mx-auto">{children}</div>
        </body>
      </UserProvider>
    </html>
  );
}
