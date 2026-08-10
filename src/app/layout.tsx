import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liga Del Ente",
  description: "Comandos, posiciones e historial de Liga Del Ente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
