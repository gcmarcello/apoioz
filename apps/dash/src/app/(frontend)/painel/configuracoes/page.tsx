import { readUser } from "@/app/api/user/actions";
import { headers } from "next/headers";
import ProfileUpdateForm from "./components/ProfileUpdateForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const userId = headers().get("userId");
  if (!userId) {
    return redirect("/painel");
  }
  const user = await readUser(userId);
  if (!user) {
    return redirect("/painel");
  }

  return (
    <>
      <main className="px-4 pb-20 sm:px-6 lg:flex-auto lg:px-0">
        <div className="mt-14 max-w-2xl space-y-16 sm:space-y-20 lg:mx-4 lg:max-w-none">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Perfil
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Informações pessoais do apoiador. Elas são compartilhadas entre as
              redes de apoio que você participa.
            </p>
            <ProfileUpdateForm user={user} />
          </div>
        </div>
      </main>
    </>
  );
}
