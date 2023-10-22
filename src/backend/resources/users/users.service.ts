import { normalize } from "path";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import prisma from "@/backend/prisma/prisma";
import { handlePrismaError } from "@/backend/prisma/prismaError";
import { hashInfo } from "@/(shared)/utils/bCrypt";
import { normalizePhone } from "@/(shared)/utils/format";
dayjs.extend(customParseFormat);

export async function findUser(data: any) {
  const user = await prisma.user.findFirst({
    where: { id: data.id || "0" },
    include: { info: true },
  });
  if (user) return user;
}

export async function findSupporter(userId: string, campaignId: string) {
  const supporter = await prisma.user.findFirst({
    where: { id: userId },
    include: { supporter: { where: { campaignId: campaignId } } },
  });
  if (supporter) return supporter;
}

export async function createUser(data: any) {
  try {
    const { name, email, password, ...info } = data;
    const user = await prisma.user.create({
      data: {
        email: normalize(data.email),
        password: data.password && (await hashInfo(data.password)),
        role: "user",
        name: data.name,
        info: {
          create: {
            ...info,
            birthDate: dayjs(info.birthDate, "DD/MM/YYYY").toISOString(),
          },
        },
      },
      include: {
        info: true,
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      info: {
        phone: info.phone,
        state: info.stateId,
        city: info.cityId,
        zone: info.zoneId,
        section: info.sectionId,
        birthDate: info.birthDate,
      },
    };
  } catch (error) {
    console.log(error);
    return handlePrismaError("usuário", error);
  }
}

export async function listUsers() {
  try {
    const users = await prisma.user.findMany({ include: { info: true } });
    return users;
  } catch (error) {
    return handlePrismaError("usuário", error);
  }
}

export async function verifyExistingUser(phone: string) {
  return await prisma.userInfo.findFirst({
    where: { phone: normalizePhone(phone) },
    include: { user: true },
  });
}
