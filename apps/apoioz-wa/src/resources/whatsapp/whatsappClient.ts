import { Injectable } from "@nestjs/common";
import { Client, RemoteAuth } from "whatsapp-web.js";
import { waStore } from "./WAStore";

@Injectable()
export class WhatsappClient extends Client {
  constructor() {
    super({
      authStrategy: new RemoteAuth({
        clientId: `apoioz-session-${new Date().getTime()}`,
        dataPath: "./.wwebjs_auth",
        store: waStore,
        backupSyncIntervalMs: 600000,
      }),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });
  }
}
