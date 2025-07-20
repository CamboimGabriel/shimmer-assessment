import { memo } from "react";
import { Handle, Position } from "reactflow";
import { NodeProps } from "./types";
import { BiQuestionMark } from "react-icons/bi";

export const GenericNode = memo<NodeProps>(({ data, selected }) => {
  return (
    <div
      className={`items-center justify-center flex w-full h-full bg-[#2a2a2a] border-2 border-[#666666] rounded-lg shadow-lg relative ${
        selected ? "shadow-[0_0_20px_rgba(255,255,255,0.3)]" : ""
      }`}
      style={{ width: data.width, height: data.height }}
    >
      <BiQuestionMark className="text-gray-400" size={30} />

      <div className="absolute text-sm text-white bottom-[-30px] left-1/2 -translate-x-1/2 w-[200px]">
        {data.label}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="main"
        style={{
          background: "#999999",
          width: 10,
          height: 10,
          border: "none",
        }}
      />
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

GenericNode.displayName = "GenericNode";
