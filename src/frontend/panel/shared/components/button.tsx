import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

const buttonDictionary = {
  primary:
    "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600 text-white",
  secondary:
    "bg-white hover:bg-gray-50 text-gray-900 focus-visible:outline-white ring-gray-300",
};

export function Button({ children, onClick, className, variant }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        className ||
          "rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        buttonDictionary[variant || "primary"]
      )}
    >
      {children}
    </button>
  );
}
