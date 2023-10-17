"use client";

import React, { useEffect, useState } from "react";
import { PanelContext } from "../contexts/panel.ctx";
import { cookies } from "next/headers";
import { Supporter } from "@prisma/client";
import {
  getCampaign,
  listSupporters,
} from "@/backend/resources/campaign/campaign.service";
import { getSupporterByUser } from "@/backend/resources/supporters/supporters.service";
import { findUser } from "@/backend/resources/users/users.service";

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
  const [supporter, setSupporter] = useState<Supporter | undefined>(undefined);
  const [user, setUser] = useState<any>(null);
  const [campaign, setCampaign] = useState<any>(fetchedCampaign);

  const fetchLatestSupporters = async (userId: string, campaignId: string) => {
    return await listSupporters({
      pagination: { pageIndex: 0, pageSize: 5 },
    });
  };

  useEffect(() => {
    setSiteURL(document.location.origin);
    findUser({ id: userId }).then((data) => setUser(data));
    if (!campaign) getCampaign(userId).then((data) => setCampaign(data));
  }, [campaign, userId]);

  useEffect(() => {
    if (user && campaign) {
      getSupporterByUser(user.id, campaign.id).then((data) => {
        setSupporter(data);
      });
    }
  }, [user, campaign]);
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
        supporter,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}
