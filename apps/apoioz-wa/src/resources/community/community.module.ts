import { Module } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { CommunityController } from "./community.controller";
import { CommunitySocket } from "./community.socket";

@Module({
  controllers: [CommunityController],
  providers: [CommunityService, CommunitySocket],
})
export class CommunityModule {}
