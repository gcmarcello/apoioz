import { Injectable } from "@nestjs/common";
import { On } from "src/common/decorators/on";
import { ContextOf } from "src/common/types/Whatsapp";
import * as qrcode from "qrcode-terminal";
@Injectable()
export class WhatsappSocket {
  constructor() {}

  @On("ready")
  onReady() {
    console.log("Client is ready");
  }

  @On("message")
  async onMessage(message: ContextOf<"message">) {
    console.log({ body: message.body, from: message.from });
    if (message.from === "18604901936@c.us" || message.fromMe)
      message.reply("Arioles Bonitioles Perfeita");
  }

  @On("qr")
  async onQR(qr: ContextOf<"qr">) {
    console.log(qr);
    qrcode.generate(qr, { small: true });
    await waPrisma.metadata.upsert({
      create: {
        key: "qr",
        value: qr,
      },
      where: {
        key: "qr",
      },
      update: {
        value: qr,
      },
    });
  }

  /* @On("authenticated")
  async onAuthenticated(authenticated: ContextOf<"authenticated">) {
    const sessionString = JSON.stringify(authenticated);
    await prisma.metadata.upsert({
      create: {
        key: "wa_session",
        value: sessionString,
      },
      where: {
        key: "wa_session",
      },
      update: {
        value: sessionString,
      },
    });
  } */

  @On("loading_screen")
  async onLoading(percent, message: any) {
    percent === 100
      ? console.log("%cLoading complete!", "color: green")
      : console.log(`${message} - ${percent}%`);
  }
}
