import { Campaign, Supporter } from "@prisma/client";
import { UserWithoutPassword } from "prisma/types/User";
import { hashInfo } from "@/_shared/utils/bCrypt";
import { normalizeEmail, normalizePhone } from "@/_shared/utils/format";
import { getEnv } from "@/_shared/utils/settings";
import dayjs from "dayjs";
import { sendEmail } from "../../emails/service";
import { verifyExistingUser } from "../../user/service";
import { findCampaignById } from "../campaigns/service";
import { CreateSupportersDto, ReadSupporterBranchesDto, ReadSupportersDto } from "./dto";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";

export async function readSupporterBranches({
  supporterSession,
  where: { branches = 0, supporterId = null } = {},
}: ReadSupporterBranchesDto & {
  userSession: UserWithoutPassword;
  supporterSession: Supporter;
}) {
  function generateReferredObject(branches: any): any {
    if (branches === 0) {
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
            ...generateReferredObject(branches - 1),
          },
        },
      };
    }
  }

  const supporterTree = await prisma.supporterGroupMembership
    .findFirst({
      where: {
        supporterId: supporterId || supporterSession.id,
        supporterGroup: {
          memberships: {
            some: {
              supporterId: supporterSession.id,
              isOwner: true,
            },
          },
        },
      },
      include: {
        supporter: {
          include: {
            referred: {
              include: {
                referral: { include: { user: { include: { info: true } } } },
                user: {
                  include: {
                    info: { include: { Section: true, Zone: true } },
                  },
                },
                ...generateReferredObject(branches - 1),
              },
            },
            user: {
              include: {
                info: { include: { Section: true, Zone: true } },
              },
            },
            referral: { include: { user: { include: { info: true } } } },
          },
        },
      },
    })
    .then((m) => m.supporter);

  if (!supporterTree) throw "Você não tem permissão para acessar este apoiador";

  return supporterTree;
}

export async function readSupporterTrail({
  where: { supporterId },
}: ReadSupporterBranchesDto & {
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

  const notFlattenedReferrals = await prisma.supporterGroupMembership
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
            referred: {
              include: {
                user: true,
              },
            },
            user: true,
          },
        },
      },
    })
    .then((res) => res.map((m) => m.supporter));

  const referrals = notFlattenedReferrals.reduce((acc, curr) => {
    return [...acc, curr, ...curr.referred];
  }, []);

  return referrals;
}

export async function readSupportersFromSupporterGroup({
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

  return {
    data: supporterList,
    pagination: {
      pageIndex: pagination?.pageIndex,
      pageSize: pagination?.pageSize,
      count: supporterList.length + 1,
    },
  };
}

export async function readSupportersFromSupporterGroupWithRelation({
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
    take: pagination?.take || undefined,
    skip: pagination?.skip || undefined,
    cursor: pagination?.cursor || undefined,
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

  return {
    data: supporterList,
    pagination: {
      cursor: pagination?.cursor,
      count: supporterList.length + 1,
    },
  };
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
  console.log(conflictingSupporter);

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

  if (!user || !user.info?.sectionId || !user.info?.zoneId) throw "Erro ao criar usuário";

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
