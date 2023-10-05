"use client";

import React, { useEffect, useState } from "react";
import { PanelContext } from "../contexts/panel.ctx";
import { getLatestSupporters } from "../../resources/painel/server/mainStats";
import { findUser } from "../../resources/api/services/user";
import { getCampaign } from "../../resources/api/services/campaign";
import { cookies } from "next/headers";

export default function PanelProvider({
  children,
  userId,
  fetchedCampaign,
}: {
  children: React.ReactNode;
  userId: string;
  fetchedCampaign: any;
}) {
  const [updatingLatestSupporters, setUpdatingLatestSupporters] =
    useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    title: "",
    message: "",
  });
  const [siteURL, setSiteURL] = useState("");
  const [user, setUser] = useState<any>("");
  const [campaign, setCampaign] = useState<any>(fetchedCampaign);

  const fetchLatestSupporters = async (userId: string, campaignId: string) => {
    return await getLatestSupporters(userId, campaignId);
  };

  useEffect(() => {
    setSiteURL(document.location.origin);
    findUser({ id: userId }).then((data) => setUser(data));
    if (!campaign) getCampaign(userId).then((data) => setCampaign(data));
  }, [campaign, userId]);

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
