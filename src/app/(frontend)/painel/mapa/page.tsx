"use client";
import dynamic from "next/dynamic";

const WithCustomLoading = dynamic(
  () =>
    import("../../../../app/(frontend)/painel/mapa/components/SupportersMap").then(
      (mod) => mod.SupportersMap
    ),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export default function MapPage() {
  return <WithCustomLoading />;
}
