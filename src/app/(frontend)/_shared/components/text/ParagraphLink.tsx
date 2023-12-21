import Link from "next/link";

export function ParagraphLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href} className="font-semibold text-indigo-600 hover:text-indigo-500">
      {children}
    </Link>
  );
}
