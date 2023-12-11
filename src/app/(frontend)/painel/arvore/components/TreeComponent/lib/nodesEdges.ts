import { data } from "autoprefixer";

export const createEdge = (source, target) => ({
  id: `e${source}->${target}`,
  source: source.toString(),
  target: target.toString(),
  type: "smoothstep",
});

export const createNode = (node) => {
  console.log(Boolean(node.referred));
  return {
    id: node.id.toString(),
    type: "supporter",
    position: {
      x: 0,
      y: 0,
    },
    data: {
      label: node.user.name,
      level: node.level,
      hasChildren: Boolean(node.referred),
    },
  };
};
