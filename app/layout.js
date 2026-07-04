import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import VisitTracker from "@/components/analytics/VisitTracker";
import ServiceWorkerRegistrar from "@/components/shared/ServiceWorkerRegistrar";
import "./globals.css";

export const metadata = {
  title: "CarEasy | Used Car Marketplace",
  description: "Browse and compare premium used cars near you.",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CarEasy",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <ServiceWorkerRegistrar />
        <Navbar />
        <VisitTracker />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
