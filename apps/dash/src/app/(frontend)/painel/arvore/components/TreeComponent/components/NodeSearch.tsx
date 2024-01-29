import { ComboboxField } from "@/app/(frontend)/_shared/components/fields/Select";
import {
  Combobox,
  ErrorMessage,
  Form,
  Label,
  useAction,
  useForm,
} from "odinkit/client";
import { processNodesEdges } from "../lib/nodesEdges";
import { CustomFlowContext } from "../types/CustomFlowContext";
import { useReactFlow } from "reactflow";
import {
  readSupporterTrail,
  readSupportersFulltext,
} from "@/app/api/panel/supporters/actions";
import { z } from "zod";
import { useMemo } from "react";

const schema = z.object({
  supporter: z.string().uuid({
    message: "Esse apoiador não existe",
  }),
});

export function NodeSearch({
  customFlowContext: { saveEdges, saveNodes, toggleNodesVisibility },
}: {
  customFlowContext: CustomFlowContext;
}) {
  const { fitView } = useReactFlow();

  const searchForm = useForm({
    schema,
    fieldOptions: {
      enableAsterisk: false,
    },
  });

  const Field = useMemo(() => searchForm.createField(), []);

  const { data: supporterTrail, trigger: fetchSupporterTrail } = useAction({
    action: readSupporterTrail,
    onSuccess: ({ data }) => {
      const { nodes, edges } = processNodesEdges({
        supporters: data as any, //@todo
      });
      saveNodes(nodes);
      saveEdges(edges);
      toggleNodesVisibility(nodes as any);
      setTimeout(() => {
        const node = nodes.find(
          (node) => searchForm.getValues("supporter") === node.id
        )!;
        fitView({
          nodes: [node],
          duration: 2500,
          padding: 1,
        });
      }, 200);
    },
  });

  const { data: supporterList, trigger: fetchSupporterList } = useAction({
    action: readSupportersFulltext,
    onSuccess: ({ data }) => {},
  });

  return (
    <Form hform={searchForm} onSubmit={() => {}}>
      <Field name="supporter">
        <Label>Buscar apoiador</Label>
        <Combobox
          setData={(value) => {
            if (value) {
              fetchSupporterList({
                where: {
                  user: {
                    name: value,
                  },
                },
              });
            } else {
              fetchSupporterList();
            }
          }}
          data={supporterList}
          onChange={(value) => {
            if (value) {
              fetchSupporterTrail({
                where: {
                  supporterId: value.id,
                },
              });
            }
          }}
          valueKey="id"
          displayValueKey="user.name"
        >
          {(item) => item.user.name}
        </Combobox>
        <ErrorMessage />
      </Field>
    </Form>
  );
}
