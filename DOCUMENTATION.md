# Unified Workflow Editor - Complete Documentation

## Overview

The Unified Workflow Editor is a React-based application that allows users to import workflows from various automation platforms, visualize them as interactive graphs, edit them by repositioning nodes, and export them back to their original format. The project implements a clean adapter pattern architecture that makes it extensible to support multiple workflow platforms.

## 🏗️ Architecture Overview

### Core Concepts

The application follows a layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                       UI Layer                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ ImportPanel │ │ GraphView   │ │NodeInspector│            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Canonical Schema                         │
│              (Internal Data Format)                         │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Adapter Layer                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ n8nAdapter  │ │YAMLAdapter  │ │ XMLAdapter  │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  Raw Workflow Data                          │
│           (Platform-specific formats)                       │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Separation of Concerns**: UI components only interact with canonical data, never raw platform data
2. **Pluggable Architecture**: Adapters can be easily added for new workflow platforms
3. **Type Safety**: Full TypeScript coverage with strict typing
4. **Extensible Node Types**: Custom renderers for specific node types with generic fallback
5. **Real-time Editing**: Changes are immediately reflected in the UI

## 📁 Project Structure

```
src/
├── adapters/           # Format detection and parsing
│   ├── registry.ts     # Adapter registration system
│   ├── n8nAdapter.ts   # n8n workflow parser
│   ├── yamlMakeAdapter.ts
│   └── xmlLegacyAdapter.ts
├── schema/
│   └── canonical.ts    # Internal data structure definitions
├── ui/
│   ├── ExportButton.tsx    # Export functionality
│   ├── GraphView.tsx       # Main graph visualization
│   ├── ImportPanel.tsx     # Workflow import interface
│   ├── NodeInspector.tsx   # Node details panel
│   ├── nodes/              # Custom node renderers
│   │   ├── AgentNode.tsx
│   │   ├── ChatTriggerNode.tsx
│   │   ├── GenericNode.tsx
│   │   ├── OpenAIModelNode.tsx
│   │   ├── StickyNoteNode.tsx
│   │   ├── index.ts
│   │   └── types.ts
│   └── utils/
│       ├── edgeMapping.ts  # Edge conversion utilities
│       └── nodeMapping.ts  # Node conversion utilities
├── services/
│   └── telemetry.ts    # Analytics and monitoring
├── samples/
│   └── basic-agent-n8n.json  # Example workflow
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🔄 Data Flow

### 1. Import Process

```
Raw Text Input → Format Detection → Adapter Selection → Parsing → Canonical Format → UI Rendering
```

**Detailed Steps:**

1. **User Input**: User pastes workflow text or uploads a file
2. **Format Detection**: `detectFormat()` tests each adapter's `detect()` method
3. **Adapter Selection**: Best matching adapter is selected based on confidence score
4. **Parsing**: Selected adapter converts raw data to canonical format
5. **Validation**: Parse results are checked for errors and warnings
6. **UI Update**: Canonical data is converted to React Flow format and rendered

### 2. Editing Process

```
User Interaction → React Flow Events → State Updates → Real-time UI Updates
```

**Detailed Steps:**

1. **Node Dragging**: User drags nodes in the graph
2. **Position Updates**: React Flow automatically updates node positions
3. **State Sync**: Position changes are tracked in component state
4. **Visual Feedback**: Changes are immediately visible in the UI

### 3. Export Process

```
Current UI State → Canonical Format → Adapter Serialization → Download/Output
```

**Detailed Steps:**

1. **State Collection**: Current node positions and data are gathered from React Flow
2. **Canonical Conversion**: React Flow data is converted back to canonical format
3. **Serialization**: Original adapter serializes canonical data back to platform format
4. **Output**: User can download or copy the exported workflow

## 🏛️ Core Components

### Canonical Schema (`src/schema/canonical.ts`)

The heart of the system - defines the unified data structure that all platform-specific formats are converted to:

```typescript
interface Workflow {
  id: string; // Unique workflow identifier
  name: string; // Human-readable workflow name
  nodes: Node[]; // Array of workflow nodes
  edges: Edge[]; // Array of connections between nodes
  metadata?: Record<string, any>; // Platform-specific metadata
}

interface Node {
  id: string; // Unique node identifier
  type: string; // Node type (determines rendering)
  label: string; // Display name
  ports: Port[]; // Input/output connection points
  position?: { x: number; y: number }; // Graph position
  config?: Record<string, any>; // Node configuration
  raw?: any; // Original platform data
  warnings?: string[]; // Validation warnings
}

interface Edge {
  id: string; // Unique edge identifier
  from: { nodeId: string; portId?: string }; // Source connection
  to: { nodeId: string; portId?: string }; // Target connection
}
```

### Adapter System (`src/adapters/`)

**Registry (`registry.ts`)**:

- Manages adapter registration and format detection
- `detectFormat()` tests all adapters and returns the best match
- Supports confidence scoring for format detection

**Adapter Interface**:

```typescript
interface WorkflowAdapter {
  id: string; // Unique adapter identifier
  detect(raw: string): boolean | number; // Format detection (0-1 confidence)
  parse(raw: string): ParseResult; // Raw → Canonical conversion
  serialize?(wf: Workflow): string; // Canonical → Raw conversion
}
```

**n8n Adapter Example** (`n8nAdapter.ts`):

- Detects n8n workflows by checking for specific structure markers
- Converts n8n node format to canonical nodes with proper port mapping
- Handles LangChain-specific connection types (`ai_languageModel`, etc.)
- Supports bidirectional conversion (import and export)

### Graph Visualization (`src/ui/GraphView.tsx`)

Built on React Flow with custom enhancements:

**Features**:

- Custom node type rendering system
- Drag-and-drop node repositioning
- Real-time connection visualization
- Interactive minimap and controls
- Dark theme integration

**Node Type System**:

- **Custom Types**: Specialized renderers for specific node types
- **Generic Fallback**: Default renderer for unknown node types
- **Dynamic Mapping**: Automatic type detection and appropriate renderer selection

### Custom Node Types (`src/ui/nodes/`)

**Implemented Node Types**:

1. **ChatTriggerNode**: Entry point nodes with special trigger styling
2. **AgentNode**: AI agent nodes with multiple connection ports
3. **OpenAIModelNode**: Language model nodes with compact design
4. **StickyNoteNode**: Documentation/annotation nodes
5. **GenericNode**: Fallback for all other node types

**Node Features**:

- **Custom Styling**: Each type has unique visual appearance
- **Port Configuration**: Specialized connection points based on node type
- **Size Optimization**: Different dimensions based on content needs
- **Selection Feedback**: Visual highlighting when selected

### User Interface Components

**ImportPanel** (`src/ui/ImportPanel.tsx`):

- Drag-and-drop file upload
- Text paste interface
- Real-time format detection
- Syntax validation and error display

**NodeInspector** (`src/ui/NodeInspector.tsx`):

- Detailed node information display
- Configuration parameter viewing
- Port information
- Warning and error display

**ExportButton** (`src/ui/ExportButton.tsx`):

- One-click workflow export
- Preserves all edits and position changes
- Handles format conversion errors gracefully

## 🔧 Technical Implementation Details

### State Management

The application uses React's built-in state management:

```typescript
// Main application state
const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
const [selectedNode, setSelectedNode] = useState<Node | null>(null);
const [parseErrors, setParseErrors] = useState<ParseError[]>([]);
const [parseWarnings, setParseWarnings] = useState<string[]>([]);
```

**React Flow Integration**:

- `useNodesState` and `useEdgesState` hooks manage graph state
- Automatic synchronization between canonical data and React Flow format
- Real-time updates when nodes are moved or selected

### Node Mapping System (`src/ui/utils/nodeMapping.ts`)

Converts between canonical and React Flow formats:

```typescript
function getNodeMapping(nodeType: string): NodeTypeMapping {
  // Maps canonical node types to React Flow types and dimensions
  // Examples:
  // "chatTrigger" → { type: "chatTrigger", width: 80, height: 80 }
  // "agent" → { type: "agent", width: 230, height: 80 }
  // "unknown" → { type: "default", width: 150, height: 80 }
}
```

### Error Handling

**Multi-layered Error Management**:

1. **Parse Errors**: Format-specific parsing failures
2. **Validation Warnings**: Non-critical issues with workflow structure
3. **Runtime Errors**: Unexpected errors during operation
4. **User Feedback**: Clear error messages with actionable guidance

### Styling System

**Tailwind CSS Integration**:

- Dark theme throughout the application
- Consistent color palette and spacing
- Responsive design principles
- Custom component styling with utility classes

**Color Scheme**:

- Background: `#1a1a1a` (primary dark)
- Panels: `#2a2a2a` (secondary dark)
- Borders: `#666666` (medium gray)
- Text: White and gray variations
- Accents: Blue (`#ff6d5a`) for primary actions

## 🔌 Adding New Platform Support

### Step 1: Create Adapter

```typescript
// src/adapters/newPlatformAdapter.ts
export const newPlatformAdapter: WorkflowAdapter = {
  id: "new-platform",

  detect(raw: string): boolean | number {
    // Return confidence score 0-1 or boolean
    // Check for platform-specific markers
  },

  parse(raw: string): ParseResult {
    // Convert platform format to canonical format
    // Handle errors and warnings appropriately
  },

  serialize(workflow: Workflow): string {
    // Convert canonical format back to platform format
    // Preserve all user edits and position changes
  },
};
```

### Step 2: Register Adapter

```typescript
// src/main.tsx
import { newPlatformAdapter } from "./adapters/newPlatformAdapter";
registerAdapter(newPlatformAdapter);
```

### Step 3: Add Platform-Specific Node Types (Optional)

```typescript
// src/ui/nodes/NewPlatformNode.tsx
export const NewPlatformNode = memo<NodeProps>(({ data, selected }) => {
  // Custom rendering logic for platform-specific nodes
});

// Update src/ui/nodes/index.ts
export const nodeTypes = {
  // ... existing types
  newPlatformSpecific: NewPlatformNode,
};
```

## 🧪 Testing Strategy

**Unit Tests** (Vitest):

- Adapter parsing logic
- Data conversion utilities
- Error handling scenarios

**Component Tests** (React Testing Library):

- UI component rendering
- User interaction handling
- State management

**Integration Tests**:

- Full workflow import/export cycles
- Cross-platform compatibility
- Error recovery scenarios

## 🚀 Performance Considerations

**Optimization Strategies**:

1. **Lazy Loading**: Large workflows are rendered incrementally
2. **Memoization**: React.memo prevents unnecessary re-renders
3. **Virtual Scrolling**: Efficient handling of large node lists
4. **Debounced Updates**: Position changes are batched for performance
5. **Error Boundaries**: Isolated error handling prevents cascade failures

**Memory Management**:

- Efficient cleanup of React Flow instances
- Garbage collection of unused node references
- Optimized data structures for large workflows

## 🔒 Security Considerations

**Input Validation**:

- All imported data is validated and sanitized
- JSON parsing with proper error handling
- XSS prevention in dynamic content rendering

**Data Privacy**:

- No external API calls for core functionality
- Local-only data processing
- Optional telemetry with user consent

## 🚀 Future Enhancement Opportunities

**Platform Support**:

- Zapier workflow import/export
- Microsoft Power Automate integration
- Apache Airflow DAG support
- GitHub Actions workflow support

**Advanced Features**:

- Real-time collaboration
- Version control integration
- Workflow execution simulation
- Advanced validation rules
- Custom node type creation UI
- Workflow templates and library

**Performance Improvements**:

- Canvas virtualization for very large workflows
- Background processing for complex imports
- Caching layer for frequently accessed workflows
- Progressive loading for large datasets

## 📖 Usage Examples

### Basic Import Workflow

```javascript
// 1. User pastes n8n JSON into ImportPanel
// 2. detectFormat() identifies it as n8n format
// 3. n8nAdapter.parse() converts to canonical format
// 4. GraphView renders the workflow using custom node types
// 5. User can drag nodes to reposition them
// 6. ExportButton allows saving the modified workflow
```

### Adding Custom Node Behavior

```typescript
// Example: Adding a custom Database node type
const DatabaseNode = memo<NodeProps>(({ data, selected }) => {
  const dbType = data.config?.database || "Unknown";

  return (
    <div className={`custom-db-node ${selected ? "selected" : ""}`}>
      <div className="node-header">
        <FiDatabase />
        <span>Database</span>
      </div>
      <div className="node-content">
        <span>{dbType}</span>
      </div>
      {/* Connection handles */}
    </div>
  );
});
```

This documentation provides a complete understanding of how the Unified Workflow Editor works, from high-level architecture down to implementation details. The system is designed to be extensible, maintainable, and user-friendly while handling the complexity of multiple workflow platforms through a clean adapter pattern.
