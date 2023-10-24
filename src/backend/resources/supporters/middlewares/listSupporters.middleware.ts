"use server";
import prisma from "@/tests/client";
import { ListSupportersDto } from "@/(shared)/dto/schemas/supporters/supporters";
import { cookies, headers } from "next/headers";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import { Supporter } from "@prisma/client";
import { MiddlewarePayload } from "@/next_decorators/decorators/UseMiddlewares";

export async function ListSupportersMiddleware({
  data: { data },
  bind,
}: MiddlewarePayload<ListSupportersDto>) {
  if (data && bind.supporterSession.level != 4) {
    data.ownerId = "";
    data.campaignOwnerId = "";
  }
}
