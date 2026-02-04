import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "TWICE Proxy - K-pop Merchandise Buying Service",
  description: "Professional proxy buying service for TWICE merchandise with two-stage payment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
