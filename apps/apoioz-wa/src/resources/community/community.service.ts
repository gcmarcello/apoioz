import { Injectable } from "@nestjs/common";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { WhatsappService } from "../whatsapp/whatsapp.service";

@Injectable()
export class CommunityService {
  constructor(private whatsappService: WhatsappService) {}

  async getInvite(clusterSlug: string) {
    const communities = await waPrisma.community.findMany({
      where: {
        CommunityCluster: {
          slug: clusterSlug,
        },
      },
    });

    const whatsappCommunities = [];
    for await (const community of communities) {
      whatsappCommunities.push(
        await this.whatsappService.getChatById(community.id)
      );
    }

    const announcementsChats = [];
    for await (const chat of whatsappCommunities) {
      if (chat.isGroup) {
        announcementsChats.push(
          await this.whatsappService.getChatById(
            chat.groupMetadata.defaultSubgroup._serialized
          )
        );
      }
    }

    let availableGroup = announcementsChats.find(
      (chat) => chat.groupMetadata.participants.length < 2000
    );

    if (!availableGroup) {
      const communityCluster = await waPrisma.communityCluster.findFirst({
        where: {
          slug: clusterSlug,
        },
      });

      const { announcementsGroupId } = await this.create({
        clusterSlug: communityCluster.slug,
        communityTitle: communityCluster.title,
        description: communityCluster.description,
      });

      availableGroup = this.whatsappService.getChatById(announcementsGroupId);
    }

    return availableGroup.getInviteCode();
  }

  async sendAnnouncement(clusterSlug: string, message: string) {
    const communities = await waPrisma.community.findMany({
      where: {
        CommunityCluster: {
          slug: clusterSlug,
        },
      },
    });

    const whatsappCommunities = [];
    for await (const community of communities) {
      whatsappCommunities.push(
        await this.whatsappService.getChatById(community.id)
      );
    }

    const announcementsChats = [];
    for await (const chat of whatsappCommunities) {
      if (chat.isGroup) {
        announcementsChats.push(
          await this.whatsappService.getChatById(
            chat.groupMetadata.defaultSubgroup._serialized
          )
        );
      }
    }

    for await (const chat of announcementsChats) {
      await chat.sendMessage(message);
    }
  }

  async create({
    communityTitle,
    ownerNumber,
    clusterSlug,
    ...options
  }: CreateCommunityDto) {
    const whatsappCreateCommunityResponse =
      await this.whatsappService.createCommunity(communityTitle, options);

    if (typeof whatsappCreateCommunityResponse === "string")
      throw whatsappCreateCommunityResponse;

    if (!("cid" in whatsappCreateCommunityResponse))
      throw "Error creating community";

    const whatsappCommunity = await this.whatsappService.getChatById(
      whatsappCreateCommunityResponse.cid._serialized
    );

    const owner = await this.whatsappService.getContactByNumber(ownerNumber);

    const ownerChat = await owner.getChat();

    const announcementsGroup =
      (await this.whatsappService.getAnnouncementsGroup(
        whatsappCommunity
      )) as any;

    const inviteCode = await announcementsGroup.getInviteCode();

    await ownerChat.sendMessage(
      `Olá, ${owner.pushname}! Você criou a comunidade ${communityTitle} com sucesso! Compartilhe o link abaixo para que as pessoas possam entrar na comunidade. \n\n${inviteCode}`
    );

    return await waPrisma.community.create({
      data: {
        id: whatsappCommunity.id._serialized,
        announcementsGroupId: announcementsGroup.id._serialized,
        CommunityCluster: {
          connectOrCreate: {
            create: {
              title: communityTitle,
              slug: clusterSlug,
              description: options.description,
              admins: {
                create: {
                  user: {
                    connectOrCreate: {
                      create: {
                        number: ownerNumber,
                      },
                      where: {
                        number: ownerNumber,
                      },
                    },
                  },
                },
              },
            },
            where: {
              slug: clusterSlug,
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    const community = (await this.whatsappService.getChatById(id)) as any;
    await community.deactivate();
  }
}
