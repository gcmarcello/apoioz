import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { BottomNavigation } from "@/app/(frontend)/_shared/components/navigation/BottomNavigation";
import { Button } from "@/app/(frontend)/_shared/components/Button";
import clsx from "clsx";
import {
  MegaphoneIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import WhatsAppIcon from "@/app/(frontend)/_shared/components/icons/WhatsAppIcon";

export default function AddSupporterSuccess({
  campaign,
  email,
}: {
  campaign: any;
  email?: string;
}) {
  return (
    <>
      <div className="bg-white px-6 py-5 lg:px-8">
        <div className="mx-auto max-w-4xl text-base leading-7 text-gray-700">
          <p className="text-base font-semibold leading-7 text-indigo-600">
            Cadastro bem-sucedido!
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Bem-vindo à rede de apoio {campaign.name}
          </h1>
          <p className="mt-6">
            Agora que você faz parte da nossa rede de apoio, aqui estão algumas
            maneiras de você poder contribuir utilizando nossas ferramentas:
          </p>

          <div className="mt-10 max-w-4xl pb-20">
            <ul role="list" className="mt-8 max-w-3xl space-y-8 text-gray-600">
              {campaign.options?.showGroupOnSignup ? (
                <li>
                  <div className="flex gap-x-3">
                    <WhatsAppIcon
                      aria-hidden="true"
                      className={clsx(
                        "h-8 w-8 fill-green-500 sm:my-1 sm:h-5 sm:w-5",
                        "-my-0.5"
                      )}
                    />
                    <div>
                      <span>
                        <strong className="font-semibold text-gray-900">
                          Whatsapp
                        </strong>{" "}
                        Faça parte da conversa e receba as últimas atualizações!
                      </span>
                      <div className="mt-4 flex gap-x-4">
                        <Button
                          variant="success"
                          className="flex flex-grow gap-2"
                        >
                          <MegaphoneIcon className="h-5 w-5 text-white" /> Canal
                        </Button>
                        <Button
                          variant="success"
                          className="flex flex-grow gap-2"
                        >
                          <UserGroupIcon className="h-5 w-5 text-white" /> Grupo
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li className="flex gap-x-3">
                  <CheckCircleIcon
                    className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Divulgação.
                    </strong>{" "}
                    Compartilhe nossa campanha nas redes sociais e com seus
                    amigos.
                  </span>
                </li>
              )}

              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-indigo-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Reuniões.
                  </strong>{" "}
                  Fique atento às datas e horários e venha fazer sua voz ser
                  ouvida!
                </span>
              </li>
            </ul>
            <p className="mt-8">
              Sua participação pode fazer a diferença. Juntos, vamos alcançar
              nosso objetivo!
            </p>

            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
              Se envolva!
            </h2>
            <p className="mt-6">
              Fique atento ao seu email e às nossas redes sociais para receber
              informações sobre eventos, reuniões e outras atividades de nossa
              campanha.
            </p>
          </div>
          <BottomNavigation className="py-4">
            <div className="flex w-full items-center justify-center px-3">
              <Link href={`/login?email=${email}`}>
                <Button variant="primary">Acessar o Painel de Controle</Button>
              </Link>
            </div>
          </BottomNavigation>
        </div>
      </div>
    </>
  );
}
