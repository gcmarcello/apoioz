import { getParties } from "@/app/api/elections/parties/actions";
import RegisterPage from "./components/RegisterPage";
import { getStates } from "@/app/api/elections/locations/actions";

export default async function Registrar() {
  const parties = await getParties();
  const states = await getStates();
  return <RegisterPage parties={parties} states={states} />;
}
