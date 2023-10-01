import { useContext, useState } from "react";
import { PanelContext } from "../contexts/panel.ctx";
import { getLatestSupporters } from "../../resources/panel/server/mainStats";

export const usePanel = () => {
  const {
    setUpdatingLatestSupporters,
    updatingLatestSupporters,
    fetchLatestSupporters,
    showToast,
    setShowToast,
    siteURL,
  } = useContext(PanelContext);

  return {
    setUpdatingLatestSupporters,
    updatingLatestSupporters,
    fetchLatestSupporters,
    showToast,
    setShowToast,
    siteURL,
  };
};
