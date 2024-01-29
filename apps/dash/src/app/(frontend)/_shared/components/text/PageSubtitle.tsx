import clsx from "clsx";

export function PageSubtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={clsx("text-base leading-7 text-gray-600", className)}>
      {children}
    </p>
  );
}
