import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node as ReactFlowNode,
  Edge as ReactFlowEdge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { Workflow } from "../schema/canonical";
import { FiTarget } from "react-icons/fi";
import { nodeTypes } from "./nodes";
import { convertToReactFlowNodes } from "./utils/nodeMapping";
import { convertToReactFlowEdges } from "./utils/edgeMapping";

interface Props {
  workflow: Workflow | null;
  onNodeSelect?: (nodeId: string | null) => void;
}

export const GraphView: React.FC<Props> = ({ workflow, onNodeSelect }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<ReactFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge>([]);

  // Update nodes and edges when workflow changes
  React.useEffect(() => {
    if (workflow) {
      const reactFlowNodes = convertToReactFlowNodes(workflow.nodes);
      const reactFlowEdges = convertToReactFlowEdges(workflow.edges);
      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [workflow, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: ReactFlowNode) => {
      onNodeSelect?.(node.id);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect?.(null);
  }, [onNodeSelect]);

  if (!workflow) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1a1a1a] h-full w-full">
        <div className="text-center p-8 bg-[#2a2a2a] rounded-lg shadow-xl border border-[#666666]">
          <FiTarget className="text-6xl mb-4 text-gray-400 mx-auto" />
          <div className="text-white text-xl font-semibold mb-2">
            No workflow loaded
          </div>
          <div className="text-gray-400 text-sm mb-4">
            Import a workflow to start visualizing and editing
          </div>
          <div className="text-xs text-gray-500">
            Supported formats: n8n JSON, YAML, XML
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        proOptions={{ hideAttribution: true }}
        fitView
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a1a",
        }}
      >
        <Controls className="bg-[#2a2a2a] border-[#666666]" />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#333333"
        />
        <MiniMap
          className="bg-[#2a2a2a] border-[#666666]"
          nodeColor="#444444"
          maskColor="rgba(26, 26, 26, 0.8)"
        />
      </ReactFlow>
    </div>
  );
};
