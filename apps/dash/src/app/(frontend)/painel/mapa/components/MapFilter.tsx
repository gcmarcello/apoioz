"use client";
import DisclosureAccordion from "@/app/(frontend)/_shared/components/Disclosure";
import CheckboxInput from "@/app/(frontend)/_shared/components/fields/Checkbox";
import { useMapData } from "../hooks/useMapData";
import { useFieldArray, useFormContext } from "react-hook-form";
import Paragraph from "@/app/(frontend)/_shared/components/text/Paragraph";
import { For } from "@/app/(frontend)/_shared/components/For";

export function MapFilter() {
  const { neighborhoods, zones, ...mapData } = useMapData();

  const { fields: zoneFields } = useFieldArray({
    control: mapData.control,
    name: "zones",
  });

  const { fields: neighborhoodFields } = useFieldArray({
    control: mapData.control,
    name: "neighborhoods",
  });

  return (
    <form className="">
      <DisclosureAccordion title={"Zonas"}>
        <div className="max-h-96 overflow-y-auto ps-1">
          {zoneFields.map(
            (
              field: any,
              index //@todo
            ) => (
              <CheckboxInput
                key={`filter-${index}`}
                hform={mapData}
                onChange={() =>
                  mapData.setValue(
                    "neighborhoods",
                    neighborhoods.map((n) => ({ ...n, checked: false }))
                  )
                }
                label={
                  <span className="flex items-center gap-2 space-x-2">
                    {field.color && (
                      <span
                        style={{ backgroundColor: field.color }}
                        className="min-h-[16px] min-w-[16px] rounded"
                      ></span>
                    )}
                    {field.label}
                  </span>
                }
                data={field.id}
                name={`zones.${index}.checked`}
              />
            )
          )}
        </div>
      </DisclosureAccordion>
      <DisclosureAccordion title={"Bairros"}>
        <div className="max-h-96 overflow-y-auto ps-1">
          {neighborhoods.every((n) => n.geoJSON) ? (
            <>
              <CheckboxInput
                key={`filter-all`}
                hform={mapData}
                onChange={() => {
                  neighborhoods.forEach((n, i) => {
                    mapData.setValue(`neighborhoods.${i}.checked`, false);
                  });

                  mapData.setValue(
                    "neighborhoods",
                    neighborhoods.map((n) => ({
                      ...n,
                      checked: mapData.getValues(
                        "neighborhoods.all.checked" as any
                      ),
                    }))
                  );
                }}
                label={
                  <span className="flex items-center gap-2 space-x-2">
                    <span className="min-h-[16px] min-w-[16px] rounded bg-slate-600"></span>
                    Selecionar Todos
                  </span>
                }
                data={"all"}
                name={`neighborhoods.all.checked`}
              />
              <For each={neighborhoodFields}>
                {(
                  field: any,
                  index //@todo
                ) => (
                  <CheckboxInput
                    key={`filter-${index}`}
                    hform={mapData}
                    onChange={() => {
                      mapData.setValue(
                        "zones",
                        zones.map((n) => ({ ...n, checked: false }))
                      );

                      if (
                        mapData.getValues("neighborhoods.all.checked" as any)
                      ) {
                        mapData.setValue(
                          "neighborhoods",
                          neighborhoods.map((n) => ({
                            ...n,
                            checked: field.name === n?.name, //@todo
                          }))
                        );
                      }

                      mapData.setValue(
                        "neighborhoods.all.checked" as any,
                        false
                      );
                    }}
                    label={
                      <span className="flex items-center gap-2 space-x-2">
                        {field.color && (
                          <span
                            style={{ backgroundColor: field.color }}
                            className="min-h-[16px] min-w-[16px] rounded"
                          ></span>
                        )}
                        {field.label}
                      </span>
                    }
                    data={field.id}
                    name={`neighborhoods.${index}.checked`}
                  />
                )}
              </For>
            </>
          ) : (
            <Paragraph className="text-center">Bairros em breve</Paragraph>
          )}
        </div>
      </DisclosureAccordion>
      <DisclosureAccordion defaultOpen={true} title={"Opções"}>
        <div className="max-h-96 overflow-y-auto ps-1">
          <CheckboxInput
            key={`showEmptySections`}
            hform={mapData}
            label="Mostrar Colégios sem Apoio"
            name={`sections.showEmptySections`}
          />
          {/* <Button
          variant="secondary"
          role="button"
          className="my-2 flex w-full justify-center"
          onClick={(e) => clearFilters(e)}
        >
          Limpar Filtros
        </Button> TODO */}
        </div>
      </DisclosureAccordion>
    </form>
  );
}
