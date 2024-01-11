import Image from "next/image";

export function Logo({
  height,
  width,
  size,
  color,
  className,
  url,
}: {
  height?: number;
  width?: number;
  size?: number;
  color?: string;
  className?: string;
  url?: string;
}) {
  return (
    <Image
      className={className}
      width={width || size || 64}
      height={height || size || 64}
      src={url || "/logo.jpg"}
      alt="Logo"
    />
  );
}
