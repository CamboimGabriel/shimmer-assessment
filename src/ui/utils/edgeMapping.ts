import { Edge as ReactFlowEdge } from "reactflow";
import { Edge as CanonicalEdge } from "../../schema/canonical";

/**
 * Converts canonical edges to React Flow edges
 */
export function convertToReactFlowEdges(
  edges: CanonicalEdge[]
): ReactFlowEdge[] {
  return edges.map((edge) => {
    // Different styling for different connection types
    const isAIConnection =
      edge.from.portId?.includes("ai_languageModel") ||
      edge.to.portId?.includes("ai_languageModel");

    return {
      id: edge.id,
      source: edge.from.nodeId,
      target: edge.to.nodeId,
      sourceHandle: edge.from.portId?.split("-out-")[1],
      targetHandle: edge.to.portId?.split("-in-")[1],
      type: isAIConnection ? "bezier" : "smoothstep",
      animated: false,
      style: {
        stroke: isAIConnection ? "#999999" : "#666666",
        strokeWidth: isAIConnection ? 2 : 2,
        strokeDasharray: isAIConnection ? "5,5" : undefined,
      },
    };
  });
}
