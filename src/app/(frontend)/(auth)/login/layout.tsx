import "../../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ApoioZ - Login",
  description: "Página de Login",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <main className="h-screen">{children}</main>;
}
