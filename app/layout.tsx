import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import AdminLink from "@/components/admin-link";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Release Notes",
  description: "Internet's most chaotic show for designers, engineers, and AI builders.",
  openGraph: {
    title: "Release Notes",
    description: "Internet's most chaotic show for designers, engineers, and AI builders.",
    images: ['/img/opengraph.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Release Notes",
    description: "Internet's most chaotic show for designers, engineers, and AI builders.",
    images: ['/img/twitter.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--background)] text-[var(--text-primary)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <AdminLink />
        </ThemeProvider>
      </body>
    </html>
  );
}
