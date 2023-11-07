import React from "react";
import { LineStyles } from "./lib/types";
import { useTree } from "./lib/useTree";

export interface NodeTreeProps {
  label: React.ReactNode;
  localLineStyles?: LineStyles;
  children?: React.ReactNode;
  className?: string;
}

function TreeNode({ children, label, localLineStyles, className }: NodeTreeProps) {
  const hasChildren = React.Children.count(children) > 0;

  const { lineStyles: globalLineStyles } = useTree();

  const lineStyles = localLineStyles || globalLineStyles;

  return (
    <div className={`flex flex-col items-center ${className} w-24 flex-shrink-0`}>
      <div>{label}</div>
      {hasChildren && (
        <div className="flex flex-col items-center">
          <div
            className={`border-l ${lineStyles.width} ${lineStyles.color} ${lineStyles.borderRadius} ${lineStyles.height}`}
          ></div>
          <div className={`flex ${lineStyles.padding} grow justify-center`}>
            {React.Children.map(children, (child) => (
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-full border-t ${lineStyles.color} ${lineStyles.borderRadius} ${lineStyles.style}`}
                ></div>
                <div
                  className={`border-l ${lineStyles.width} ${lineStyles.color} ${lineStyles.borderRadius} ${lineStyles.height}`}
                ></div>
                {child}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TreeNode;
