"use client";

import React, { useEffect, useState } from "react";
import { PanelContext } from "../contexts/panel.ctx";
import { getLatestSupporters } from "../../resources/panel/server/mainStats";

export default function PanelProvider({ children }: { children: React.ReactNode }) {
  const [updatingLatestSupporters, setUpdatingLatestSupporters] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, title: "", message: "" });
  const [siteURL, setSiteURL] = useState("");

  const fetchLatestSupporters = async (userId: string, campaignId: string) => {
    return await getLatestSupporters(userId, campaignId);
  };

  useEffect(() => {
    setSiteURL(document.location.origin);
  }, []);

  return (
    <PanelContext.Provider
      value={{
        updatingLatestSupporters,
        setUpdatingLatestSupporters,
        fetchLatestSupporters,
        showToast,
        setShowToast,
        siteURL,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}
