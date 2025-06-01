import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '../theme/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema WillInox',
  description: 'Pagina moderna para o sistema da empresa willinox',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}