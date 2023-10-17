import { useContext, useState } from "react";
import { PanelContext } from "../contexts/panel.ctx";

export const usePanel = () => {
  const {
    setUpdatingLatestSupporters,
    updatingLatestSupporters,
    fetchLatestSupporters,
    showToast,
    setShowToast,
    siteURL,
    user,
    campaign,
    setCampaign,
    supporter,
  } = useContext(PanelContext);

  return {
    setUpdatingLatestSupporters,
    updatingLatestSupporters,
    fetchLatestSupporters,
    showToast,
    setShowToast,
    siteURL,
    user,
    campaign,
    setCampaign,
    supporter,
  };
};
