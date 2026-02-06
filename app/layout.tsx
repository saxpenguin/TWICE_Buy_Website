import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/lib/context/CartContext";

export const metadata: Metadata = {
  title: "PingPing小舖 - TWICE 周邊代購",
  description: "專業 TWICE 周邊商品代購服務，提供二階段付款機制",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
