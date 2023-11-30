import clsx from "clsx";

interface BottomNavigationProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomNavigation(props: BottomNavigationProps) {
  const { children, className } = props;
  return (
    <nav
      className={clsx(
        "fixed bottom-0 left-0 right-0 flex items-center justify-end  border-t border-gray-200 bg-white",
        className
      )}
    >
      <div className="mx-3 space-x-3">{children}</div>
    </nav>
  );
}
