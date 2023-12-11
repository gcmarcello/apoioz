import { MouseEventHandler } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";

import styles from "./styles/styles.module.css";
import clsx from "clsx";
import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/solid";

type NodeData = {
  expanded: boolean;
  label: string;
  level: number;
  hasChildren: boolean;
};

function getLabel(data: any): string {
  if (!data.hasChildren) {
    return data.label;
  }

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

export default function CustomNode({ data, id, xPos, yPos }: NodeProps<NodeData>) {
  const { addNodes, addEdges } = useReactFlow();

  const addChildNode: MouseEventHandler = (evt) => {
    if (data.expanded) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    const newNodeId = `${id}__${new Date().getTime()}`;

    addNodes({
      id: newNodeId,
      position: { x: xPos, y: yPos + 100 },
      data: { label: "X" },
    });
    addEdges({
      id: `${id}->${newNodeId}`,
      source: id,
      target: newNodeId,
      type: "smoothstep",
    });
  };

  const label = getLabel(data);
  const color = getColor(data);

  return (
    <div className="block w-72 rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          🤓
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{label}</div>
          <div className="text-gray-500">Apoiador</div>
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
        className={clsx("-mb-6 flex w-full justify-center !bg-transparent text-gray-500")}
      >
        {!data.expanded && <EllipsisHorizontalIcon className="h-5 w-5" />}
      </Handle>
    </div>
  );
}
