import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { neobrutalism } from "@clerk/themes";
import Image from "next/image";

import arcjet, { shield, detectBot, request } from "@arcjet/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Servd - AI Recipes Platform",
  description: "",
};

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
    }),
  ],
});

export default async function RootLayout({ children }) {
  const req = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    return (
      <html lang="en">
        <head>
          <title>Access Denied</title>
        </head>
        <body className="min-h-screen flex items-center justify-center bg-stone-50">
          <div className="text-center p-8 bg-white border-2 border-red-200 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-stone-600">Your request was blocked by our security system.</p>
          </div>
        </body>
      </html>
    );
  }
  return (
    <ClerkProvider
      appearance={{
        baseTheme: neobrutalism,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />

          {/* Footer */}
          <footer className="py-8 px-4 border-t">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Servd Logo"
                  width={48}
                  height={48}
                  className="w-14"
                />
              </div>
              <p className="text-stone-500 text-sm">
                Made by Madhav Vyas and Manisha
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
