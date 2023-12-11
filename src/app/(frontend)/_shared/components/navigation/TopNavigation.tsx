import clsx from "clsx";

interface TopNavigationProps {
  children: React.ReactNode;
  className?: string;
}

export function TopNavigation(props: TopNavigationProps) {
  const { children, className } = props;
  return (
    <nav
      className={clsx(
        "w-100 fixed left-0 right-0 top-0 items-center border-t border-gray-200 bg-white",
        className
      )}
    >
      {children}
    </nav>
  );
}
