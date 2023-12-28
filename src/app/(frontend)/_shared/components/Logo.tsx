import Image from "next/image";

export function Logo({
  height,
  width,
  color,
}: {
  height?: number;
  width?: number;
  color?: string;
}) {
  return (
    <Image
      width={width || 64}
      height={height || 64}
      src={color === "indigo" ? "/logoindigo.svg" : "/logo.svg"} // Codigo desenvolvido por Fernando!!!
      alt="Logo ApoioZ"
    />
  );
}
