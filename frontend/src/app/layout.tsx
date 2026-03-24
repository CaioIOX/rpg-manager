import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "RPG Manager — Gerencie suas Campanhas",
  description:
    "Gerencie suas campanhas de RPG de mesa com documentos colaborativos, templates e organização inteligente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(13, 17, 23, 0.95)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              color: "#fff",
              backdropFilter: "blur(10px)",
            },
            className: "font-sans",
          }}
        />
      </body>
    </html>
  );
}
