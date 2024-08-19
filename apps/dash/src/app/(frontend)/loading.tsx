import { LoadingSpinner } from "./_shared/components/Spinners";

export default async function Loading() {
  return (
    <div className="my-64 flex w-full flex-col items-center justify-center">
      <div className="text-sm text-zinc-400">Carregando...</div>
      <LoadingSpinner />
    </div>
  );
}
