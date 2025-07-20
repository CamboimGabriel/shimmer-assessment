import { memo } from "react";
import { Handle, Position } from "reactflow";
import { RiRobot2Fill } from "react-icons/ri";
import { NodeProps } from "./types";

export const AgentNode = memo<NodeProps>(({ data, selected }) => {
  return (
    <div
      className={`relative border-2 border-[#555555] rounded-2xl shadow-lg bg-[#3a3a3a] ${
        selected ? "shadow-[0_0_20px_rgba(255,255,255,0.3)]" : ""
      }`}
      style={{ width: data.width, height: data.height }}
    >
      {/* Main content area */}
      <div className="flex items-center justify-start gap-3 p-4 h-full">
        <RiRobot2Fill className="text-white text-2xl" size={24} />
        <span className="text-white text-lg font-medium">Agent</span>
      </div>

      {/* Connection point labels positioned below the handles */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2 text-xs text-gray-400 font-medium">
        <span className="text-center w-18">Chat Model</span>
        <span className="text-center w-16">Memory</span>
        <span className="text-center w-16">Tool</span>
      </div>

      {/* Input handle (left side) */}
      <Handle
        type="target"
        position={Position.Left}
        id="main"
        style={{
          background: "#9ca3af",
          width: 12,
          height: 12,
          border: "none",
          borderRadius: "50%",
          top: "50%",
        }}
      />

      {/* Output handle (right side) */}
      <Handle
        type="source"
        position={Position.Right}
        id="main"
        style={{
          background: "#9ca3af",
          width: 12,
          height: 12,
          border: "none",
          borderRadius: "50%",
          top: "50%",
        }}
      />

      {/* Bottom connection handles for Chat Model, Memory, and Tool */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="ai_languageModel"
        style={{
          background: "#a855f7",
          width: 12,
          height: 12,
          border: "none",
          borderRadius: "50%",
          left: "20%",
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="memory"
        style={{
          background: "#10b981",
          width: 12,
          height: 12,
          border: "none",
          borderRadius: "50%",
          left: "50%",
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="tool"
        style={{
          background: "#f59e0b",
          width: 12,
          height: 12,
          border: "none",
          borderRadius: "50%",
          left: "80%",
        }}
      />
    </div>
  );
});

AgentNode.displayName = "AgentNode";
