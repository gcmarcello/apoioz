"use client"; // Error components must be Client Components

import { useEffect } from "react";
import ErrorAlert from "../../_shared/components/alerts/errorAlert";

export default function Error({ error }: { error: string }) {
  return (
    <div className="h-screen bg-red-50">
      <ErrorAlert errors={[error]} />
    </div>
  );
}
