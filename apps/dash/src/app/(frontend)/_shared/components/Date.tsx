"use client";

export function Date({
  value,
  className,
}: {
  value: string | number;
  className?: string;
}) {
  return (
    <div suppressHydrationWarning={true} className={className}>
      {value}
    </div>
  );
}
