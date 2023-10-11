import Image from "next/image";
import { fetchCampaignTeamMembers } from "../../api/services/campaign";
import { cookies } from "next/headers";
import clsx from "clsx";
import { SupporterType } from "../../../common/types/userTypes";
import WhatsAppIcon from "../../../common/components/icons/WhatsAppIcon";
import { toProperCase } from "../../../common/utils/format";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function TimePage() {
  const campaignId = cookies().get("activeCampaign")?.value;
  if (!campaignId) return;

  const teamMembers = await fetchCampaignTeamMembers(campaignId);
  const leader = teamMembers.find((member) => member.level === 4)!;
  const thirdLevel = teamMembers.filter((member) => member.level === 3);
  const secondLevel = teamMembers.filter((member) => member.level === 2);

  const CampaignLeaderCard = () => {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="h-28 w-28 lg:h-64 lg:w-64 relative">
          <Image
            fill={true}
            className="inline-block rounded-full border-yellow-500 border-4"
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
          <div className="h-16 w-16 lg:h-28 lg:w-28 relative">
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
            <span className="flex gap-1 items-center">
              <Link
                href={`https://wa.me/55${member.user.info?.phone}`}
                target="_blank"
              >
                <WhatsAppIcon className="fill-gray-400 hover:fill-gray-600 duration-200 h-6 w-6" />
              </Link>
              <Link href={`mailto:${member.user.email}`}>
                <AtSymbolIcon className="h-7 w-7 text-gray-400 hover:text-gray-600 duration-200" />
              </Link>
            </span>
          </div>
        </div>
      );
  }

  return (
    <>
      <p className="text-xl mb-2 font-medium text-gray-700 group-hover:text-gray-900">
        Líder
      </p>
      <div className="flex items-center justify-center gap-10">
        <CampaignLeaderCard />
        <p className="w-1/2 hidden lg:block">
          Somos mais do que uma equipe: somos uma família de sonhadores, movidos
          pela paixão de construir um futuro melhor para todos nós. Cada rosto,
          cada história em nossa equipe reflete a esperança e o desejo de um
          Brasil mais justo e solidário. Se você se identifica com essa visão,
          saiba que não está sozinho. Estamos aqui, juntos, e contamos com você
          nessa jornada. Conheça nosso time e venha fazer parte dessa
          transformação conosco.
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
      <div className="mt-4 flex flex-col gap-3 lg:flex-row">
        {thirdLevel.map((member) => (
          <div key={member.id} className="flex-grow">
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
        <div className="mt-4 flex flex-col gap-3 lg:flex-row">
          {secondLevel.map((member) => (
            <div key={member.id} className="flex-grow">
              <TeamMemberCard member={member} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
