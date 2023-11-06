import { getUser } from "@/app/api/user/actions";
import { headers } from "next/headers";
import ProfileUpdateForm from "./components/ProfileUpdateForm";

export default async function SettingsPage() {
  const user = await getUser(headers().get("userId"));

  return (
    <>
      <main className="px-4 sm:px-6 lg:flex-auto lg:px-0">
        <div className="mt-14 max-w-2xl space-y-16 sm:space-y-20 lg:mx-4 lg:max-w-none">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Perfil</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Informações pessoais do apoiador. Elas são compartilhadas entre as campanhas
              que você participa.
            </p>
            <ProfileUpdateForm user={user} />
          </div>
        </div>
      </main>
    </>
  );
}
