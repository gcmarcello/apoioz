import Link from "next/link";

interface PageHeaderProps {
  title: string;
  primaryButton?: LinkButtonProps;
  secondaryButton?: LinkButtonProps;
}

interface LinkButtonProps {
  href: string;
  text: string;
}

export default function PageHeader({
  title,
  primaryButton,
  secondaryButton,
}: PageHeaderProps) {
  return (
    <div className="mb-5 md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
      </div>
      <div className="mt-4 flex md:ml-4 md:mt-0">
        {secondaryButton && (
          <Link
            type="button"
            href={secondaryButton.href}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {secondaryButton.text}
          </Link>
        )}
        {primaryButton && (
          <Link
            type="button"
            href={primaryButton.href}
            className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {primaryButton.text}
          </Link>
        )}
      </div>
    </div>
  );
}
