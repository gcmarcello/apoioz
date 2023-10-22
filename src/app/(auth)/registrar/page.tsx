import { getStates } from "@/backend/resources/locations/locations.service";
import { getParties } from "@/backend/resources/parties/parties.service";
import RegistrarPage from "@/frontend/(auth)/register/page/page";

export default async function Registrar() {
  const parties = await getParties();
  const states = await getStates();
  return <RegistrarPage parties={parties} states={states} />;
}
