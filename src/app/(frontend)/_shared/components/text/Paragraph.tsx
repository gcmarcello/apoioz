import clsx from "clsx";
import React from "react";

export default function Paragraph({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={clsx("text-sm leading-6 text-gray-500", className)}>{children}</p>;
}
