import ErrorAlert from "@/app/(frontend)/_shared/components/alerts/errorAlert";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import { AddSupporterDto, addSupporterDto } from "@/app/api/panel/supporters/dto";
import {
  addSupporter,
  readSupportersFromSupporterGroup,
} from "@/app/api/panel/supporters/actions";
import { fakerPT_BR } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Campaign } from "@prisma/client";
import { Dispatch, SetStateAction, useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAction } from "@/app/(frontend)/_shared/hooks/useAction";
import { toProperCase } from "@/_shared/utils/format";
import { MetaForm } from "@/app/(frontend)/_shared/hooks/useMetaform";
import {
  ComboboxField,
  ListboxField,
} from "@/app/(frontend)/_shared/components/fields/Select";
import {
  TextField,
  MaskedTextField,
} from "@/app/(frontend)/_shared/components/fields/Text";
import dayjs from "dayjs";
import { readZonesByCampaign } from "@/app/api/elections/zones/actions";
import { readSectionsByZone } from "@/app/api/elections/sections/action";
import { readAddressBySection } from "@/app/api/elections/locations/actions";
import SwitchInput from "@/app/(frontend)/_shared/components/fields/Switch";
import { SidebarContext } from "../lib/sidebar.ctx";
import { scrollToElement } from "@/app/(frontend)/_shared/utils/scroll";
import clsx from "clsx";
import DisclosureAccordion from "@/app/(frontend)/_shared/components/Disclosure";

export function AddSupporterForm({
  campaign,
  setMetaform,
}: {
  campaign: Campaign;
  setMetaform: Dispatch<SetStateAction<MetaForm>>;
}) {
  const ref = useRef<null | HTMLDivElement>(null);
  const errRef = useRef<null | HTMLDivElement>(null);

  const { supporter: userSupporter } = useContext(SidebarContext);

  const form = useForm<AddSupporterDto>({
    resolver: zodResolver(addSupporterDto),
    mode: "onChange",
  });

  const { data: zones, trigger: fetchZones } = useAction({
    action: readZonesByCampaign,
  });

  const { data: sections, trigger: fetchSections } = useAction({
    action: readSectionsByZone,
  });

  const { data: address, trigger: fetchAddress } = useAction({
    action: readAddressBySection,
  });

  const { data: supporter, trigger: addSupporterTrigger } = useAction({
    action: addSupporter,
    onError: (err) => showToast({ message: err, variant: "error", title: "Erro" }),
    onSuccess: ({ data }) => {
      showToast({
        message: `${data.user.name} adicionado a campanha`,
        variant: "success",
        title: "Apoiador Adicionado",
      });
      form.reset();
    },
  });

  useEffect(() => {
    fetchZones(campaign.id);
  }, []);

  useEffect(() => {
    if (ref.current) {
      scrollToElement(ref.current, 0);
    }
  }, [address]);

  useEffect(() => {
    if (form.getValues("externalSupporter")) {
      form.setValue("user.info.zoneId", undefined);
      form.setValue("user.info.sectionId", undefined);
    }
  }, [form.watch("externalSupporter")]);

  useEffect(() => {
    if (!form) return;
    setMetaform({
      submit: addSupporterTrigger,
      form: form,
    });
  }, [form]);

  async function generateFakeData() {
    if (!zones) return;
    const zone = zones[Math.floor(Math.random() * zones.length)];

    const { data: sections } = await fetchSections(zone.id);
    if (!sections) return;

    form.setValue("user.name", fakerPT_BR.person.fullName());
    form.setValue("user.email", fakerPT_BR.internet.email());
    form.setValue("user.phone", fakerPT_BR.phone.number());
    form.setValue("user.info.zoneId", zone.id);
    form.setValue(
      "user.info.sectionId",
      sections[Math.round(Math.random() * sections.length)].id
    );
    form.setValue(
      "user.info.birthDate",
      dayjs(fakerPT_BR.date.past({ refDate: 1 }).toISOString()).format("DD/MM/YYYY")
    );
    form.setValue("externalSupporter", false);
    form.trigger("user.name");
  }

  if (!zones || !form) return <></>;

  return (
    <form>
      <div className="pb-4 pt-2">
        <div className="space-y-3 divide-y">
          <div className="space-y-3">
            <div className="flex items-center"></div>
            {form.formState.errors.root?.serverError.message ? (
              <div ref={errRef} className="scroll-mt-64">
                <ErrorAlert
                  errors={[form.formState.errors.root.serverError.message as string]}
                />
              </div>
            ) : null}
            <TextField label="Nome do Apoiador" hform={form} name={"user.name"} />
            <TextField label="Email" hform={form} name={"user.email"} />
            <MaskedTextField
              label="Celular"
              hform={form}
              name={"user.phone"}
              mask="(99) 99999-9999"
            />
            <MaskedTextField
              hform={form}
              label="Data de Nascimento"
              mask="99/99/9999"
              name={"user.info.birthDate"}
            />
            {!form.watch("externalSupporter") && (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <ListboxField
                    hform={form}
                    data={zones}
                    displayValueKey={"number"}
                    name={"user.info.zoneId"}
                    label="Zona"
                    onChange={(value) => {
                      fetchSections(value.id);
                    }}
                  />
                </div>
                <div className="col-span-1">
                  <ComboboxField
                    hform={form}
                    data={sections}
                    label="Seção"
                    name={"user.info.sectionId"}
                    displayValueKey={"number"}
                    disabled={!sections}
                    onChange={(value) => {
                      fetchAddress(value.id);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          {userSupporter.level >= 4 && (
            <DisclosureAccordion title="Opções de Administrador" scrollToContent={true}>
              <div className="space-y-8">
                <ComboboxField
                  label="Indicado Por"
                  hform={form}
                  name={"referralId"}
                  fetcher={readSupportersFromSupporterGroup}
                  displayValueKey={"user.name"}
                />

                <SwitchInput
                  control={form.control}
                  label="Apoiador Externo"
                  name="externalSupporter"
                  subLabel="que não vive na região."
                />
              </div>
            </DisclosureAccordion>
          )}
        </div>

        {!form.watch("externalSupporter") && (
          <div
            ref={ref}
            className={clsx(
              "mt-6 border-t border-gray-100",
              address ? "block" : "hidden"
            )}
          >
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Local de Votação
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {toProperCase(address?.location || "")}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Endereço</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {toProperCase(address?.address + ", " + address?.City?.name)}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </form>
  );
}
