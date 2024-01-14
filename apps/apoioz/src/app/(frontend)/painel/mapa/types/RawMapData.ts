import { ExtractSuccessResponse } from "@odinkit/api/ActionResponse";
import { createMapData } from "@/app/api/panel/map/actions";
import { SupporterSession } from "@/middleware/functions/supporterSession.middleware";

export type RawMapData = ExtractSuccessResponse<typeof createMapData> & {
  supporterSession: SupporterSession;
};
