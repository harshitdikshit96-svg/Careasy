import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import VisitTracker from "@/components/analytics/VisitTracker";
import "./globals.css";

export const metadata = {
  title: "CarEasy | Used Car Marketplace MVP",
  description: "A premium prototype PWA for browsing and comparing used cars.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <VisitTracker />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
