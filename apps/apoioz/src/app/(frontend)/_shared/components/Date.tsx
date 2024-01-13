"use client";

import { useEffect, useState } from "react";

export function Date({
  value,
  className,
}: {
  value: string | number;
  className?: string;
}) {
  const [date, setDate] = useState<string | number>("");

  useEffect(() => {
    setDate(value);
  }, [value]);

  if (!date)
    return (
      <div className="flex h-4 w-20 animate-pulse rounded-sm bg-gray-400 p-1"></div>
    );

  return <div className={className}>{date}</div>;
}
