"use server";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { hashInfo } from "@/_shared/utils/bCrypt";
import { normalizePhone, normalizeEmail } from "@/_shared/utils/format";
import prisma from "prisma/prisma";
import { handlePrismaError } from "prisma/prismaError";
dayjs.extend(customParseFormat);

export async function createUser(data: any) {
  try {
    const { name, email, password, ...info } = data;

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

export async function readUsers() {
  try {
    const users = await prisma.user.findMany({ include: { info: true } });
    return users;
  } catch (error) {
    return handlePrismaError("usuário", error);
  }
}

export async function readUser(userId: string) {
  try {
    const users = await prisma.user.findUnique({
      where: { id: userId },
      include: { info: true },
    });
    return users;
  } catch (error) {
    return handlePrismaError("usuário", error);
  }
}

export async function updateUser(request) {
  const { userSession, supporterSession, birthDate, ...data } = request;
  try {
    const verifyExistingEmail = await prisma.user.findFirst({
      where: { email: normalizeEmail(data.email) },
    });
    if (verifyExistingEmail && verifyExistingEmail.id !== userSession.id)
      throw `Usuário com este email já existe.`;
    const updatedUser = await prisma.user.update({
      where: { id: userSession.id },
      data: {
        ...data,
        info: { update: { birthDate: dayjs(birthDate, "DD/MM/YYYY").toISOString() } },
      },
    });
  } catch (error) {
    console.log(error);
    throw handlePrismaError("email", error);
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

export async function readUserFromSupporter(supporterId: string) {
  return await prisma.user.findFirst({
    where: { supporter: { some: { id: supporterId } } },
  });
}

export async function findSupporter(userId: string, campaignId: string) {
  const supporter = await prisma.user.findFirst({
    where: { id: userId },
    include: { supporter: { where: { campaignId: campaignId } } },
  });
  if (supporter) return supporter;
}
