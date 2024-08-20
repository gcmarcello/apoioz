import { updateSupporterDto } from "@/app/api/panel/supporters/dto";
import { ButtonSpinner, formatPhone } from "odinkit";
import {
  Button,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  Select,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { useEffect, useMemo } from "react";
import { updateSupporter } from "@/app/api/panel/supporters/actions";
import { useReport } from "../context/report.ctx";

export default function EditSupporterModal() {
  const { setSelectedSupporter, selectedSupporter, zones, sections } =
    useReport();
  const form = useForm({
    schema: updateSupporterDto,
    mode: "onChange",
  });

  useEffect(() => {
    if (!selectedSupporter) return;
    form.setValue("name", selectedSupporter.user.name);
    form.setValue("email", selectedSupporter.user.email ?? undefined);
    form.setValue(
      "phone",
      selectedSupporter.user.phone
        ? formatPhone(selectedSupporter.user.phone)
        : ""
    );
    form.setValue("id", selectedSupporter.id);
    form.setValue("zoneId", selectedSupporter.zoneId ?? "");
    form.setValue("sectionId", selectedSupporter.sectionId ?? "");
  }, [selectedSupporter]);

  const { trigger, isMutating } = useAction({
    action: updateSupporter,
    onSuccess: () => {
      setSelectedSupporter(null);
      showToast({
        message: "Apoiador atualizado com sucesso",
        variant: "success",
        title: "Sucesso!",
      });
    },
    onError: () =>
      showToast({
        message: "Não foi possível atualizar o apoiador",
        variant: "error",
        title: "Erro!",
      }),
  });

  const Field = useMemo(() => form.createField(), []);

  return (
    <Dialog
      open={!!selectedSupporter}
      onClose={() => setSelectedSupporter(null)}
    >
      <DialogTitle>Editar Apoiador</DialogTitle>
      <DialogDescription>
        Qualquer alteração realizada se refletirá em qualquer outra campanha que
        esse apoiador esteja participando.
      </DialogDescription>
      <Form hform={form} onSubmit={(data) => trigger(data)}>
        <DialogBody>
          <Fieldset>
            <FieldGroup className="space-y-3">
              <Field name="name">
                <Label>Nome Completo</Label>
                <Input />
                <ErrorMessage />
              </Field>
              <Field name="email">
                <Label>Email</Label>
                <Input placeholder="email@apoiador.com" />
                <ErrorMessage />
              </Field>
              <Field name="phone">
                <Label>Telefone</Label>
                <Input
                  mask={(_: any, rawValue: any) => {
                    if (Number(rawValue)) {
                      if (rawValue.length >= "99999999999".length) {
                        return "(99) 99999-9999";
                      } else if (rawValue.length === "9999999999".length) {
                        return "(99) 9999-9999";
                      }
                    }
                    return "";
                  }}
                />
                <ErrorMessage />
              </Field>
              <hr />
              <Field name="zoneId">
                <Label>Zona</Label>
                <Select
                  data={zones}
                  displayValueKey="number"
                  onChange={() => {
                    form.setValue("sectionId", undefined);
                  }}
                />
              </Field>
              <Field name="sectionId">
                <Label>Seção</Label>
                <Combobox
                  data={sections}
                  displayValueKey={"number"}
                  disabled={!form.watch("zoneId")}
                  inputMode="numeric"
                >
                  {(item) => item.number}
                </Combobox>
                <ErrorMessage />
              </Field>
            </FieldGroup>
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setSelectedSupporter(null)}>
            Cancelar
          </Button>
          <Button type="submit" color="indigo">
            <div className="flex gap-2">
              Salvar{" "}
              {isMutating && (
                <div className="flex items-center justify-center">
                  <ButtonSpinner size="medium" />
                </div>
              )}
            </div>
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
