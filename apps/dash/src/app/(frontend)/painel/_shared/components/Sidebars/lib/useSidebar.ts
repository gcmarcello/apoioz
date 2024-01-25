import { useContext, useState } from "react";
import { SidebarContext } from "./sidebar.ctx";

export const useSidebar = () => {
  const sidebarContext = useContext(SidebarContext);

  return sidebarContext;
};
