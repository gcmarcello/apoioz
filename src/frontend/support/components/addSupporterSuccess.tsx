import Link from "next/link";
import Footer from "../../../common/components/footer";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

export default function AddSupporterSuccess({ campaign }: { campaign: any }) {
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
          <p className="mt-6 text-xl leading-8">
            Muito obrigado por se juntar a nós! Sua participação é crucial para
            o sucesso da nossa campanha. Juntos, somos mais fortes.
          </p>
          <div className="mt-10 max-w-4xl">
            <p>
              Agora que você faz parte da nossa rede de apoio, aqui estão
              algumas maneiras de você poder contribuir utilizando nosso
              sistema:
            </p>
            <ul role="list" className="mt-8 max-w-3xl space-y-8 text-gray-600">
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
              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-indigo-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Reuniões.
                  </strong>{" "}
                  Sua presença e insights são valiosos para nós. Fique atento às
                  datas e horários e venha fazer sua voz ser ouvida!
                </span>
              </li>
              <li className="flex gap-x-3">
                <CheckCircleIcon
                  className="mt-1 h-5 w-5 flex-none text-indigo-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Contato.
                  </strong>{" "}
                  e você tiver dúvidas, sugestões ou quiser se envolver ainda
                  mais com a campanha, não hesite em entrar em contato conosco.
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
              campanha. Se você cadastrou uma senha, clique abaixo para acessar
              o painel.
            </p>
            <div className="fixed left-0 divide-x lg:divide-x-0 bottom-0 bg-indigo-600 lg:bg-transparent w-full lg:static flex justify-between items-center gap-2 mt-8">
              <Link href={"/login"}>
                <button
                  type="button"
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Acessar o Painel de Controle
                </button>
              </Link>

              <Link href={"/recuperar"}>
                <p className="text-sm block text-white lg:text-indigo-600 hover:text-indigo-400">
                  Configurar senha
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
