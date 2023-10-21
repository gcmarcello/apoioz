import { getParties } from "@/backend/resources/parties/parties.service";
import RegistrarPage from "@/frontend/(auth)/register/page/page";

export default async function Registrar() {
  const parties = await getParties();
  return <RegistrarPage parties={parties} />;
}
