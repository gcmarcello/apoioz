import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { MapIndex } from "./components";
import { createMapData } from "@/app/api/panel/map/service";

export default async function MapPage() {
  const {
    request: { supporterSession },
  } = await UseMiddlewares().then(UserSessionMiddleware).then(SupporterSessionMiddleware);

  const geoData = await createMapData({ supporterSession });

  return (
    <MapIndex
      data={{
        ...geoData,
        supporterSession,
      }}
    />
  );
}
