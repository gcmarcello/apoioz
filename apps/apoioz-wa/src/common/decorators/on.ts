import { SetMetadata } from "@nestjs/common";
import { WhatsappEvents } from "../types/Whatsapp";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const On = (event: WhatsappEvents, description?: string) =>
  SetMetadata("On", event);
