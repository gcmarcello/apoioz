import { Edge, Handle, Node, NodeProps, Position, useReactFlow } from "reactflow";

import clsx from "clsx";

import { ChevronDownIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { useAction } from "@/app/(frontend)/_shared/hooks/useAction";
import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { processNodesEdges } from "../lib/nodesEdges";
import { CustomFlowContext } from "../types/CustomFlowContext";
import { readSupporterBranches } from "@/app/api/panel/supporters/actions";
import { flattenSupporterWithReferred } from "@/app/(frontend)/_shared/utils/flattenSupporterTree";

type NodeData = {
  expanded: boolean;
  expandable: boolean;
  label: string;
  level: number;
  hasChildren: boolean;
};

function getLabel(data: any): string {
  return data.label.length > 15 ? `${data.label.slice(0, 15)}...` : data.label;
}

function getColor(data: any): string {
  const expandedColors = {
    1: "!bg-red-800",
    2: "!bg-blue-800",
    3: "!bg-emerald-800",
    4: "!bg-yellow-600",
  };

  const expandableColors = {
    1: "!bg-red-200",
    2: "!bg-blue-200",
    3: "!bg-emerald-200",
    4: "!bg-yellow-200",
  };

  if (data.level === 4) return "!bg-yellow-600";

  const expandedColor = expandedColors[data.level];
  const expandableColor = expandableColors[data.hasChildren];

  return data.expanded
    ? expandedColor
    : data.expandable
    ? expandableColor
    : expandedColor;
}

export function CustomNode({
  customFlowContext: { toggleNodesVisibility, saveEdges, saveNodes },
  ...node
}: Node<NodeData> & {
  customFlowContext: CustomFlowContext;
}) {
  const {
    trigger: fetchSupporterReferred,
    isMutating: isFetching,
    error: error,
  } = useAction({
    action: readSupporterBranches,
    parser: (data) => {
      if (data.referred.length < 1) throw "No referred found";

      return flattenSupporterWithReferred(data);
    },
    onSuccess: ({ data }) => {
      const { nodes, edges } = processNodesEdges({ supporters: data });
      saveNodes(nodes);
      saveEdges(edges);
      toggleNodesVisibility(node as any);
    },
  });

  const label = getLabel(node.data);
  const color = getColor(node.data);

  return (
    <div className="block w-72 rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          🤓
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{label}</div>
          <div className="text-gray-500">
            {node.data.level === 4 ? "Líder" : "Apoiador"}
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className={clsx("w-16", color, "shadow-md")}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={clsx("w-16", color, "shadow-md")}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={clsx(
          "-mb-10 flex w-full justify-center !bg-transparent text-gray-500"
        )}
        onClick={() => {
          node.data.hasChildren
            ? toggleNodesVisibility(node as any)
            : fetchSupporterReferred({ where: { supporterId: node.id, branches: 1 } });
        }}
      >
        {isFetching ? (
          <ButtonSpinner />
        ) : node.data.expanded ? (
          <MinusCircleIcon className="ml-10 h-10 w-10" />
        ) : (
          !error && <ChevronDownIcon className="h-10 w-10" />
        )}
      </Handle>
    </div>
  );
}
