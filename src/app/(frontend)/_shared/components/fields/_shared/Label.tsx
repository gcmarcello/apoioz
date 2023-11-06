export function Label({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="mb-3 block text-sm font-medium text-black">
      {children}
    </label>
  );
}
