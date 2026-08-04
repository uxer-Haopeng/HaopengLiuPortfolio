import type { Metadata } from 'next';
import { Cormorant_Garamond, Karla, Holtwood_One_SC, Roboto } from 'next/font/google';
import './globals.css';
import './desk-scene.css';
import { GA_MEASUREMENT_ID } from '@/lib/analytics/config';
import GoogleAnalyticsPageview from '@/lib/analytics/GoogleAnalyticsPageview';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-karla',
  display: 'swap',
});

const holtwood = Holtwood_One_SC({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-holtwood',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Haopeng Liu Portfolio',
  description: 'UX Designer — I treat every design challenge like a maze.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${karla.variable} ${holtwood.variable} ${roboto.variable}`}>
      <head>
        {/* Google Analytics (GA4) — Measurement ID lives in lib/analytics/config.ts.
            send_page_view is off here; GoogleAnalyticsPageview below fires the
            pageview for every route, including the first one. */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
            `,
          }}
        />
      </head>
      <body>
        <GoogleAnalyticsPageview />
        {children}
      </body>
    </html>
  );
}
