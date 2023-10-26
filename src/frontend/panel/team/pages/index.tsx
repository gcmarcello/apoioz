import Image from "next/image";
import clsx from "clsx";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { fetchCampaignTeamMembers } from "@/backend/resources/campaign/campaign.actions";
import { toProperCase } from "@/(shared)/utils/format";
import WhatsAppIcon from "@/frontend/(shared)/components/icons/WhatsAppIcon";

export default async function TimePage() {
  const teamMembers = await fetchCampaignTeamMembers();
  if (!teamMembers) return;
  const leader = teamMembers.find((member) => member.level === 4)!;
  const thirdLevel = teamMembers.filter((member) => member.level === 3);
  const secondLevel = teamMembers.filter((member) => member.level === 2);

  const CampaignLeaderCard = () => {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="relative h-28 w-28 lg:h-64 lg:w-64">
          <Image
            fill={true}
            className="inline-block rounded-full border-4 border-yellow-500"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </div>

        <div className="ml-3">
          <p className="text-2xl font-medium text-gray-700 group-hover:text-gray-900">
            {leader.user.name}
          </p>
          <p className="text-lg font-medium text-gray-500 group-hover:text-gray-700">
            Ver Perfil
          </p>
        </div>
      </div>
    );
  };

  function TeamMemberCard({ member }: { member: any }) {
    if (member)
      return (
        <div className="flex items-center justify-start gap-2">
          <div className="relative h-16 w-16 lg:h-28 lg:w-28">
            <Image
              fill={true}
              className={clsx(
                "inline-block rounded-full border-2 lg:border-4",
                member.level === 3 ? "border-emerald-500" : "border-blue-500"
              )}
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>

          <div className="ml-3">
            <p className="text-lg font-medium text-gray-700 group-hover:text-gray-900">
              {member?.user?.name}
            </p>
            <p className="text-md font-medium text-gray-500 group-hover:text-gray-700">
              Zona {member.user?.info?.Zone?.number} -{" "}
              {toProperCase(member.user?.info?.City.name)}
            </p>
            <span className="flex items-center gap-1">
              <Link href={`https://wa.me/55${member.user.info?.phone}`} target="_blank">
                <WhatsAppIcon className="h-6 w-6 fill-gray-400 duration-200 hover:fill-gray-600" />
              </Link>
              <Link href={`mailto:${member.user.email}`}>
                <AtSymbolIcon className="h-7 w-7 text-gray-400 duration-200 hover:text-gray-600" />
              </Link>
            </span>
          </div>
        </div>
      );
  }

  return (
    <>
      <p className="mb-2 text-xl font-medium text-gray-700 group-hover:text-gray-900">
        Líder
      </p>
      <div className="flex items-center justify-center gap-10">
        <CampaignLeaderCard />
        <p className="hidden w-1/2 lg:block">
          Somos mais do que uma equipe: somos uma família de sonhadores, movidos pela
          paixão de construir um futuro melhor para todos nós. Cada rosto, cada história
          em nossa equipe reflete a esperança e o desejo de um Brasil mais justo e
          solidário. Se você se identifica com essa visão, saiba que não está sozinho.
          Estamos aqui, juntos, e contamos com você nessa jornada. Conheça nosso time e
          venha fazer parte dessa transformação conosco.
        </p>
      </div>
      <div className="my-3">
        <div className="inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>
      <p className="text-lg font-medium text-gray-700 group-hover:text-gray-900">
        Nível 3
      </p>
      <div className="mt-4 flex flex-col flex-wrap lg:flex-row">
        {thirdLevel.map((member) => (
          <div key={member.id} className="my-2 lg:w-1/3">
            <TeamMemberCard member={member} />
          </div>
        ))}
      </div>
      <div className="my-3">
        <div className="inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>
      <p className="text-lg font-medium text-gray-700 group-hover:text-gray-900">
        Nível 2
      </p>
      {secondLevel.length && (
        <div className="mt-4 flex flex-col flex-wrap lg:flex-row">
          {secondLevel.map((member) => (
            <div key={member.id} className="my-2 lg:w-1/4">
              <TeamMemberCard member={member} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
