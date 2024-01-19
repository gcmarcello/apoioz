import { Controller, Post, Body, Param, Delete, Get } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { SendCommunityMessageDto } from "./dto/send-message.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags(`Comunidades`)
@ApiBearerAuth("KEY")
@Controller("community")
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post()
  async createCommunity(@Body() createCommunityDto: CreateCommunityDto) {
    return this.communityService.create(createCommunityDto);
  }

  @Get(":slug/invite")
  async getInvite(@Param("slug") slug: string) {
    return this.communityService.getInvite(slug);
  }

  @Post(":slug/announcements")
  async sendAnnouncement(
    @Param("id") id: string,
    @Body() body: SendCommunityMessageDto
  ) {
    return this.communityService.sendAnnouncement(id, body.message);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.communityService.remove(id);
  }
}
