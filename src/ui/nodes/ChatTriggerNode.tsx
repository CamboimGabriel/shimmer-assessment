import { memo } from "react";
import { Handle, Position } from "reactflow";
import { FiMessageCircle } from "react-icons/fi";
import { NodeProps } from "./types";

export const ChatTriggerNode = memo<NodeProps>(({ data, selected }) => {
  return (
    <div
      className={`relative items-center justify-center flex bg-[#444444] border-2 border-[#666666] rounded-l-[30px] rounded-r-md shadow-md ${
        selected ? "shadow-[0_0_20px_rgba(255,255,255,0.3)]" : ""
      }`}
      style={{ width: data.width, height: data.height }}
    >
      <FiMessageCircle className="text-white text-lg" size={30} />

      <div className="text-sm text-white absolute bottom-[-50px] text-center w-[180%] left-1/2 -translate-x-1/2 font-medium">
        {data.label}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="main"
        style={{
          background: "#999999",
          width: 10,
          height: 10,
          border: "none",
        }}
      />
    </div>
  );
});

ChatTriggerNode.displayName = "ChatTriggerNode";
