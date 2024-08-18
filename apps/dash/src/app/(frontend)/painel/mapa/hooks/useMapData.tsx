"use client";
import { useFormContext } from "react-hook-form";
import { MapContext, MapContextProps } from "../providers/MapDataProvider";
import React, { useContext, useRef } from "react";

export const useMapData = () => {
  const mapContext = useContext(MapContext);

  return mapContext;
};
