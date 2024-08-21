import { Supporter } from "prisma/client";
import { UserWithInfo, UserWithoutPassword } from "prisma/types/User";
import { performance } from "perf_hooks";
import { getEnv, isProd } from "@/_shared/utils/settings";
import dayjs from "dayjs";
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
import { sendEmail } from "../../emails/service";
import {
  checkUserCanJoinCampaign,
  findCampaignById,
} from "../campaigns/service";
import {
  CreateSupporterDto,
  ReadSupporterBranchesDto,
  ReadSupportersDto,
  UpdateSupporterDto,
} from "./dto";
import { hashInfo } from "@/_shared/utils/bCrypt";
import { answerPoll } from "../polls/service";
import { RecursiveSupporterWithReferred } from "prisma/types/Supporter";
import { normalizeEmail, normalizePhone } from "@/_shared/utils/format";
import axios from "axios";
import { zoneWithoutGeoJSON } from "prisma/query/Zone";
import { fullTextSearch } from "odinkit";
import { cookies } from "next/headers";

export async function readSupporterBranches({
  supporterSession,
  where: { branches = 0, supporterId = null } = {},
}: ReadSupporterBranchesDto & {
  userSession: UserWithoutPassword;
  supporterSession: Supporter;
}) {
  function generateReferredObject(branches: number): any {
    if (branches === 0) {
      return {
        referral: { include: { user: { include: { info: true } } } },
        user: {
          include: {
            info: { include: { Section: true, Zone: zoneWithoutGeoJSON } },
          },
        },
      };
    } else {
      return {
        referred: {
          include: {
            referral: { include: { user: { include: { info: true } } } },
            user: {
              include: {
                info: { include: { Section: true, Zone: zoneWithoutGeoJSON } },
              },
            },
            ...generateReferredObject(branches - 1),
          },
        },
      };
    }
  }

  const supporterBranches = await prisma.supporterGroupMembership
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
                    info: {
                      include: { Section: true, Zone: zoneWithoutGeoJSON },
                    },
                  },
                },
                ...generateReferredObject(branches - 1),
              },
            },
            user: {
              include: {
                info: { include: { Section: true, Zone: zoneWithoutGeoJSON } },
              },
            },
            referral: { include: { user: { include: { info: true } } } },
          },
        },
      },
    })
    .then((m) => m?.supporter);

  if (!supporterBranches)
    throw "Você não tem permissão para acessar este apoiador";

  return supporterBranches as any as RecursiveSupporterWithReferred & {
    user: UserWithInfo;
  };
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
        ownerId: {
          not: {
            equals: supporterSession.referralId || undefined,
          },
        },
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

export async function readSupportersFulltext({
  pagination,
  where,
  supporterSession,
}: ReadSupportersDto & {
  supporterSession: Supporter;
}) {
  const searchQuery = where?.user?.name ? `'${where?.user?.name}':*` : "";

  let supporters: any[];

  if (where) {
    const query = await fullTextSearch({
      table: ["Supporter"],
      tableAlias: "s",
      joins: [
        `INNER JOIN 
        "User" u ON s."userId" = u.id`,
        `LEFT JOIN
        "UserInfo" u_info ON u."infoId" = u_info.id`,
        `INNER JOIN 
        "SupporterGroupMembership" sgm ON s.id = sgm."supporterId"`,
        `INNER JOIN 
        "SupporterGroup" sg ON sgm."supporterGroupId" = sg.id`,
      ],
      where: [
        `s."campaignId" = '${supporterSession.campaignId}'`,
        `sg."ownerId" = '${supporterSession.id}'`,
      ],
      select: [
        ["s", "id"],
        ["s", "userId"],
        ["u", "name"],
      ],
      searchField: ["u", "name"],
      orderBy: ["s", "id"],
    });

    supporters = await prisma.$queryRawUnsafe<any[]>(query, searchQuery, 10);
  } else {
    supporters = await prisma.supporter
      .findMany({
        take: pagination?.take || 10,
        skip: pagination?.skip,
        cursor: pagination?.cursor,
        where: {
          campaignId: supporterSession.campaignId,
          supporterGroupsMemberships: {
            some: {
              supporterGroup: {
                ownerId: supporterSession.id,
              },
            },
          },
        },
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
      })
      .then((supporters) =>
        supporters.map(({ user: { id, ...user }, ...s }) => ({
          ...s,
          ...user,
        }))
      );
  }

  const parsedSupporters = supporters.map((s) => ({
    id: s.id,
    user: {
      id: s.userId,
      name: s.name,
      email: s.email,
      phone: s.phone,
    },
  }));

  return {
    data: parsedSupporters,
    pagination: {
      count: supporters.length + 1,
    },
  };
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
        name: { contains: where?.user?.name },
        email: { contains: where?.user?.email },
        phone: { contains: where?.user?.phone },
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
        .then((s) => s?.id)
    : supporterSession.id;

  const supporterCount = await prisma.supporter.count({
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
  });

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
          name: true,
          email: true,
          phone: true,
        },
      },
      referral: {
        select: { level: true, user: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    data: supporterList,
    pagination: {
      cursor: pagination?.cursor,
      count: supporterList.length,
    },
    count: supporterCount,
  };
}

export async function createSupporter(request: CreateSupporterDto) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: request.user.email
        ? [
            {
              phone: normalizePhone(request.user.phone),
            },
            {
              id: request?.userId,
            },
            { email: normalizeEmail(request.user.email) },
          ]
        : [
            {
              phone: normalizePhone(request.user.phone),
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

  const referral = await prisma.supporter.findUnique({
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

  const userId = request?.userId || crypto.randomUUID();

  const supporterId = crypto.randomUUID();

  if (
    !user.info?.sectionId &&
    !user.info.addressId &&
    !request.externalSupporter
  )
    throw "Endereço ou seção não informados.";

  const addressId = request.externalSupporter
    ? undefined
    : user?.info?.addressId
      ? user.info.addressId
      : await prisma.section
          .findFirst({ where: { id: user.info.sectionId! } })
          .then((s) => s?.addressId);

  if (!addressId && !request.externalSupporter)
    throw "Endereço não encontrado.";

  const zoneId = request.externalSupporter
    ? undefined
    : user.info.addressId
      ? await prisma.address
          .findFirst({ where: { id: user.info.addressId } })
          .then((a) => a?.zoneId)
      : user.info.zoneId;

  const supporter = await prisma.supporter.create({
    include: { user: true },
    data: {
      id: supporterId,
      level: 1,
      Section: {
        connect: user?.info?.sectionId
          ? { id: user?.info?.sectionId }
          : undefined,
      },
      Zone: {
        connect: zoneId ? { id: zoneId } : undefined,
      },
      Address: {
        connect: addressId ? { id: addressId } : undefined,
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
            email: user.email ? normalizeEmail(user.email) : null,
            name: user.name,
            phone: normalizePhone(user.phone),
            password: user.password ? await hashInfo(user.password) : undefined,
            info: {
              create: {
                birthDate: dayjs(
                  user.info?.birthDate,
                  "DD/MM/YYYY"
                ).toISOString(),
                zoneId: zoneId,
                sectionId: user.info?.sectionId,
                addressId: addressId,
              },
            },
            role: "user",
          },
        },
      },
      SupporterGroup: {
        create: {
          memberships: {
            create: {
              supporterId,
            },
          },
        },
      },
      supporterGroupsMemberships: {
        create: [...createSupporterGroupMembershipQuery],
      },
    },
  });

  if (supporter && request?.poll?.questions) {
    for (const question of request.poll.questions) {
      question.supporterId = supporter.id;
    }
    await answerPoll({ ...request.poll, bypassIpCheck: true });
  }
  const wsUrl = `${isProd ? "https" : "http"}://${getEnv(
    "NEXT_PUBLIC_WS_SERVER"
  )}/campaign/${campaign.id}/supporter`;

  await axios
    .get(wsUrl, {
      headers: { Authorization: getEnv("WS_SERVER_TOKEN") },
    })
    .catch((err) => console.log(err));

  let recoveryLink;
  if (!user.password) {
    recoveryLink = await prisma.passwordRecovery.create({
      data: {
        userId,
        expiresAt: dayjs().add(7, "days").toISOString(),
      },
    });
  }

  if (user.email) {
    await sendEmail({
      to: user.email,
      templateId: recoveryLink ? "welcome_email_passwordless" : "welcome_email",
      dynamicData: {
        name: user.name,
        siteLink: recoveryLink
          ? `${getEnv("NEXT_PUBLIC_SITE_URL")}/recuperar/${recoveryLink.id}`
          : `${getEnv("NEXT_PUBLIC_SITE_URL")}/painel`,
        campaignName: campaign.name,
        subject: `Bem Vindo à Campanha ${campaign.name}! - ApoioZ`,
      },
    });
  }

  const referralInfo = await prisma.supporter.findFirst({
    where: { id: referral.id },
    include: { user: { include: { info: true } } },
  });

  if (!referralInfo) throw "Apoiador não encontrado";

  if (!referralInfo.user.email) return supporter;

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
  if (supporter.level === 4)
    throw "Você não pode sair da campanha sendo o líder.";

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

export async function updateSupporter(data: UpdateSupporterDto) {
  const campaignId = cookies().get("activeCampaign")?.value;

  if (!campaignId) throw "Campanha não encontrada";

  const supporter = await prisma.supporter.findFirst({
    where: { id: data.id, campaignId },
  });

  if (!supporter) throw "Apoiador não encontrado";

  const potentialConflict = await prisma.user.findFirst({
    where: data.email
      ? {
          email: normalizeEmail(data.email),
          id: { not: data.id },
          phone: normalizePhone(data.phone),
        }
      : { phone: normalizePhone(data.phone), id: { not: data.id } },
  });

  if (potentialConflict)
    throw `Email ou telefone já utilizado por outro apoiador.`;

  const updatedSupporter = await prisma.supporter.update({
    where: { id: data.id },
    data: {
      user: {
        update: {
          name: data.name,
          email: data.email ? normalizeEmail(data.email) : null,
          phone: normalizePhone(data.phone),
          info: {
            update: {
              Zone: {
                connect: { id: data.zoneId },
              },
              Section: {
                connect: { id: data.sectionId },
              },
            },
          },
        },
      },
      Zone: {
        connect: { id: data.zoneId },
      },
      Section: {
        connect: { id: data.sectionId },
      },
    },
  });

  await prisma.passwordRecovery.updateMany({
    where: { userId: updatedSupporter.userId },
    data: { expiresAt: dayjs().toISOString() },
  });

  return updatedSupporter;
}
