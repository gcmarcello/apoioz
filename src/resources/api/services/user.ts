"use server";
import { normalize } from "path";
import { UserType } from "../../../common/types/userTypes";
import { hashInfo } from "../../../common/utils/bCrypt";
import prisma from "../../../common/utils/prisma";
import { handlePrismaError } from "../../../common/utils/prismaError";

export async function findUser(data: any) {
  const user = await prisma.user.findFirst({ where: { id: data.id || "0" }, include: { info: true } });
  if (user) return user;
}

export async function listUsers(campaignId: string, level: number) {
  if (!campaignId || !level) return;
  const userList = await prisma.supporter.findMany({
    where: { campaignId: campaignId, level: { lte: level } },
    include: { user: { select: { name: true, email: true, info: true } } },
  });
  return userList;
}

export async function createUser(data: UserType) {
  try {
    const { name, email, password, campaign, ...info } = data;
    let userData = {
      name: data.name,
      email: normalize(data.email),
      password: data.password ? await hashInfo(data.password) : null,
      role: "user",
      info: {
        create: info,
      },
      supporter: {},
    };

    if (data.campaign?.campaignId) {
      userData.supporter = {
        create: { campaignId: data.campaign.campaignId, referralId: data.campaign.referralId, level: 1 },
      };
    }

    const user = await prisma.user.create({
      data: userData,
      include: {
        info: true,
        supporter: true,
      },
    });
    return {
      name: user.name,
      email: user.email,
      info: { phone: info.phone, state: info.stateId, city: info.cityId, zone: info.zoneId, section: info.sectionId },
    };
  } catch (error) {
    console.log(error);
    return handlePrismaError("usuário", error);
  }
}

export async function updateUser(data: UserType, id: string) {
  try {
    const { name, email, password, ...info } = data;
    const user = await prisma.user.update({
      where: { id: id },
      data: { info: { update: info } },
      include: { info: true },
    });
    return user;
  } catch (error) {
    return handlePrismaError("usuário", error);
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.$transaction([
      prisma.userInfo.delete({ where: { userId: id } }),
      prisma.user.delete({ where: { id: id } }),
    ]);
  } catch (error) {
    return handlePrismaError("usuário", error);
  }
}
