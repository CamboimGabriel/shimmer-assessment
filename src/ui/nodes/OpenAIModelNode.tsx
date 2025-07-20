import { memo } from "react";
import { Handle, Position } from "reactflow";
import { RiOpenaiFill } from "react-icons/ri";
import { NodeProps } from "./types";

export const OpenAIModelNode = memo<NodeProps>(({ data, selected }) => {
  return (
    <div
      className={`items-center justify-center flex relative rounded-full w-full h-full bg-[#2a2a2a] border-2 border-[#666666] shadow-lg ${
        selected ? "shadow-[0_0_20px_rgba(255,255,255,0.3)]" : ""
      }`}
      style={{ width: data.width, height: data.height }}
    >
      <RiOpenaiFill className="text-white text-lg" size={30} />

      <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-center w-[240%]">
        <div className="font-semibold text-sm text-white">{data.label}</div>
      </div>

      <Handle
        type="source"
        position={Position.Top}
        id="ai_languageModel"
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

OpenAIModelNode.displayName = "OpenAIModelNode";
