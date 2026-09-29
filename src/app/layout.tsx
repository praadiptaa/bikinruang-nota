import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BIKINRUANG — Event Expense & Nota Management',
  description: 'Aplikasi internal pencatatan pengeluaran event, nota foto, budget tracking, dan laporan keuangan Bikinruang Workshop Atelier.',
  icons: {
    icon: '/Default Fill Vertical.png?v=br',
    shortcut: '/Default Fill Vertical.png?v=br',
    apple: '/Default Fill Vertical.png?v=br',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link rel="icon" type="image/png" href="/Default Fill Vertical.png?v=br" />
        <link rel="apple-touch-icon" href="/Default Fill Vertical.png?v=br" />
      </head>
      <body className="min-h-screen bg-studio-white text-workshop-black dark:bg-workshop-black dark:text-studio-white selection:bg-brand-yellow selection:text-workshop-black font-sans">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
