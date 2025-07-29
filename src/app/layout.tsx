import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    template: "%s | PICNG",
    default: "PICNG"
  },
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/picng_fav.png" type="image/png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"></link>
      </head>
      <body
        className={`${inter.variable} font-sans antialiased group`}
      >
        <Providers>
          <Toaster 
            position="top-right" 
            theme="light"
            richColors
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
