import { ComboboxField } from "@/app/(frontend)/_shared/components/fields/Select";
import { useAction } from "@/app/(frontend)/_shared/hooks/useAction";
import {
  readSupporterTrail,
  readSupportersFromGroup,
} from "@/app/api/panel/supporters/actions";
import { processNodesEdges } from "../lib/nodesEdges";
import { CustomFlowContext } from "../types/CustomFlowContext";
import { useForm } from "react-hook-form";

export function NodeSearch({
  customFlowContext: { saveEdges, saveNodes },
}: {
  customFlowContext: CustomFlowContext;
}) {
  const { trigger: fetchSupporterTrail } = useAction({
    action: readSupporterTrail,
    onSuccess: ({ data }) => {
      console.log(data);
      const { nodes, edges } = processNodesEdges({
        supporters: data,
        expandNodes: true,
      });
      saveNodes(nodes);
      saveEdges(edges);
    },
  });

  const form = useForm();

  return (
    <ComboboxField
      label="Encontre um apoiador"
      hform={form}
      name={"name"}
      fetcher={readSupportersFromGroup}
      onChange={(value) => {
        fetchSupporterTrail({
          where: {
            supporterId: value.id,
          },
        });
      }}
      displayValueKey={"user.name"}
    />
  );
}
