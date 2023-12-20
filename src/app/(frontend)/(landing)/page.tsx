"use client";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import FeatureSection from "./components/FeatureSection";
import PricingSection from "./components/PricingSection";
import { redirect } from "next/navigation";

export default function Example() {
  redirect("/painel");
}
