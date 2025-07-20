import { memo } from "react";
import { FiFileText } from "react-icons/fi";
import { NodeProps } from "./types";

export const StickyNoteNode = memo<NodeProps>(({ data, selected }) => {
  return (
    <div
      className={`w-full h-full bg-[#8b7a2e] border-2 border-[#a08935] rounded-lg shadow-lg p-4 relative ${
        selected ? "shadow-[0_0_20px_rgba(255,255,255,0.3)]" : ""
      }`}
      style={{ width: data.width, height: data.height }}
    >
      <div className="flex items-center gap-2 mb-2">
        <FiFileText className="text-[#f4e79d]" />
        <div className="font-semibold text-sm text-[#f4e79d]">I'm a note</div>
      </div>
      <div className="text-xs text-[#e6d788]">
        Double click to edit me. <span className="text-[#b3d9ff]">Guide</span>
      </div>

      {/* Sticky notes don't typically have handles */}
    </div>
  );
});

StickyNoteNode.displayName = "StickyNoteNode";
