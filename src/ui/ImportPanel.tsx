import React, { useState, useRef } from "react";
import { detectFormat } from "../adapters/registry";
import {
  FiFolder,
  FiTarget,
  FiUpload,
  FiSearch,
  FiZap,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

interface Props {
  onImport: (raw: string) => void;
}

export const ImportPanel: React.FC<Props> = ({ onImport }) => {
  const [raw, setRaw] = useState("");
  const [detected, setDetected] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDetect = () => {
    const adapter = detectFormat(raw);
    setDetected(adapter ? adapter.id : "unknown");
  };

  const handleImport = () => {
    if (raw.trim()) {
      onImport(raw);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setRaw(content);
        const adapter = detectFormat(content);
        setDetected(adapter ? adapter.id : "unknown");
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setRaw(content);
        const adapter = detectFormat(content);
        setDetected(adapter ? adapter.id : "unknown");
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const loadSample = async () => {
    try {
      const response = await fetch("/src/samples/basic-agent-n8n.json");
      const sampleData = await response.text();
      setRaw(sampleData);
      const adapter = detectFormat(sampleData);
      setDetected(adapter ? adapter.id : "unknown");
    } catch (error) {
      console.error("Failed to load sample:", error);
    }
  };

  const clearInput = () => {
    setRaw("");
    setDetected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-200 mb-2">
            Import Workflow
          </h2>
          <p className="text-sm text-gray-400">
            Paste your workflow JSON below, upload a file, or load a sample to
            get started.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Upload Methods */}
          <div className="lg:col-span-1 space-y-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 hover:bg-gray-700/50 transition-colors text-sm font-medium text-gray-300 hover:text-blue-400 flex items-center justify-center gap-2"
            >
              <FiFolder />
              Choose File
            </button>

            <button
              onClick={loadSample}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium text-gray-300 flex items-center justify-center gap-2"
            >
              <FiTarget />
              Load Sample
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Textarea */}
          <div className="lg:col-span-2">
            <div
              className={`relative ${
                dragOver ? "ring-2 ring-blue-500 ring-opacity-50" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <textarea
                className="w-full border-2 border-gray-600 bg-gray-700 text-gray-200 rounded-lg p-4 text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 transition-colors resize-none placeholder-gray-400"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                placeholder="Paste your workflow JSON here, or drag and drop a .json file..."
                rows={8}
              />
              {dragOver && (
                <div className="absolute inset-0 bg-blue-900/20 bg-opacity-90 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center">
                  <div className="text-blue-400 font-medium flex items-center gap-2">
                    <FiUpload />
                    Drop your JSON file here
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDetect}
              disabled={!raw.trim()}
              className="px-4 py-2 border border-gray-600 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FiSearch />
              Detect Format
            </button>

            <button
              onClick={handleImport}
              disabled={!raw.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FiZap />
              Import
            </button>

            {raw.trim() && (
              <button
                onClick={clearInput}
                className="px-4 py-2 text-gray-400 hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <FiTrash2 />
                Clear
              </button>
            )}
          </div>

          {/* Detection Result */}
          {detected && (
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                  detected === "unknown"
                    ? "bg-red-900/30 text-red-400 border border-red-800/50"
                    : "bg-green-900/30 text-green-400 border border-green-800/50"
                }`}
              >
                {detected === "unknown" ? (
                  <>
                    <FiXCircle />
                    Unknown Format
                  </>
                ) : (
                  <>
                    <FiCheckCircle />
                    Detected: {detected}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Character count */}
        {raw && (
          <div className="mt-2 text-xs text-gray-500 text-right">
            {raw.length.toLocaleString()} characters
          </div>
        )}
      </div>
    </div>
  );
};
