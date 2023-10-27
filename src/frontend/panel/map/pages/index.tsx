"use client";
import dynamic from "next/dynamic";

const WithCustomLoading = dynamic(
  () => import("../components/SupportersMap").then((mod) => mod.SupportersMap),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export function MapPage() {
  return <WithCustomLoading />;
}
