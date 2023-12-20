import "../../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ApoioZ - Recuperar Senha",
  description: "Página de Recupera;ão de Senha",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <main className="h-screen">{children}</main>;
}
