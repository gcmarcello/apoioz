import type { Campaign, Supporter, User, UserInfo } from "@prisma/client";

import { normalizeEmail, normalizePhone } from "@/_shared/utils/format";
import dayjs from "dayjs";
import { UserWithoutPassword } from "prisma/types/User";
import { CreateSupportersDto, ListSupportersDto } from "./dto";
import prisma from "prisma/prisma";
import { findCampaignById } from "../campaigns/service";
import { verifyExistingUser } from "../../user/service";
import { hashInfo } from "@/_shared/utils/bCrypt";
import { sendEmail } from "../../emails/service";

export async function createSupporter(
  request: CreateSupportersDto & {
    userSession: UserWithoutPassword;
    supporterSession: Supporter;
  }
) {
  const existingUser = await verifyExistingUser(request.phone);

  const campaign = await findCampaignById(request.supporterSession.campaignId);

  if (request.supporterSession.level < 4 && request.referralId)
    throw "Você não pode cadastrar um apoiador para um apoiador.";

  const referral = request.referralId
    ? await prisma.supporter.findFirst({
        where: { id: request.referralId },
      })
    : request.supporterSession;

  if (!campaign) throw "Campanha não encontrada";

  if (existingUser) {
    const conflictingSupporter = await verifyConflictingSupporter(
      campaign,
      existingUser.id
    );

    if (conflictingSupporter?.type === "sameCampaign")
      throw "Usuário já cadastrado nesta campanha.";
    if (conflictingSupporter?.type === "otherCampaign") {
      throw "Usuário já cadastrado em outra campanha do mesmo tipo.";
    }
  }

  let referralTree = [referral];
  if (referralTree[0].level != 4) {
    while (true) {
      const referral = await prisma.supporter.findFirst({
        where: {
          OR: [
            {
              referralId: referralTree[referralTree.length - 1]?.id,
            },
            {
              level: 4,
            },
          ],
        },
      });

      if (!referral) continue;

      referralTree.push(referral);

      if (referral.level === 4) break;
    }
  }

  const ownedSupporterGroupsFromReferralTree =
    await prisma.supporterGroupMembership.findMany({
      where: {
        supporterId: {
          in: referralTree.map((referral) => referral.id),
        },
        isOwner: true,
      },
    });

  const createSupporterGroupMembershipQuery = ownedSupporterGroupsFromReferralTree.map(
    (supporterGroup) => ({
      isOwner: false,
      supporterGroup: {
        connect: {
          id: supporterGroup.supporterGroupId,
        },
      },
    })
  );

  const user = existingUser
    ? existingUser
    : await prisma.user.create({
        include: {
          info: true,
        },
        data: {
          email: normalizeEmail(request.email),
          password: request.password ? await hashInfo(request.password) : null,
          name: request.name,
          role: "user",
          phone: normalizePhone(request.phone),
          info: {
            create: {
              ...request.info,
              birthDate: dayjs(request.info.birthDate, "DD/MM/YYYY").toISOString(),
            },
          },
        },
      });

  const supporter = await prisma.supporter
    .create({
      include: { user: true },
      data: {
        level: 1,
        Section: { connect: { id: user.info.sectionId } },
        Zone: { connect: { id: user.info.zoneId } },
        campaign: { connect: { id: referral.campaignId } },
        referral: { connect: { id: referral.id } },
        user: { connect: { id: user.id } },
        supporterGroupsMemberships: {
          create: [
            {
              isOwner: true,
              supporterGroup: {
                create: {},
              },
            },
            ...createSupporterGroupMembershipQuery,
          ],
        },
      },
    })
    .catch((err) => console.log(err));

  /**
   * await sendEmail({
    to: user.email,
    templateId: "welcome_email",
    dynamicData: {
      name: user.name,
      siteLink: `${process.env.NEXT_PUBLIC_SITE_URL}/painel`,
      campaignName: campaign.name,
      subject: `Bem Vindo à Campanha ${campaign.name}! - ApoioZ`,
    },
  });
   */

  return supporter;
}

export async function listSupportersAsTree({
  supporterSession,
}: CreateSupportersDto & {
  userSession: UserWithoutPassword;
  supporterSession: Supporter;
}) {
  function generateReferredObject(level: any): any {
    if (level <= 1) {
      return {
        referral: { include: { user: { include: { info: true } } } },
        user: { include: { info: { include: { Section: true, Zone: true } } } },
      };
    } else {
      return {
        referred: {
          include: {
            referral: { include: { user: { include: { info: true } } } },
            user: {
              include: { info: { include: { Section: true, Zone: true } } },
            },
            ...generateReferredObject(level - 0.2),
          },
        },
      };
    }
  }

  const includeReferred = generateReferredObject(supporterSession.level - 1);

  const supporters = await prisma.supporter.findMany({
    where: {
      campaignId: supporterSession.campaignId,
      id: supporterSession.id,
    },
    include: {
      referral: { include: { user: { include: { info: true } } } },
      user: { include: { info: { include: { Section: true, Zone: true } } } },
      ...includeReferred,
    },
  });

  return supporters;
}

export async function signUpAsSupporter(request: CreateSupportersDto) {
  try {
    const existingUser = await verifyExistingUser(request.phone);

    const campaign = await findCampaignById(request.campaignId);
    const referral = await prisma.supporter.findFirst({
      where: { id: request.referralId },
    });

    if (!campaign) throw "Campanha não encontrada";

    if (existingUser) {
      const conflictingSupporter = await verifyConflictingSupporter(
        campaign,
        existingUser.id
      );

      if (conflictingSupporter?.type === "sameCampaign")
        throw "Usuário já cadastrado nesta campanha.";
      if (conflictingSupporter?.type === "otherCampaign") {
        throw "Usuário já cadastrado em outra campanha do mesmo tipo.";
      }
    }

    let referralTree = [referral];
    if (referralTree[0].level != 4) {
      while (true) {
        const referral = await prisma.supporter.findFirst({
          where: {
            OR: [
              {
                referralId: referralTree[referralTree.length - 1]?.id,
              },
              {
                level: 4,
              },
            ],
          },
        });

        if (!referral) continue;

        referralTree.push(referral);

        if (referral.level === 4) break;
      }
    }

    const ownedSupporterGroupsFromReferralTree =
      await prisma.supporterGroupMembership.findMany({
        where: {
          supporterId: {
            in: referralTree.map((referral) => referral.id),
          },
          isOwner: true,
        },
      });

    const createSupporterGroupMembershipQuery = ownedSupporterGroupsFromReferralTree.map(
      (supporterGroup) => ({
        isOwner: false,
        supporterGroup: {
          connect: {
            id: supporterGroup.supporterGroupId,
          },
        },
      })
    );

    const user = existingUser
      ? existingUser
      : await prisma.user.create({
          include: {
            info: true,
          },
          data: {
            email: normalizeEmail(request.email),
            password: await hashInfo(request.password),
            name: request.name,
            role: "user",
            phone: normalizePhone(request.phone),
            info: {
              create: {
                ...request.info,
                birthDate: dayjs(request.info.birthDate, "DD/MM/YYYY").toISOString(),
              },
            },
          },
        });

    const supporter = await prisma.supporter
      .create({
        include: { user: true },
        data: {
          level: 1,
          Section: { connect: { id: user.info.sectionId } },
          Zone: { connect: { id: user.info.zoneId } },
          campaign: { connect: { id: referral.campaignId } },
          referral: { connect: { id: referral.id } },
          user: { connect: { id: user.id } },
          supporterGroupsMemberships: {
            create: [
              {
                isOwner: true,
                supporterGroup: {
                  create: {},
                },
              },
              ...createSupporterGroupMembershipQuery,
            ],
          },
        },
      })
      .catch((err) => console.log(err));

    await sendEmail({
      to: user.email,
      templateId: "welcome_email",
      dynamicData: {
        name: user.name,
        siteLink: `${process.env.NEXT_PUBLIC_SITE_URL}/painel`,
        campaignName: campaign.name,
        subject: `Bem Vindo à Campanha ${campaign.name}! - ApoioZ`,
      },
    });

    const referralInfo = await prisma.supporter.findFirst({
      where: { id: referral.id },
      include: { user: { include: { info: true } } },
    });

    await sendEmail({
      to: referralInfo.user.email,
      templateId: "invite_notification",
      dynamicData: {
        name: referralInfo.user.name,
        siteLink: `${process.env.NEXT_PUBLIC_SITE_URL}/painel`,
        campaignName: campaign.name,
        supporterName: user.name,
        subject: `Novo apoiador convidado na campanha ${campaign.name}! - ApoioZ`,
      },
    });

    return supporter;
  } catch (error) {
    console.log(error);
  }
}

export async function listSupportersFromGroup({
  pagination,
  query,
  supporterSession,
}: ListSupportersDto & {
  supporterSession: Supporter;
}) {
  const supporterGroup = await prisma.supporterGroupMembership.findFirst({
    where: { supporterId: supporterSession?.id, isOwner: true },
  });

  if (!supporterGroup) throw "Você não tem permissão para acessar este grupo de apoio.";

  const supporterList = await prisma.supporter.findMany({
    take: pagination?.pageSize,
    where: {
      campaignId: supporterSession.campaignId,
      supporterGroupsMemberships: {
        some: {
          supporterGroupId: supporterGroup?.supporterGroupId,
        },
      },
      user: {
        name: { contains: query?.user.name },
        email: { contains: query?.user.email },
        phone: { contains: query?.user.phone },
      },
    },
    include: query?.eager
      ? {
          user: {
            select: {
              info: { include: { Section: true, Zone: true } },
              name: true,
              email: true,
              phone: true,
            },
          },
          referral: {
            include: {
              user: {
                select: {
                  info: { include: { Section: true, Zone: true } },
                  name: true,
                  email: true,
                  phone: true,
                },
              },
              referral: {
                include: {
                  user: {
                    select: {
                      info: { include: { Section: true, Zone: true } },
                      name: true,
                      email: true,
                      phone: true,
                    },
                  },
                },
              },
            },
          },
        }
      : {
          user: {
            select: {
              info: { include: { Section: true, Zone: true } },
              name: true,
              email: true,
              phone: true,
            },
          },
        },
  });

  return {
    data: supporterList,
    pagination: {
      pageIndex: pagination?.pageIndex,
      pageSize: pagination?.pageSize,
      count: supporterList.length + 1,
    },
  };
}

export async function getSupporterByUser({
  userId,
  campaignId,
}: {
  userId: string;
  campaignId: string;
}) {
  const supporter = await prisma.supporter.findFirst({
    where: { userId, campaignId },
  });
  if (supporter) return supporter;
}

export async function verifyConflictingSupporter(campaign: Campaign, userId: string) {
  const conflictingCampaigns: string[] = (
    await prisma.campaign.findMany({
      where: {
        cityId: campaign.cityId,
        type: campaign.type,
        year: campaign.year,
      },
    })
  ).map((campaign) => campaign.id);

  const conflictingSupporter = await prisma.supporter.findFirst({
    where: {
      userId: userId,
      campaignId: { in: conflictingCampaigns },
    },
  });

  if (conflictingSupporter?.campaignId === campaign.id)
    return { type: "sameCampaign", supporter: conflictingSupporter };
  if (conflictingSupporter)
    return { type: "otherCampaign", supporter: conflictingSupporter };
  return null;
}

export async function findCampaignLeader(campaignId: string) {
  return await prisma.supporter.findFirst({
    where: { level: 4 },
  });
}
