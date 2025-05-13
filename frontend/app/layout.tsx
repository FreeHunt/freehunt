import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import NavigationMenu from "@/components/navigation-menu";
import MatomoScript from "@/components/MatomoScript";

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
      </body>
    </html>
  );
}
