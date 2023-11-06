"use client";

import dynamic from "next/dynamic";

export const NoSsrTreeComponent = dynamic(() => import("./TreeComponent"), {
  ssr: false,
});
