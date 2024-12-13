import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { HeartFilledIcon } from '@radix-ui/react-icons';
import ChangeThemeButton from '@/components/ChangeThemeButton';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Youtube to MP3',
  description: 'Convert Youtube videos to MP3 files',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
              {children}
            </main>
            <footer className="row-start-3">
              <span className="text-sm flex items-center flex-row">
                Made with{' '}
                <HeartFilledIcon className="w-3 h-3 text-red-500 mx-2" /> by
                <a
                  className="hover:underline hover:underline-offset-4 ml-1"
                  href="https://github.com/kadaradam"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  kadaradam
                </a>
              </span>
            </footer>
          </div>
          <ChangeThemeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
