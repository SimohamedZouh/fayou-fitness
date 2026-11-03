import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FAYOU Fitness : matériel de sport neuf et d'occasion",
  description:
    "Vente, installation, maintenance et aménagement de salles de sport au Maroc. Depuis 2006. Qualité. Performance. Confiance.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${display.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
