import { Injectable } from "@nestjs/common";
import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { WhatsappClient } from "./whatsappClient";

@Injectable()
export class WhatsappService extends WhatsappClient {
  constructor(private readonly discover: DiscoveryService) {
    super();
  }

  private discoverSockets() {
    return this.discover.providerMethodsWithMetaAtKey<string>("On");
  }

  async getContactByNumber(number: string) {
    return this.getContacts().then((contacts) =>
      contacts.find((contact) => contact.number == number)
    );
  }

  async getAnnouncementsGroup(community: any) {
    const announcementsGroup = await this.getChatById(
      community.groupMetadata.defaultSubgroup._serialized
    );

    return announcementsGroup;
  }

  async bootstrap() {
    const sockets = (await this.discoverSockets()).map((s) => {
      const handler = s.discoveredMethod.handler;
      const event = s.meta;
      return { event, handler };
    });

    for (const { event, handler } of sockets) {
      this.on(event, (...args: any[]) => {
        handler(...args, this);
      });
    }

    this.initialize();
  }
}
