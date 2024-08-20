import { LoadingSpinner } from "../_shared/components/Spinners";

export default function Loading({ children }: { children?: React.ReactNode }) {
  return (
    <div className="my-64 flex w-full flex-col items-center justify-center gap-4">
      {children && <div>{children}</div>}
      <LoadingSpinner />
    </div>
  );
}
