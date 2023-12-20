import { Supporter } from "@prisma/client";
import { UserWithoutPassword } from "prisma/types/User";
import { getEnv } from "@/_shared/utils/settings";
import dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import { sendEmail } from "../../emails/service";
import { checkUserCanJoinCampaign, findCampaignById } from "../campaigns/service";
import {
  AddSupporterDto,
  CreateSupporterDto,
  ReadSupporterBranchesDto,
  ReadSupportersDto,
} from "./dto";
import { hashInfo } from "@/_shared/utils/bCrypt";
import { answerPoll } from "../polls/service";

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
          ownerId: supporterSession.id,
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
    .then((m) => m?.supporter);

  if (!supporterTree) throw "Você não tem permissão para acessar este apoiador";

  return supporterTree;
}

export async function readSupporterTrail({
  where: { supporterId } = {},
  supporterSession,
}: ReadSupporterBranchesDto & {
  userSession: UserWithoutPassword;
  supporterSession: Supporter;
}) {
  const supporterSupporterGroupsOwners = await prisma.supporterGroup
    .findMany({
      where: {
        memberships: {
          some: {
            supporterId: supporterId || supporterSession.id,
          },
        },
      },
      include: {
        owner: {
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
    .then((sg) => sg.map((m) => m.owner));

  const trail = supporterSupporterGroupsOwners.reduce((acc: any, curr: any) => {
    return [...acc, curr, ...curr.referred];
  }, []);

  return trail;
}

export async function readSupportersFromSupporterGroup({
  pagination,
  where,
  supporterSession,
}: ReadSupportersDto & {
  supporterSession: Supporter;
}) {
  const supporterList = await prisma.supporter.findMany({
    take: pagination?.take,
    where: {
      campaignId: supporterSession.campaignId,
      supporterGroupsMemberships: {
        some: {
          supporterGroup: {
            ownerId: supporterSession.id,
          },
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
  const supporterId = where?.supporterId
    ? await prisma.supporter
        .findFirst({
          where: {
            supporterGroupsMemberships: {
              some: {
                supporterGroup: {
                  ownerId: supporterSession.id,
                },
              },
            },
            id: where?.supporterId,
          },
        })
        .then((s) => s.id)
    : supporterSession.id;

  const supporterList = await prisma.supporter.findMany({
    take: pagination?.take,
    skip: pagination?.skip,
    cursor: pagination?.cursor,
    where: {
      campaignId: supporterSession.campaignId,
      supporterGroupsMemberships: {
        some: {
          supporterGroup: {
            ownerId: supporterId,
          },
        },
      },
      user: {
        name: { contains: where?.user?.name },
        email: { contains: where?.user?.email },
        phone: { contains: where?.user?.phone },
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

export async function createSupporter(request: CreateSupporterDto) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: request.user?.email,
        },
        {
          id: request?.userId,
        },
      ],
    },
    include: {
      info: true,
    },
  });

  if (existingUser) {
    const userCanJoinCampaign = await checkUserCanJoinCampaign({
      campaignId: request.campaignId,
      userId: existingUser.id,
    });

    if (userCanJoinCampaign != "canJoin") throw userCanJoinCampaign;
  }

  const campaign = await findCampaignById(request.campaignId);

  if (!campaign) throw "Campanha não encontrada";

  const referral = await prisma.supporter.findFirst({
    where: { id: request.referralId, campaignId: request.campaignId },
  });

  if (!referral) throw "Indicador não encontrado";

  const referralSupporterGroups = await prisma.supporterGroup.findMany({
    where: {
      memberships: {
        some: {
          supporterId: referral.id,
        },
      },
    },
  });

  const createSupporterGroupMembershipQuery = referralSupporterGroups.map(
    (supporterGroup) => ({
      supporterGroup: {
        connect: {
          id: supporterGroup.id,
        },
      },
    })
  );

  const user = existingUser || request.user!;

  const userId = request.userId || crypto.randomUUID();

  const supporterId = crypto.randomUUID();

  const supporter = await prisma.supporter.create({
    include: { user: true },
    data: {
      id: supporterId,
      level: 1,
      Section: {
        connect: user?.info?.sectionId ? { id: user?.info?.sectionId } : undefined,
      },
      Zone: {
        connect: user?.info?.zoneId ? { id: user?.info?.zoneId } : undefined,
      },
      campaign: { connect: { id: referral.campaignId } },
      referral: { connect: { id: referral.id } },
      user: {
        connectOrCreate: {
          where: {
            id: userId,
          },
          create: {
            id: userId,
            email: user.email,
            name: user.name,
            phone: user.phone,
            password: user.password ? await hashInfo(user.password) : undefined,
            info: {
              create: {
                birthDate: dayjs(user.info?.birthDate, "DD/MM/YYYY").toISOString(),
                zoneId: user.info?.zoneId,
                sectionId: user.info?.sectionId,
              },
            },
            role: "user",
          },
        },
      },
      SupporterGroup: {
        create: {},
      },
      supporterGroupsMemberships: {
        create: [
          {
            supporterGroup: {
              connect: {
                ownerId: supporterId,
              },
            },
          },
          ...createSupporterGroupMembershipQuery,
        ],
      },
    },
  });

  if (supporter && request?.poll?.questions) {
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

  if (!referralInfo) throw "Apoiador não encontrado";

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

export async function readSupporterFromUser(data: {
  userId: string;
  campaignId: string;
}) {
  const supporter = await prisma.supporter.findFirst({
    where: { userId: data.userId, campaignId: data.campaignId },
  });

  if (!supporter) throw "Apoiador não encontrado";

  return supporter;
}
