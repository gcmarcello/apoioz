import "./globals.css";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Mocker } from "./_shared/components/Mocker";
import { isDev } from "@/_shared/utils/settings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApoioZ",
  description: "Faça parte da mudança!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster position="bottom-right" />
        {isDev && <Mocker />}
      </body>
    </html>
  );
}
