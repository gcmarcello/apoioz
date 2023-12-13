import { ComboboxField } from "@/app/(frontend)/_shared/components/fields/Select";
import { useAction } from "@/app/(frontend)/_shared/hooks/useAction";
import {
  readSupporterTrail,
  readSupportersFromGroup,
} from "@/app/api/panel/supporters/actions";
import { processNodesEdges } from "../lib/nodesEdges";
import { CustomFlowContext } from "../types/CustomFlowContext";
import { useForm } from "react-hook-form";
import { useReactFlow } from "reactflow";

export function NodeSearch({
  customFlowContext: { saveEdges, saveNodes, toggleNodesVisibility },
}: {
  customFlowContext: CustomFlowContext;
}) {
  const { fitView } = useReactFlow();

  const searchForm = useForm();

  const { trigger: fetchSupporterTrail } = useAction({
    action: readSupporterTrail,
    onSuccess: ({ data }) => {
      const { nodes, edges } = processNodesEdges({
        supporters: data,
      });
      saveNodes(nodes);
      saveEdges(edges);
      toggleNodesVisibility(nodes as any);
      setTimeout(() => {
        const node = nodes.find((node) => searchForm.getValues("supporter") === node.id);
        fitView({
          duration: 2500,
          padding: 1,
          nodes: [node],
        });
      }, 200);
    },
  });

  return (
    <ComboboxField
      label="Encontre um apoiador"
      hform={searchForm}
      name={"supporter"}
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
