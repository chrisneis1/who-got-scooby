import type { Metadata } from "next";
import { Bangers, Poppins } from "next/font/google";
import "./globals.css";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Who Got Scooby? | A Mystery Inc. Party",
  description: "Scooby-Doo is missing. Find your character, learn your alibi, and help solve the case.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bangers.variable} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
