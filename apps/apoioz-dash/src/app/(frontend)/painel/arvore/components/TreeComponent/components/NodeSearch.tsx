import { ComboboxField } from "@/app/(frontend)/_shared/components/fields/Select";
import { useAction } from "@odinkit/hooks/useAction";
import { processNodesEdges } from "../lib/nodesEdges";
import { CustomFlowContext } from "../types/CustomFlowContext";
import { useForm } from "react-hook-form";
import { useReactFlow } from "reactflow";
import {
  readSupporterTrail,
  readSupportersFulltext,
} from "@/app/api/panel/supporters/actions";

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
        supporters: data as any, //@todo
      });
      saveNodes(nodes);
      saveEdges(edges);
      toggleNodesVisibility(nodes as any);
      console.log(data);
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

  return (
    <ComboboxField
      label="Encontre um apoiador"
      hform={searchForm}
      name={"supporter"}
      fetcher={readSupportersFulltext}
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
