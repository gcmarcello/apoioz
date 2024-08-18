const sizeVariants = {
  small: { height: "h-[16px]", width: "w-[16px]" },
  medium: { height: "h-[20px]", width: "w-[20px]" },
  large: { height: "h-[24px]", width: "w-[24px]" },
};

export function LoadingSpinner() {
  return (
    <div>
      <svg className="h-12 w-12 animate-spin" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}

export function ButtonSpinner({
  size = "small",
}: {
  size?: keyof typeof sizeVariants;
}) {
  return (
    <div className={`flex ${sizeVariants[size]?.height}`}>
      <svg
        className={`${sizeVariants[size]?.width} animate-spin`}
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}
