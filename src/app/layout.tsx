import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "franluca",
  description: "Comandos, posiciones e historial de Liga Del Ente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
