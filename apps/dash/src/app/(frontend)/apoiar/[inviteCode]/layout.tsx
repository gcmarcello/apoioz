import "../../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ApoioZ - Novo Apoiador",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 flex w-full items-center justify-center bg-white px-6 pb-16 lg:mt-12 lg:px-8">
      <div className="mx-auto max-w-2xl ">{children}</div>
    </div>
  );
}
