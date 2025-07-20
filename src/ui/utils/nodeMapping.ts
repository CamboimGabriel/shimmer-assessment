import { Node as ReactFlowNode } from "reactflow";
import { Node as CanonicalNode } from "../../schema/canonical";

interface NodeTypeMapping {
  type: string;
  width: number;
  height: number;
}

/**
 * Maps a canonical node type to React Flow node type and dimensions
 */
export function getNodeMapping(nodeType: string): NodeTypeMapping {
  let reactFlowType = "generic";
  let width = 80;
  let height = 80;

  if (nodeType.includes("chatTrigger")) {
    reactFlowType = "chatTrigger";
    width = 80;
    height = 80;
  } else if (nodeType.includes("agent")) {
    reactFlowType = "agent";
    width = 230;
    height = 80;
  } else if (nodeType.includes("lmChatOpenAi") || nodeType.includes("openai")) {
    reactFlowType = "openaiModel";
    width = 70;
    height = 70;
  } else if (nodeType.includes("stickyNote")) {
    reactFlowType = "stickyNote";
    width = 200;
    height = 130;
  }

  return { type: reactFlowType, width, height };
}

/**
 * Converts canonical nodes to React Flow nodes
 */
export function convertToReactFlowNodes(
  nodes: CanonicalNode[]
): ReactFlowNode[] {
  return nodes.map((node) => {
    const mapping = getNodeMapping(node.type);

    return {
      id: node.id,
      type: mapping.type,
      position: node.position || { x: 0, y: 0 },
      data: {
        label: node.label,
        type: node.type,
        config: node.config,
        raw: node.raw,
        width: mapping.width,
        height: mapping.height,
      },
      style: {
        width: mapping.width,
        height: mapping.height,
      },
      draggable: true,
      selectable: true,
      deletable: false,
    };
  });
}
