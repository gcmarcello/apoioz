import { Injectable } from "@nestjs/common";
import { On } from "src/common/decorators/on";
import { ContextOf } from "src/common/types/Whatsapp";
import { WhatsappClient } from "../whatsapp/whatsappClient";
import prisma from "src/prisma/prisma";

@Injectable()
export class CommunitySocket {
  @On("group_join", "Checks if user must be admin of community")
  async onContactChanged(
    context: ContextOf<"group_join">,
    client: WhatsappClient
  ) {
    const group = (await context.getChat()) as any;
    const recipient = await context
      .getRecipients()
      .then((recipients) => recipients[0]);
    const communityId = group.groupMetadata.parentGroup._serialized ?? group.id;
    const community = await waPrisma.community.findFirst({
      where: {
        id: communityId,
      },
      include: {
        CommunityCluster: {
          include: {
            admins: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    const isAdmin = community.CommunityCluster.admins.some(
      (admin) => admin.user.number == recipient.number
    );

    if (isAdmin) {
      const whatsappCommunity = (await client.getChatById(communityId)) as any;

      await whatsappCommunity.promoteParticipants([recipient.id._serialized]);
    }
  }
}
