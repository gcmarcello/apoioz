"use strict";

const rule = require("./rule");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, sourceType: "module" },
});

ruleTester.run("noservices", rule, {
  valid: [
    {
      code: 'import myService from "../test/service"',
    },
  ],

  invalid: [
    {
      code: `
        "use client";
        import Image from "next/image";
        import clsx from "clsx";
        import { AtSymbolIcon } from "@heroicons/react/24/outline";
        import Link from "next/link";
        import { toProperCase } from "@/(shared)/utils/format";
        import { fetchCampaignTeamMembers } from "@/app/api/panel/campaigns/actions";
        import WhatsAppIcon from "../../_shared/components/icons/WhatsAppIcon";
        import { NoSsrTreeComponent } from "./components/TreeComponent/NoSsrTreeComponent";
        import { listTreeSuporters } from "@/app/api/panel/supporters/service";
      `,
      errors: [
        {
          message: 'Import service not allowed in files starting with "useClient".',
        },
      ],
    },
  ],
});
