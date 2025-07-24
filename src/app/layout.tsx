import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/contexts/CartContext"; // CartProviderをインポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GPTs Game Store",
  description: "A store for GPTs games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* CartProviderで全体をラップ */}
        <CartProvider>
          <Header />
          <main className="bg-gray-900 text-white min-h-screen">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}