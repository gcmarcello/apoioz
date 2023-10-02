"use client";

import React, { useEffect, useState } from "react";
import { PanelContext } from "../contexts/panel.ctx";
import { getLatestSupporters } from "../../resources/panel/server/mainStats";
import { findUser } from "../../resources/api/services/user";
import { getCampaign } from "../../resources/api/services/campaign";
import { cookies } from "next/headers";

export default function PanelProvider({
  children,
  userId,
  activeCampaignId,
}: {
  children: React.ReactNode;
  userId: string;
  activeCampaignId: string | undefined;
}) {
  const [updatingLatestSupporters, setUpdatingLatestSupporters] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, title: "", message: "" });
  const [siteURL, setSiteURL] = useState("");
  const [user, setUser] = useState<any>("");
  const [campaign, setCampaign] = useState<any>(null);

  const fetchLatestSupporters = async (userId: string, campaignId: string) => {
    return await getLatestSupporters(userId, campaignId);
  };

  useEffect(() => {
    setSiteURL(document.location.origin);
    findUser({ id: userId }).then((data) => setUser(data));
    getCampaign(userId).then((data) => setCampaign(data));
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
        user,
        campaign,
        setCampaign,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}
