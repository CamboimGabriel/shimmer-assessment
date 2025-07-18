import React, { useState } from 'react';
import { detectFormat } from '../adapters/registry';

interface Props {
  onImport: (raw: string) => void;
}

export const ImportPanel: React.FC<Props> = ({ onImport }) => {
  const [raw, setRaw] = useState('');
  const [detected, setDetected] = useState<string | null>(null);

  const handleDetect = () => {
    const adapter = detectFormat(raw);
    setDetected(adapter ? adapter.id : 'unknown');
  };

  return (
    <div className="p-2 border-b flex flex-col gap-2">
      <textarea
        className="border p-2 text-sm h-32 font-mono"
        value={raw}
        onChange={e => setRaw(e.target.value)}
        placeholder="Paste workflow payload here..."
      />
      <div className="flex gap-2">
        <button className="px-3 py-1 border" onClick={handleDetect}>Detect</button>
        <button className="px-3 py-1 border" onClick={() => onImport(raw)}>Import</button>
        {detected && <span className="text-xs text-gray-600">Detected: {detected}</span>}
      </div>
    </div>
  );
};