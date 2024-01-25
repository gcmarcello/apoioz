export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
      {children}
    </h1>
  );
}
