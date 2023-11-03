"use server";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { hashInfo } from "@/(shared)/utils/bCrypt";
import { normalizePhone, normalizeEmail } from "@/(shared)/utils/format";
import { JwtPayload } from "jsonwebtoken";
import prisma from "prisma/prisma";
import { handlePrismaError } from "prisma/prismaError";
dayjs.extend(customParseFormat);

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
    console.log(data);

    const existingUser = await prisma.user.findFirst({
      where: { email: normalizeEmail(email) },
    });
    if (existingUser)
      throw {
        message: `Usuário com este email já existe.`,
        status: 409,
      };
    const user = await prisma.user.create({
      data: {
        email: normalizeEmail(data.email),
        password: data.password && (await hashInfo(data.password)),
        role: "user",
        name: data.name,
        info: {
          create: {
            ...info,
            phone: normalizePhone(info.phone),
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
      phone: user.phone,
      info: {
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
  return await prisma.user.findFirst({
    where: { phone: normalizePhone(phone) },
    include: {
      info: true,
    },
  });
}

export async function getUserFromSupporter(supporterId: string) {
  return await prisma.user.findFirst({
    where: { supporter: { some: { id: supporterId } } },
  });
}
