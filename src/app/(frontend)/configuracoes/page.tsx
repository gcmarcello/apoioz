import { readUser } from "@/app/api/user/actions";
import { headers } from "next/headers";
import ProfileUpdateForm from "./components/ProfileUpdateForm";
import { TopNavigation } from "../_shared/components/navigation/TopNavigation";
import { SectionTitle } from "../_shared/components/text/SectionTitle";
import ProfileDropdown from "../_shared/components/navigation/ProfileDropdown";
import { redirect } from "next/navigation";
import { ParagraphLink } from "../_shared/components/text/ParagraphLink";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";

export default async function SettingsPage() {
  const userId = headers().get("userId");
  if (!userId) {
    redirect("/painel");
  }
  const user = await readUser(userId);
  if (!user) {
    redirect("/");
  }

  return (
    <>
      <main className="px-4 sm:px-6 lg:flex-auto lg:px-0">
        <TopNavigation className="flex justify-between p-4 shadow-md">
          <div className="block">
            <ParagraphLink href="/painel">
              {" "}
              <div className="flex items-center gap-2">
                <ArrowLeftCircleIcon className="h-5 w-5" />
                Voltar ao Menu
              </div>
            </ParagraphLink>
          </div>
          <ProfileDropdown user={user} />
        </TopNavigation>
        <div className="mb-10 mt-24 max-w-2xl space-y-16 sm:space-y-20 lg:mx-4 lg:max-w-none">
          <div className="lg:px-20">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Perfil</h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Informações pessoais do apoiador. Elas são compartilhadas entre as redes de
              apoio que você participa.
            </p>
            <div>
              <ProfileUpdateForm user={user} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
