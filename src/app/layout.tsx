import type { Metadata } from 'next';
import './globals.css';
import { MainContainer } from '@/components/app/main-container';
import { Footer } from '@/components/app/footer';

export const metadata: Metadata = {
  title: 'Live, Laugh, Zot',
  description: 'Live, Laugh, and Zot with your pals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body suppressHydrationWarning>
        <MainContainer>
          {children}
          <Footer />
        </MainContainer>
      </body>
    </html>
  );
}
