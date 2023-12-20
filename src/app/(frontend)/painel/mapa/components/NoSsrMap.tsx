import { LoadingSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import dynamic from "next/dynamic";

export const NoSsrMap = dynamic(
  () => import("@/app/(frontend)/painel/mapa/components/Map"),
  {
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    ),
    ssr: false,
  }
);
