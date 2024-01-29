"use client"; // Error components must be Client Components

import ErrorAlert from "../../_shared/components/alerts/errorAlert";

export default function Error({ error }: { error: any }) {
  return (
    <div className="h-screen bg-red-50">
      <ErrorAlert errors={[error]} />
    </div>
  );
}
