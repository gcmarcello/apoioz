import { readParties } from "@/app/api/elections/parties/actions";
import RegisterPage from "./components/RegisterPage";
import { readStates } from "@/app/api/elections/locations/actions";

export default async function Registrar() {
  const parties = await readParties();
  const states = await readStates();
  return <RegisterPage parties={parties} states={states} />;
}
