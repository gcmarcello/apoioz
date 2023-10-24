"use client";

import React, { useEffect, useState } from "react";
import { PanelContext } from "../contexts/panel.ctx";
import { cookies } from "next/headers";
import { Campaign, Supporter } from "@prisma/client";
import {
  getSupporterByUser,
  listSupporters,
} from "@/backend/resources/supporters/supporters.actions";
import { findUser } from "@/backend/resources/users/users.actions";
import { getCampaign } from "@/backend/resources/campaign/campaign.actions";

export default function PanelProvider({
  children,
  userId,
  activeCampaign,
}: {
  children: React.ReactNode;
  userId: string;
  activeCampaign: Campaign;
}) {
  const [updatingLatestSupporters, setUpdatingLatestSupporters] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    title: "",
    message: "",
  });
  const [siteURL, setSiteURL] = useState("");
  const [supporter, setSupporter] = useState<Supporter | undefined>(undefined);
  const [user, setUser] = useState<any>(null);
  const [campaign, setCampaign] = useState<any>(activeCampaign);

  const fetchLatestSupporters = async (userId: string, campaignId: string) => {
    return await listSupporters({
      pagination: { pageIndex: 0, pageSize: 5 },
    });
  };

  useEffect(() => {
    setSiteURL(document.location.origin);
    findUser(userId).then((data) => setUser(data));
  }, [campaign, userId]);

  useEffect(() => {
    if (user && campaign) {
      getSupporterByUser({
        userId: user.id,
        campaignId: campaign.id,
      }).then((data) => {
        setSupporter(data);
      });
    }
  }, [user, campaign]);
  return (
    <PanelContext.Provider
      value={{
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
