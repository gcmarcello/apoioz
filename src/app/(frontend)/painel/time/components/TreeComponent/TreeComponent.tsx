"use client";

import { For } from "@/app/(frontend)/_shared/components/For";
import Tree from "@/app/(frontend)/_shared/components/organizational-charts/Tree";
import TreeNode from "@/app/(frontend)/_shared/components/organizational-charts/TreeNode";

type SupporterBallProps = {
  name: string;
  role: string;
  imageUrl: string;
};

function Ball({ supporter }: { supporter: SupporterBallProps }) {
  return (
    <div className="flex flex-col items-center">
      <img
        className="h-10 w-10 rounded-full"
        src={
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
        alt=""
      />
      <h3 className="mt-2 text-center text-base font-semibold leading-7 tracking-tight text-gray-900">
        {supporter.name}
      </h3>
      <p className="text-sm leading-6 text-gray-600">{supporter.role}</p>
    </div>
  );
}

const renderTreeNodes = (supporters) => {
  console.log(supporters);
  return supporters.map((supporter) => (
    <TreeNode
      label={
        <Ball
          supporter={{
            name: supporter.user.name,
            role: supporter.role,
          }}
        />
      }
      key={supporter.id}
    >
      {supporter.referred.length > 0 && renderTreeNodes(supporter.referred)}
    </TreeNode>
  ));
};

export default function TreeComponent({ supportersTree }: { supportersTree: any }) {
  const rootSupporter = supportersTree[0];
  console.log(rootSupporter);
  return (
    <div className="h-full w-full  pb-10">
      <Tree label={<Ball supporter={rootSupporter} />} nodePadding="5px">
        {renderTreeNodes([
          { user: { name: "xd", info: "" }, role: "putao", imageUrl: "piruzord" },
        ])}
      </Tree>
    </div>
  );
}
