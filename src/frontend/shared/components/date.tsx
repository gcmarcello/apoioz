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
      <div className="flex bg-gray-400 p-1 animate-pulse w-1/2 rounded-sm"></div>
    );

  return <div className={className}>{date}</div>;
}
