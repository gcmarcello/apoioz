import type { Campaign, Supporter, User, UserInfo } from "@prisma/client";
import { normalizeEmail, normalizePhone } from "@/_shared/utils/format";
import dayjs from "dayjs";
import { UserWithoutPassword } from "prisma/types/User";

import {
  CreateSupportersDto,
  ReadSupportersAsTreeDto,
  ReadSupportersDto,
  JoinAsSupporterDto,
} from "./dto";

import prisma from "prisma/prisma";
import { findCampaignById } from "../campaigns/service";
import { verifyExistingUser } from "../../user/service";
import { hashInfo } from "@/_shared/utils/bCrypt";
import { sendEmail } from "../../emails/service";
import { answerPoll, readActivePoll } from "../polls/service";
import { getEnv, isProd } from "@/_shared/utils/settings";

export async function createSupporter(
  request: CreateSupportersDto & {
    userSession: UserWithoutPassword;
    supporterSession: Supporter;
  }
) {
  const existingUser = await verifyExistingUser(request.phone, request.email);

  const campaign = await findCampaignById(request.supporterSession.campaignId);

  if (request.supporterSession.level < 4 && request.referralId)
    throw "Você não pode cadastrar um apoiador para um apoiador.";

  if (request.supporterSession.level < 4 && request.externalSupporter)
    throw "Você não pode cadastrar um apoiador externo.";

  if ((!request.info?.sectionId || !request.info?.zoneId) && !request.externalSupporter)
    throw "Apoiadores precisam ter uma seção e zona.";

  const referral = request.referralId
    ? await prisma.supporter.findFirst({
        where: { id: request.referralId },
      })
    : request.supporterSession;

  if (!referral) throw "Apoiador não encontrado";

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

  const referralsSupporterGroups = await prisma.supporterGroup.findMany({
    where: {
      memberships: {
        some: {
          supporterId: referral.id,
        },
      },
    },
  });

  const createSupporterGroupMembershipQuery = referralsSupporterGroups.map(
    (supporterGroup) => ({
      isOwner: false,
      supporterGroup: {
        connect: {
          id: supporterGroup.id,
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
        Section: user.info.sectionId
          ? { connect: { id: user.info.sectionId } }
          : undefined,
        Zone: user.info.zoneId ? { connect: { id: user.info.zoneId } } : undefined,
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

  if (isProd) {
    await sendEmail({
      to: user.email,
      templateId: "welcome_email",
      dynamicData: {
        name: user.name,
        siteLink: `${getEnv("NEXT_PUBLIC_SITE_URL")}/painel`,
        campaignName: campaign.name,
        subject: `Bem Vindo à Campanha ${campaign.name}! - ApoioZ`,
      },
    });
  }

  return supporter;
}

export async function readSupportersAsTree({
  supporterSession,
  where: { nestLevel = 2, supporterId = null } = {},
}: ReadSupportersAsTreeDto & {
  userSession: UserWithoutPassword;
  supporterSession: Supporter;
}) {
  function generateReferredObject(nestLevel: any): any {
    if (nestLevel < 1) {
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
            ...generateReferredObject(nestLevel - 1),
          },
        },
      };
    }
  }

  const supporter = supporterId
    ? await prisma.supporterGroupMembership
        .findFirst({
          where: { supporterId: supporterId },
          include: {
            supporter: true,
          },
        })
        .then((m) => m.supporter)
    : supporterSession;

  if (!supporter) throw "Você não tem permissão para acessar este apoiador";

  const includeReferred = generateReferredObject(nestLevel - 1);

  const supporters = await prisma.supporter.findMany({
    where: {
      campaignId: supporter.campaignId,
      id: supporter.id,
    },
    include: {
      referral: { include: { user: { include: { info: true } } } },
      user: { include: { info: { include: { Section: true, Zone: true } } } },
      ...includeReferred,
    },
  });

  if (!supporters) throw "Apoiador não encontrado";

  return supporters;
}

export async function readSupporterTrail({
  supporterSession,
  where: { supporterId },
}: ReadSupportersAsTreeDto & {
  userSession: UserWithoutPassword;
  supporterSession: Supporter;
}) {
  const referralSupporterGroups = await prisma.supporterGroup.findMany({
    where: {
      memberships: {
        some: {
          supporterId: supporterId,
        },
      },
    },
  });

  const referrals = await prisma.supporterGroupMembership
    .findMany({
      where: {
        supporterGroupId: {
          in: referralSupporterGroups.map((group) => group.id),
        },
        isOwner: true,
      },
      include: {
        supporter: {
          include: {
            user: true,
          },
        },
      },
    })
    .then((res) => res.map((m) => m.supporter));

  function generateReferralTrail(referrals) {
    if (referrals.length <= 1) {
      return [referrals[0] || {}];
    }
    const currentReferral = referrals[0];
    currentReferral.referred = generateReferralTrail(referrals.slice(1));
    return [currentReferral];
  }

  const referralTree = generateReferralTrail(referrals);

  return referralTree;
}

export async function signUpAsSupporter(request: CreateSupportersDto) {
  const existingUser = await verifyExistingUser(request.phone, request.email);

  const campaign = await findCampaignById(request.campaignId);
  const referral = await prisma.supporter.findFirst({
    where: { id: request.referralId },
  });

  if (!referral) throw "Referral não encontrado";

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

  const referralsSupporterGroups = await prisma.supporterGroup.findMany({
    where: {
      memberships: {
        some: {
          supporterId: referral.id,
        },
      },
    },
  });

  const createSupporterGroupMembershipQuery = referralsSupporterGroups.map(
    (supporterGroup) => ({
      isOwner: false,
      supporterGroup: {
        connect: {
          id: supporterGroup.id,
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

  if (!user || !user.info?.sectionId || !user.info?.zoneId) throw "Erro ao criar usuário";

  const supporter = await prisma.supporter.create({
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
  });

  if (supporter && request.poll.questions) {
    for (const question of request.poll.questions) {
      question.supporterId = supporter.id;
    }
    await answerPoll({ ...request.poll, bypassIpCheck: true });
  }

  await sendEmail({
    to: user.email,
    templateId: "welcome_email",
    dynamicData: {
      name: user.name,
      siteLink: `${getEnv("NEXT_PUBLIC_SITE_URL")}/painel`,
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
      siteLink: `${getEnv("NEXT_PUBLIC_SITE_URL")}/painel`,
      campaignName: campaign.name,
      supporterName: user.name,
      subject: `Novo apoiador convidado na campanha ${campaign.name}! - ApoioZ`,
    },
  });

  return supporter;
}

export async function joinAsSupporter({
  userSession,
  ...request
}: JoinAsSupporterDto & { userSession: UserWithoutPassword }) {
  const user = await prisma.user.findFirst({
    where: { id: userSession.id },
    include: { info: true },
  });

  const campaign = await findCampaignById(request.campaignId);
  const referral = await prisma.supporter.findFirst({
    where: { id: request.referralId },
  });

  if (!referral) throw "Referral não encontrado";

  if (!campaign) throw "Campanha não encontrada";

  const conflictingSupporter = await verifyConflictingSupporter(campaign, user.id);

  if (conflictingSupporter?.type === "sameCampaign")
    throw "Usuário já cadastrado nesta campanha.";
  if (conflictingSupporter?.type === "otherCampaign") {
    throw "Usuário já cadastrado em outra campanha do mesmo tipo.";
  }

  const referralsSupporterGroups = await prisma.supporterGroup.findMany({
    where: {
      memberships: {
        some: {
          supporterId: referral.id,
        },
      },
    },
  });

  const createSupporterGroupMembershipQuery = referralsSupporterGroups.map(
    (supporterGroup) => ({
      isOwner: false,
      supporterGroup: {
        connect: {
          id: supporterGroup.id,
        },
      },
    })
  );

  const supporter = await prisma.supporter.create({
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
  });

  await sendEmail({
    to: user.email,
    templateId: "welcome_email",
    dynamicData: {
      name: user.name,
      siteLink: `${getEnv("NEXT_PUBLIC_SITE_URL")}/painel`,
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
      siteLink: `${getEnv("NEXT_PUBLIC_SITE_URL")}/painel`,
      campaignName: campaign.name,
      supporterName: user.name,
      subject: `Novo apoiador convidado na campanha ${campaign.name}! - ApoioZ`,
    },
  });

  return supporter;
}

export async function readSupportersFromGroup({
  pagination,
  where,
  supporterSession,
}: ReadSupportersDto & {
  supporterSession: Supporter;
}) {
  const supporterGroupMembership = await prisma.supporterGroupMembership.findFirst({
    where: { supporterId: supporterSession.id, isOwner: true },
  });

  if (!supporterGroupMembership)
    throw "Você não tem permissão para acessar este grupo de apoio.";

  const supporterList = await prisma.supporter.findMany({
    take: pagination?.pageSize,
    where: {
      campaignId: supporterSession.campaignId,
      supporterGroupsMemberships: {
        some: {
          supporterGroupId: supporterGroupMembership?.supporterGroupId,
        },
      },
      user: {
        name: { contains: where?.user.name },
        email: { contains: where?.user.email },
        phone: { contains: where?.user.phone },
      },
    },
    include: {
      user: {
        include: {
          info: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const supporterListWithoutFormerSupporters = supporterList.filter(
    (supporter) => supporter.userId !== getEnv("ANONYMOUS_USER_ID")
  );

  return {
    data: supporterListWithoutFormerSupporters,
    pagination: {
      pageIndex: pagination?.pageIndex,
      pageSize: pagination?.pageSize,
      count: supporterListWithoutFormerSupporters.length + 1,
    },
  };
}

export async function readSupportersFromGroupWithRelations({
  pagination,
  where,
  supporterSession,
}: ReadSupportersDto & {
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
        name: { contains: where?.user.name },
        email: { contains: where?.user.email },
        phone: { contains: where?.user.phone },
      },
    },
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
    },
    orderBy: { createdAt: "desc" },
  });

  const supporterListWithoutFormerSupporters = supporterList.filter(
    (supporter) => supporter.userId !== getEnv("ANONYMOUS_USER_ID")
  );

  return {
    data: supporterListWithoutFormerSupporters,
    pagination: {
      pageIndex: pagination?.pageIndex,
      pageSize: pagination?.pageSize,
      count: supporterListWithoutFormerSupporters.length + 1,
    },
  };
}

export async function readSupporterFromUser({
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

export async function deleteSupporterAsSupporter({
  supporterSession,
}: {
  supporterSession: Supporter;
}) {
  const supporter = await prisma.supporter.findFirst({
    where: { id: supporterSession.id },
  });

  if (!supporter) throw "Apoiador não encontrado";
  if (supporter.level === 4) throw "Você não pode sair da campanha sendo o líder.";

  const deletedSupporter = await prisma.supporter.update({
    where: { id: supporter.id },
    data: { userId: getEnv("ANONYMOUS_USER_ID") },
  });

  return deletedSupporter;
}

export async function verifyConflictingSupporter(campaign: Campaign, userId: string) {
  const conflictingCampaigns: string[] = (
    await prisma.campaign.findMany({
      where: {
        AND: [
          { cityId: campaign.cityId },
          { type: campaign.type },
          { year: campaign.year },
        ],
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
    return {
      type: "sameCampaign",
      supporter: conflictingSupporter,
      message: "Você já faz parte desta rede.",
    };
  if (conflictingSupporter)
    return {
      type: "otherCampaign",
      supporter: conflictingSupporter,
      message: "Você já faz parte da rede de outro candidato.",
    };
  return null;
}

export async function readCampaignLeader(campaignId: string) {
  return await prisma.supporter.findFirst({
    where: { level: 4 },
  });
}
