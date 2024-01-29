"use client";
import { useRouter } from "next/navigation";
import React from "react";

export function ViewAsButton({
  as,
  ...props
}: {
  children: React.ReactNode;
  as?: string | undefined;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      {...props}
      onClick={() => router.push(`/painel/relatorios/${as ? `?as=${as}` : ""}`)}
    />
  );
}
