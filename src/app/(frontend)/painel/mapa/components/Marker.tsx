import { Marker as _Marker } from "react-leaflet";

import { ComponentProps, ReactNode } from "react";

export function Marker({
  children,
  ...props
}: {
  children: ReactNode;
  customOptions: {
    supportersCount: number;
  };
} & ComponentProps<typeof _Marker>) {
  return <Marker {...props}>{children}</Marker>;
}
