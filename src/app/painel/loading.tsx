import LoadingSpinner from "../../common/components/loadingSpinner";

export default async function Loading() {
  return (
    <div className="flex w-100 justify-center my-64">
      <LoadingSpinner />
    </div>
  );
}
