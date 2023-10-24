import { useContext, useState } from "react";
import { PanelContext } from "../contexts/panel.ctx";

export const usePanel = () => {
  const { showToast, setShowToast, siteURL, user, campaign, setCampaign, supporter } =
    useContext(PanelContext);

  return {
    showToast,
    setShowToast,
    siteURL,
    user,
    campaign,
    setCampaign,
    supporter,
  };
};
