import { Mocker } from "@/app/(frontend)/_shared/components/Mocker";
import ErrorAlert from "@/app/(frontend)/_shared/components/alerts/errorAlert";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import { CreateSupportersDto, createSupportersDto } from "@/app/api/panel/supporters/dto";
import {
  createSupporter,
  readSupportersFromGroup,
} from "@/app/api/panel/supporters/actions";
import { fakerPT_BR } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Campaign } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
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

export function AddSupporterForm({
  campaign,
  setMetaform,
}: {
  campaign: Campaign;
  setMetaform: Dispatch<SetStateAction<MetaForm>>;
}) {
  const ref = useRef<null | HTMLDivElement>(null);
  const errRef = useRef<null | HTMLDivElement>(null);

  const form = useForm<CreateSupportersDto>({
    resolver: zodResolver(createSupportersDto as any),
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

  const { data: supporter, trigger: addSupporter } = useAction({
    action: createSupporter,
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
    if (!form) return;
    setMetaform({
      submit: addSupporter,
      form: form,
    });
  }, [form]);

  async function generateFakeData() {
    if (!zones) return;
    const zone = zones[Math.floor(Math.random() * zones.length)];

    const { data: sections } = await fetchSections(zone.id);
    if (!sections) return;

    form.setValue("name", fakerPT_BR.person.fullName());
    form.setValue("email", fakerPT_BR.internet.email());
    form.setValue("phone", fakerPT_BR.phone.number());
    form.setValue("info.zoneId", zone.id);
    form.setValue(
      "info.sectionId",
      sections[Math.round(Math.random() * sections.length)].id
    );
    form.setValue(
      "info.birthDate",
      dayjs(fakerPT_BR.date.past({ refDate: 1 }).toISOString()).format("DD/MM/YYYY")
    );
    form.trigger("name");
  }

  if (!zones || !form) return <></>;

  return (
    <form>
      <div className="space-y-6 pb-5 pt-6">
        <Mocker
          mockData={generateFakeData}
          submit={form.handleSubmit((data) => addSupporter(data))}
        />
        <div className="flex items-center">
          <h4 className="block text-lg font-medium leading-6 text-gray-900">
            Adicionar Manualmente
          </h4>
        </div>
        {form.formState.errors.root?.serverError.message ? (
          <div ref={errRef} className="scroll-mt-64">
            <ErrorAlert
              errors={[form.formState.errors.root.serverError.message as string]}
            />
          </div>
        ) : null}
        <TextField label="Nome do Apoiador" hform={form} name={"name"} />
        <TextField label="Email" hform={form} name={"email"} />
        <MaskedTextField
          label="Celular"
          hform={form}
          name={"phone"}
          mask="(99) 99999-9999"
        />
        <MaskedTextField
          hform={form}
          label="Data de Nascimento"
          mask="99/99/9999"
          name={"info.birthDate"}
        />
        <ComboboxField
          label="Indicador"
          hform={form}
          name={"referralId"}
          fetcher={readSupportersFromGroup}
          displayValueKey={"user.name"}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-1">
            <ListboxField
              hform={form}
              data={zones}
              displayValueKey={"number"}
              name={"info.zoneId"}
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
              name={"info.sectionId"}
              displayValueKey={"number"}
              disabled={!sections}
              onChange={(value) => {
                fetchAddress(value.id);
              }}
              reverseOptions={true}
            />
          </div>
        </div>
        {address && (
          <div ref={ref} className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Local de Votação
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {toProperCase(address.location || "")}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Endereço</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {toProperCase(address.address + ", " + address.City?.name)}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </form>
  );
}
