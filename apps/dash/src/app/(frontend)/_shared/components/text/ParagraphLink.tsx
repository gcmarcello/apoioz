import Link from "next/link";

export function ParagraphLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="font-semibold text-rose-600 hover:text-rose-500"
    >
      {children}
    </Link>
  );
}
