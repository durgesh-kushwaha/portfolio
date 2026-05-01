import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ThemeProvider } from "../components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], weight: ['300','400','500','600','700','800','900'] });

export const metadata: Metadata = {
  title: "Durgesh Kushwaha | AI & Data Science Student",
  description: "Portfolio of Durgesh Kushwaha — B.Tech AI & Data Science student, Data Analytics Intern, and aspiring technologist.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="data-theme" defaultTheme="light">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
