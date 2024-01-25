import { Global, Module } from "@nestjs/common";
import { WhatsappService } from "./whatsapp.service";
import { DiscoveryModule } from "@golevelup/nestjs-discovery";
import { WhatsappSocket } from "./whatsapp.socket";

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [WhatsappService, WhatsappSocket],
  exports: [WhatsappService],
})
export class WhatsappModule {}
