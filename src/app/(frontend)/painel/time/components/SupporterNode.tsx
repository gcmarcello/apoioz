import clsx from "clsx";
import { memo } from "react";
import { Handle, Position } from "reactflow";

function SupporterNode({ data }: { data: any }) {
  if (!data) return null;

  const colors = {
    1: "!bg-red-800 !bg-yellow-500/20",
    2: "!bg-blue-800 !bg-blue-500/20",
    3: "!bg-emerald-800 !bg-emerald-500/20",
    4: "!bg-yellow-600 !bg-yellow-500/20",
  };

  return (
    <div className="block w-72 rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          🤓
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">
            {data.label.length > 15 ? `${data.label.slice(0, 15)}...` : data.label}
          </div>
          <div className="text-gray-500">Apoiador</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className={clsx("w-16", colors[data.level], "shadow-md")}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={clsx("w-16", colors[data.level], "shadow-md")}
      />
    </div>
  );
}

export default memo(SupporterNode);
