import CookieConsentBanner from "@/components/CookieConsentBanner";
import Footer from "@/components/footer";
import MatomoScript from "@/components/MatomoScript";
import NavigationMenu from "@/components/navigation-menu";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FreeHunt",
  description: "Où entreprises et freelances se rencontrent",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${montserrat.className} antialiased min-h-screen`}>
        <MatomoScript />
        <NavigationMenu />
        <main>{children}</main>
        <Footer />
        <CookieConsentBanner />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
