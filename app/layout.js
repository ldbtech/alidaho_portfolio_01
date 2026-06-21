import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PortfolioModeProvider } from './contexts/PortfolioModeContext';
import DynamicFavicon from './components/DynamicFavicon';
import ScrollProgress from './components/ScrollProgress';
import ChatBot from './components/ChatBot';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Ali Daho - Portfolio',
  description: 'Software Engineer Portfolio',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GPP2ZNKXNM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GPP2ZNKXNM', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ScrollProgress />
        <ChatBot />
        <DynamicFavicon />
        <ThemeProvider>
          <LanguageProvider>
            <PortfolioModeProvider>
              {children}
            </PortfolioModeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
