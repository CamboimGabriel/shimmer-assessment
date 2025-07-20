import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ImportPanel } from "./ui/ImportPanel";
import { registerAdapter, detectFormat } from "./adapters/registry";
import { n8nAdapter } from "./adapters/n8nAdapter";
import { GraphView } from "./ui/GraphView";
import { NodeInspector } from "./ui/NodeInspector";
import { ExportButton } from "./ui/ExportButton";
import { Workflow, Node, ParseError } from "./schema/canonical";
import { ReactFlowProvider } from "reactflow";
import {
  FiRefreshCw,
  FiUpload,
  FiTrash2,
  FiLoader,
  FiEyeOff,
  FiAlertCircle,
  FiAlertTriangle,
} from "react-icons/fi";

// Register adapters
registerAdapter(n8nAdapter);
// TODO: Import and register YAML, XML, CSV adapters

const App = () => {
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [parseErrors, setParseErrors] = useState<ParseError[]>([]);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImportPanel, setShowImportPanel] = useState(true);

  const handleImport = async (raw: string) => {
    setIsLoading(true);
    setParseErrors([]);
    setParseWarnings([]);
    setSelectedNode(null);

    try {
      // Detect format
      const adapter = detectFormat(raw);

      if (!adapter) {
        setParseErrors([
          { message: "Unknown workflow format. Please check your input." },
        ]);
        setCurrentWorkflow(null);
        return;
      }

      console.log(`Detected format: ${adapter.id}`);

      // Parse with appropriate adapter
      const result = adapter.parse(raw);

      if (result.errors && result.errors.length > 0) {
        setParseErrors(result.errors);
        setCurrentWorkflow(null);
      } else if (result.workflow) {
        setCurrentWorkflow(result.workflow);
        console.log("Successfully imported workflow:", result.workflow);
        // Auto-hide import panel after successful import
        setShowImportPanel(false);
      }

      if (result.warnings && result.warnings.length > 0) {
        setParseWarnings(result.warnings);
      }
    } catch (error) {
      console.error("Import error:", error);
      setParseErrors([
        {
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred during import",
        },
      ]);
      setCurrentWorkflow(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeSelect = (nodeId: string | null) => {
    if (nodeId && currentWorkflow) {
      const node = currentWorkflow.nodes.find((n) => n.id === nodeId);
      setSelectedNode(node || null);
    } else {
      setSelectedNode(null);
    }
  };

  const handleCloseInspector = () => {
    setSelectedNode(null);
  };

  const toggleImportPanel = () => {
    setShowImportPanel(!showImportPanel);
  };

  const clearWorkflow = () => {
    setCurrentWorkflow(null);
    setSelectedNode(null);
    setParseErrors([]);
    setParseWarnings([]);
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-[#1a1a1a]">
        {/* Header */}
        <div className="bg-[#2a2a2a] border-b border-[#666666] shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <FiRefreshCw className="text-blue-400" />
                Unified Workflow Editor
              </h1>
              {currentWorkflow && (
                <div className="flex items-center gap-2 text-sm text-gray-300 bg-[#3a3a3a] px-3 py-1 rounded-full">
                  <span className="font-medium text-white">
                    {currentWorkflow.name}
                  </span>
                  <span className="text-[#666666]">•</span>
                  <span>{currentWorkflow.nodes.length} nodes</span>
                  <span className="text-[#666666]">•</span>
                  <span>{currentWorkflow.edges.length} connections</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleImportPanel}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  showImportPanel
                    ? "bg-[#4a4a4a] text-gray-200 hover:bg-[#5a5a5a]"
                    : "bg-[#ff6d5a] text-white hover:bg-[#e55a47]"
                }`}
              >
                {showImportPanel ? (
                  <>
                    <FiEyeOff />
                    Hide Import
                  </>
                ) : (
                  <>
                    <FiUpload />
                    Import Workflow
                  </>
                )}
              </button>
              {currentWorkflow && (
                <>
                  <ExportButton originalWorkflow={currentWorkflow} />
                  <button
                    onClick={clearWorkflow}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <FiTrash2 />
                    Clear
                  </button>
                </>
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <FiLoader className="animate-spin" />
                  Loading...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Import Panel */}
        {showImportPanel && (
          <div className="bg-[#2a2a2a] border-b border-[#666666] shadow-sm">
            <ImportPanel onImport={handleImport} />
          </div>
        )}

        {/* Error and Warning Display */}
        {(parseErrors.length > 0 || parseWarnings.length > 0) && (
          <div className="bg-red-900/20 border-b border-red-800/50 p-4">
            {parseErrors.map((error, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-red-300 text-sm mb-2"
              >
                <FiAlertCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Error:</strong> {error.message}
                  {error.line && (
                    <span className="text-xs ml-2 bg-red-800/50 px-2 py-1 rounded">
                      Line {error.line}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {parseWarnings.map((warning, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-orange-300 text-sm mb-2"
              >
                <FiAlertTriangle className="text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Warning:</strong> {warning}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex min-h-0">
          <GraphView
            workflow={currentWorkflow}
            onNodeSelect={handleNodeSelect}
          />
          {selectedNode && (
            <NodeInspector node={selectedNode} onClose={handleCloseInspector} />
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
