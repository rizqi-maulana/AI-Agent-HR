import type { Metadata } from "next";
import "./globals.css";
import ContextProvider from "@/context";

export const metadata: Metadata = {
  title: "Ai Agent HR",
  description:
    "A smart solution for your human resource management. Optimize HR processes with efficient and innovative AI technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  );
}
