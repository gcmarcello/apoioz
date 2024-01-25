import clsx from "clsx";

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={clsx(
        "text-base font-semibold leading-7 text-gray-900",
        className
      )}
    >
      {children}
    </h1>
  );
}
