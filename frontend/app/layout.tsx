import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Chatbot from "../components/layout/Chatbot";
import Protection from "../components/layout/Protection";
import ConsultationModal from "../components/layout/ConsultationModal";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Deero Advert",
  description: "Deero Advert is a premier advertising agency specializing in Graphic Design, Digital Marketing, Web Solutions, and Strategic Business Growth.",
  icons: {
    icon: "/1-2.jpg?v=final",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased overflow-x-clip`}
      >
        <Protection />
        <CartProvider>
          {children}
        </CartProvider>
        <ConsultationModal />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 5000,
            style: { maxWidth: '420px' },
            success: { iconTheme: { primary: '#EB4724', secondary: '#fff' } },
          }}
        />
        <Chatbot />
      </body>
    </html>
  );
}
