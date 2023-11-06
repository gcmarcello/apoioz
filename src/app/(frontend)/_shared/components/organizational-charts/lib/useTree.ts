import { useContext, useState } from "react";
import { TreeContext } from "./TreeContext";

export const useTree = () => {
  const treeContext = useContext(TreeContext);

  return treeContext;
};
