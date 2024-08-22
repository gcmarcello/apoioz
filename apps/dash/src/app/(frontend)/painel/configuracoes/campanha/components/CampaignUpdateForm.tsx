"use client";
import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import {
  TextField,
  TextFieldWithAddon,
} from "@/app/(frontend)/_shared/components/fields/Text";
import { useAction } from "odinkit/client";
import { getContrastRatioFromHex } from "@/app/(frontend)/_shared/utils/colors";
import { updateCampaign } from "@/app/api/panel/campaigns/actions";
import {
  UpdateCampaignDto,
  updateCampaignDto,
} from "@/app/api/panel/campaigns/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Campaign } from "prisma/client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function CampaignUpdateForm({
  campaign,
}: {
  campaign: Campaign;
}) {
  const form = useForm<UpdateCampaignDto>({
    defaultValues: {
      name: campaign.name,
      year: campaign.year,
      slug: campaign.slug,
      options: {
        facebook: (campaign.options as any)?.facebook,
        instagram: (campaign.options as any)?.instagram,
        twitter: (campaign.options as any)?.twitter,
      },
    },
    resolver: zodResolver(updateCampaignDto),
  });
  const router = useRouter();

  const {
    data: supporter,
    trigger: updateCampaignTrigger,
    isMutating: isUpdating,
    error,
  } = useAction({
    action: updateCampaign,
    onError: (err) => {
      showToast({ message: err.message, title: "Erro", variant: "error" });
    },
    onSuccess: (res) => {
      router.push("/painel");
      showToast({
        message: `Informações atualizadas com sucesso!`,
        variant: "success",
        title: "Dados atualizados",
      });
    },
  });

  //@todo
  return (
    <main className="px-2 sm:px-6 lg:flex-auto lg:px-0">
      <div className="mt-14 max-w-2xl space-y-16 sm:space-y-20 lg:mx-4 lg:max-w-none">
        <form
          onSubmit={form.handleSubmit((data) =>
            updateCampaignTrigger(data as any)
          )}
        >
          <div className="space-y-8">
            <div className="border-b border-gray-900/10 pb-8">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Campanha
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                As configurações disponíveis dependem de seu nível de acesso.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                <div className="grid-cols-2 space-y-4 sm:col-span-8">
                  <div className="col-span-2 lg:col-span-1">
                    <TextField
                      hform={form}
                      label="Nome da Campanha"
                      name="name"
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <TextField
                      hform={form}
                      label="Ano da Campanha"
                      name="year"
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <TextFieldWithAddon
                      addon="apoioz.com.br/a/"
                      hform={form}
                      label="Slug (link da campanha)"
                      name="slug"
                    />
                  </div>
                </div>

                {/* <div className="pointer-events-none z-0 grayscale filter sm:col-span-6">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Cores - EM BREVE
                  </label>
                  <div className="mt-2 flex flex-col justify-between gap-4 space-y-4 rounded-lg  border border-gray-900/25 px-6  py-5 lg:flex-row">
                    <div className="space-y-4">
                      <div className="mb-4 flex flex-col ">
                        <div className="flex flex-col md:flex-row">
                          <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Primária
                          </label>
                          <p className="text-sm leading-6 text-gray-600 md:ms-2">
                            barra de navegação, botões principais e outros elementos.
                          </p>
                        </div>

                        <Controller
                          name="options.primaryColor"
                          control={form.control}
                          defaultValue=""
                          render={({ field }) => (
                            <div className="relative">
                              <input
                                className="absolute inset-0 h-10 w-10 cursor-pointer opacity-0"
                                type="color"
                                id="color-picker"
                                name="color"
                                {...field}
                              />
                              <div className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-gray-300 shadow-sm">
                                <div
                                  id="color-preview"
                                  className="h-full w-full rounded-full"
                                  style={{
                                    backgroundColor: form.watch("options.primaryColor"),
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-col  md:flex-row">
                          <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Cor Secundária
                          </label>
                          <p className="text-sm leading-6 text-gray-600 md:ms-2 ">
                            links, botões secundários e outros elementos.
                          </p>
                        </div>

                        <Controller
                          name="options.secondaryColor"
                          control={form.control}
                          defaultValue=""
                          render={({ field }) => (
                            <div className="relative">
                              <input
                                className="absolute inset-0 h-10 w-10 cursor-pointer opacity-0"
                                type="color"
                                id="color-picker"
                                name="color"
                                {...field}
                              />
                              <div className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-gray-300 shadow-sm">
                                <div
                                  id="color-preview"
                                  className="h-full w-full rounded-full"
                                  style={{
                                    backgroundColor: form.watch("options.secondaryColor"),
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      {contrast < 4 ? (
                        <WarningAlert
                          warnings={[
                            "Contraste entre cores insuficiente. Isso pode causar dificuldade na leitura do site.",
                          ]}
                        />
                      ) : (
                        <SuccessAlert
                          successes={[
                            "Bom contraste entre as cores. Os usuários terão uma experiência melhor ao utilizar o site.",
                          ]}
                        />
                      )}
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
              <div className="grid-cols-2 space-y-4 sm:col-span-8">
                <div className="col-span-2 lg:col-span-1">
                  <TextField
                    hform={form}
                    label="Link do Facebook"
                    name="options.facebook"
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <TextField
                    hform={form}
                    label="Link do Instagram"
                    name="options.instagram"
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <TextField
                    hform={form}
                    label="Link do Twitter"
                    name="options.twitter"
                  />
                </div>
              </div>

              {/* <div className="pointer-events-none z-0 grayscale filter sm:col-span-6">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Cores - EM BREVE
                  </label>
                  <div className="mt-2 flex flex-col justify-between gap-4 space-y-4 rounded-lg  border border-gray-900/25 px-6  py-5 lg:flex-row">
                    <div className="space-y-4">
                      <div className="mb-4 flex flex-col ">
                        <div className="flex flex-col md:flex-row">
                          <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Primária
                          </label>
                          <p className="text-sm leading-6 text-gray-600 md:ms-2">
                            barra de navegação, botões principais e outros elementos.
                          </p>
                        </div>

                        <Controller
                          name="options.primaryColor"
                          control={form.control}
                          defaultValue=""
                          render={({ field }) => (
                            <div className="relative">
                              <input
                                className="absolute inset-0 h-10 w-10 cursor-pointer opacity-0"
                                type="color"
                                id="color-picker"
                                name="color"
                                {...field}
                              />
                              <div className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-gray-300 shadow-sm">
                                <div
                                  id="color-preview"
                                  className="h-full w-full rounded-full"
                                  style={{
                                    backgroundColor: form.watch("options.primaryColor"),
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-col  md:flex-row">
                          <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Cor Secundária
                          </label>
                          <p className="text-sm leading-6 text-gray-600 md:ms-2 ">
                            links, botões secundários e outros elementos.
                          </p>
                        </div>

                        <Controller
                          name="options.secondaryColor"
                          control={form.control}
                          defaultValue=""
                          render={({ field }) => (
                            <div className="relative">
                              <input
                                className="absolute inset-0 h-10 w-10 cursor-pointer opacity-0"
                                type="color"
                                id="color-picker"
                                name="color"
                                {...field}
                              />
                              <div className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-gray-300 shadow-sm">
                                <div
                                  id="color-preview"
                                  className="h-full w-full rounded-full"
                                  style={{
                                    backgroundColor: form.watch("options.secondaryColor"),
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      {contrast < 4 ? (
                        <WarningAlert
                          warnings={[
                            "Contraste entre cores insuficiente. Isso pode causar dificuldade na leitura do site.",
                          ]}
                        />
                      ) : (
                        <SuccessAlert
                          successes={[
                            "Bom contraste entre as cores. Os usuários terão uma experiência melhor ao utilizar o site.",
                          ]}
                        />
                      )}
                    </div>
                  </div>
                </div> */}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            {/* <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button> */}
            <button
              type="submit"
              className={clsx(
                "rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600",
                isUpdating && "cursor-not-allowed opacity-50"
              )}
            >
              <div className="flex gap-2">
                Salvar {isUpdating && <ButtonSpinner />}
              </div>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
