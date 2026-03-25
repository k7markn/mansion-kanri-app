import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "マンション管理組合アプリ",
  description: "マンション管理組合向け業務支援アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
