import type { Metadata, Viewport } from "next";
import "@fontsource/inter";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "PawBit",
  description: "Registra, recuerda y cuida"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
