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
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [showToast, setShowToast] = useState({
    show: false,
    title: "",
    message: "",
  });
  const [siteURL, setSiteURL] = useState("");
  const [supporter, setSupporter] = useState<Supporter | undefined>(undefined);
  const [user, setUser] = useState<any>(null);

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
