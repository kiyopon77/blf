// app/layout.tsx
import "./globals.css";
import { Metadata } from "next";
import { Inter } from 'next/font/google'
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "BLF Inventory Management",
  description: "BLF Inventory Management",
};

// handles root layout functionality
export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
      <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  );
}
