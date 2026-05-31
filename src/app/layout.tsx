import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { NotationProvider } from "@/context/NotationContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Quantum Origins | La Catástrofe Ultravioleta",
  description: "Un viaje interactivo de scrollytelling por el nacimiento de la física cuántica, integrando explicaciones visuales con la rigurosidad matemática de Landau & Lifshitz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${sourceSerif.variable} antialiased scroll-smooth`}>
      <body className="bg-bg text-text-primary min-h-screen flex flex-col font-sans select-none overflow-x-hidden">
        <NotationProvider>
          {children}
        </NotationProvider>
      </body>
    </html>
  );
}
