import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ImportPanel } from './ui/ImportPanel';
import { registerAdapter } from './adapters/registry';
import { n8nAdapter } from './adapters/n8nAdapter';

// Register adapters
registerAdapter(n8nAdapter);
// TODO: Import and register YAML, XML, CSV adapters

const App = () => {
  // TODO: Add state management for:
  // - Current workflow
  // - Selected node
  // - Parse errors/warnings
  
  const handleImport = (raw: string) => {
    // TODO: Implement import logic
    // - Detect format
    // - Parse with appropriate adapter
    // - Handle errors
    // - Update state with workflow
    console.log('Importing...', raw.slice(0,100));
  };
  
  return (
    <div className="h-screen flex flex-col">
      <ImportPanel onImport={handleImport} />
      <div className="flex-1 flex">
        {/* TODO: Add GraphView component */}
        <div className="flex-1 bg-gray-50">Graph placeholder</div>
        
        {/* TODO: Add NodeInspector component (conditional on selected node) */}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);