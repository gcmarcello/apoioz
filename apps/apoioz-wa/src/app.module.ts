import { Module } from "@nestjs/common";
import { SettingsModule } from "./resources/settings/settings.module";
import { CommunityModule } from "./resources/community/community.module";
import { WhatsappModule } from "./resources/whatsapp/whatsapp.module";

@Module({
  imports: [SettingsModule, CommunityModule, WhatsappModule],
})
export class AppModule {}
