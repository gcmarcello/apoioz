"use client";

import React, { useEffect, useState } from "react";
import { PanelContext } from "../contexts/panel.ctx";
import { cookies } from "next/headers";
import { Campaign, Supporter } from "@prisma/client";
import { getSupporterByUser } from "@/backend/resources/supporters/supporters.actions";
import { findUser } from "@/backend/resources/users/users.actions";

export default function PanelProvider({
  children,
  userId,
  activeCampaign,
}: {
  children: React.ReactNode;
  userId: string;
  activeCampaign: Campaign;
}) {
  const [showToast, setShowToast] = useState({
    show: false,
    title: "",
    message: "",
  });
  const [siteURL, setSiteURL] = useState("");
  const [supporter, setSupporter] = useState<Supporter | undefined>(undefined);
  const [user, setUser] = useState<any>(null);
  const [campaign, setCampaign] = useState<any>(activeCampaign);

  useEffect(() => {
    setSiteURL(document.location.origin);
    findUser(userId)
      .then((data) => setUser(data))
      .catch((err) => console.log(err));
  }, [campaign, userId]);

  useEffect(() => {
    if (user && campaign) {
      getSupporterByUser({
        userId: user.id,
        campaignId: campaign.id,
      })
        .then((data) => {
          setSupporter(data);
        })
        .catch((err) => console.log(err));
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
