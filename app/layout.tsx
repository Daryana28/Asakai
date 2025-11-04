import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Shell from "./components/Shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard Production Performance",
  description: "Asakai dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
