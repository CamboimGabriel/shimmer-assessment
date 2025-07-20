import React from "react";
import { useReactFlow } from "reactflow";
import { FiDownload } from "react-icons/fi";
import {
  Workflow,
  Node as CanonicalNode,
  Edge as CanonicalEdge,
} from "../schema/canonical";
import { n8nAdapter } from "../adapters/n8nAdapter";

interface Props {
  originalWorkflow: Workflow | null;
  disabled?: boolean;
}

export const ExportButton: React.FC<Props> = ({
  originalWorkflow,
  disabled,
}) => {
  const { getNodes, getEdges } = useReactFlow();

  const handleExport = () => {
    if (!originalWorkflow) return;

    try {
      // Get current state from React Flow
      const reactFlowNodes = getNodes();
      const reactFlowEdges = getEdges();

      // Convert React Flow nodes back to canonical format
      const canonicalNodes: CanonicalNode[] = reactFlowNodes.map((rfNode) => {
        // Find the original canonical node to preserve metadata
        const originalNode = originalWorkflow.nodes.find(
          (n) => n.id === rfNode.id
        );

        return {
          id: rfNode.id,
          type: rfNode.data.type,
          label: rfNode.data.label,
          ports: originalNode?.ports || [],
          position: rfNode.position,
          config: rfNode.data.config,
          raw: rfNode.data.raw,
          warnings: originalNode?.warnings,
        };
      });

      // Convert React Flow edges back to canonical format
      const canonicalEdges: CanonicalEdge[] = reactFlowEdges.map((rfEdge) => {
        // Find the original edge to preserve port information
        const originalEdge = originalWorkflow.edges.find(
          (e) => e.id === rfEdge.id
        );

        return {
          id: rfEdge.id,
          from: {
            nodeId: rfEdge.source,
            portId:
              originalEdge?.from.portId ||
              `${rfEdge.source}-out-${rfEdge.sourceHandle || "main"}`,
          },
          to: {
            nodeId: rfEdge.target,
            portId:
              originalEdge?.to.portId ||
              `${rfEdge.target}-in-${rfEdge.targetHandle || "main"}`,
          },
        };
      });

      // Create updated workflow with current positions
      const updatedWorkflow: Workflow = {
        ...originalWorkflow,
        nodes: canonicalNodes,
        edges: canonicalEdges,
      };

      // Serialize to n8n format
      if (n8nAdapter.serialize) {
        const exported = n8nAdapter.serialize(updatedWorkflow);

        // Create download
        const blob = new Blob([exported], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${originalWorkflow.name || "workflow"}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(
          "Exported workflow with updated positions:",
          updatedWorkflow
        );
      } else {
        throw new Error("n8n adapter does not support serialization");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert(
        "Failed to export workflow: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || !originalWorkflow}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center gap-2"
    >
      <FiDownload />
      Export
    </button>
  );
};
