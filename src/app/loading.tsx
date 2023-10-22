import LoadingSpinner from "@/frontend/shared/components/loadingSpinner";

export default async function Loading() {
  return (
    <div className="w-100 my-64 flex justify-center">
      <LoadingSpinner />
    </div>
  );
}
