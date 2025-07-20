import React from "react";
import { Node } from "../schema/canonical";
import { FiX, FiArrowDown, FiArrowUp, FiAlertTriangle } from "react-icons/fi";

interface Props {
  node: Node | null;
  onClose: () => void;
}

export const NodeInspector: React.FC<Props> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="w-80 bg-[#2a2a2a] border-l border-[#666666] p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Node Inspector</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 p-1 rounded hover:bg-[#3a3a3a] transition-colors"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <div className="text-sm bg-[#3a3a3a] text-white p-2 rounded border border-[#666666]">
            {node.label}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Type
          </label>
          <div className="text-sm bg-gray-700 text-gray-200 p-2 rounded border border-gray-600">
            {node.type}
          </div>
        </div>

        {node.ports && node.ports.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Ports
            </label>
            <div className="space-y-1">
              {node.ports.map((port) => (
                <div
                  key={port.id}
                  className="text-sm bg-gray-700 text-gray-200 p-2 rounded border border-gray-600 flex justify-between items-center"
                >
                  <span>{port.name}</span>
                  <div className="flex items-center gap-1">
                    {port.direction === "in" ? (
                      <>
                        <FiArrowDown className="text-green-400" size={14} />
                        <span className="px-2 py-1 rounded text-xs bg-green-900/30 text-green-300 border border-green-800/50">
                          {port.direction}
                        </span>
                      </>
                    ) : (
                      <>
                        <FiArrowUp className="text-blue-400" size={14} />
                        <span className="px-2 py-1 rounded text-xs bg-blue-900/30 text-blue-300 border border-blue-800/50">
                          {port.direction}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {node.config && Object.keys(node.config).length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Configuration
            </label>
            <div className="text-sm bg-gray-700 text-gray-200 p-2 rounded border border-gray-600">
              <pre className="whitespace-pre-wrap text-xs">
                {JSON.stringify(node.config, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {node.warnings && node.warnings.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-orange-300 mb-1 flex items-center gap-1">
              <FiAlertTriangle size={14} />
              Warnings
            </label>
            <div className="space-y-1">
              {node.warnings.map((warning, index) => (
                <div
                  key={index}
                  className="text-sm bg-orange-900/20 text-orange-200 p-2 rounded border border-orange-800/50"
                >
                  {warning}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
