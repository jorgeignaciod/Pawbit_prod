import type { Metadata } from "next";
import "@fontsource/inter";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "PawBit",
  description: "Registra, recuerda y cuida"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
