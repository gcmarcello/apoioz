import { useContext, useState } from "react";
import { PanelContext } from "../contexts/panel.ctx";
import { SidebarContext } from "../contexts/sidebar.ctx";

export const useSidebar = () => {
  const sidebarContext = useContext(SidebarContext);

  return sidebarContext;
};
