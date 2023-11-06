import React from "react";
import TreeNode from "./TreeNode";
import { TreeContext } from "./lib/TreeContext";

export interface TreeProps {
  label: React.ReactNode;
  lineHeight?: string; // Expected values like 'h-5'
  lineWidth?: string; // Expected values like 'w-1'
  lineColor?: string; // Expected Tailwind color like 'text-black'
  lineStyle?: string; // Expected values like 'dashed', 'dotted', 'solid', 'double'
  lineBorderRadius?: string; // Expected Tailwind border radius like 'rounded'
  nodePadding?: string; // Expected Tailwind padding like 'p-1'
  children: React.ReactNode;
}

function Tree({
  children,
  label,
  lineHeight = "h-5",
  lineWidth = "w-1",
  lineColor = "text-black",
  lineStyle = "solid",
  lineBorderRadius = "rounded-md",
  nodePadding = "p-5",
}: TreeProps) {
  const lineStyles = {
    height: lineHeight,
    width: lineWidth,
    color: lineColor,
    borderRadius: lineBorderRadius,
    padding: nodePadding,
    style: lineStyle,
  };

  return (
    <div
      className={`flex flex-col items-center ${lineStyles.color} border-${lineStyles.style} h-full overflow-x-auto`}
    >
      <div className={`border-t ${lineWidth} ${lineStyles.color}`}></div>
      <div className={`flex shrink-0 justify-start`}>
        <TreeContext.Provider value={{ lineStyles }}>
          <TreeNode label={label}>{children}</TreeNode>
        </TreeContext.Provider>
      </div>
    </div>
  );
}

export default Tree;
