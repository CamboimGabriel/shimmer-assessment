# Weekend Trial Task Spec: Unified Workflow Editor

## 1. One-Paragraph Context

We're building a Unified Workflow Editor that can ingest automation workflow payloads from various platforms, parse through pluggable adapters, normalize into a canonical internal schema, provide an interactive graph visualization with editing capabilities, and export back. While we provide n8n as an example, you're free to choose any workflow automation platform (n8n, Make/Integromat, Zapier, Node-RED, Apache Airflow, etc.) as your primary format. This project tests your ability to design clean abstractions, work with unfamiliar data formats, and build an interactive UI.

## 2. Core Functional Requirements

### Must Have
- **Import workflow**: Paste workflow text from your chosen platform
- **Parse to canonical format**: Convert to internal schema
- **Display as graph**: Show nodes and connections using React Flow
- **Drag nodes**: Move nodes around and update their positions
- **Export**: Export the modified workflow back to original format

### Nice to Have
- **Multiple platform support**: Handle workflows from different platforms
- **Node inspector**: Click a node to see its details
- **Error display**: Show parse errors when format is invalid
- **Format detection**: Auto-detect which platform the workflow is from

## 3. Canonical Schema

The canonical schema is provided in `src/schema/canonical.ts`. Key concepts:
- **Workflow**: Container with nodes and edges
- **Node**: Has type, label, ports, position, config, and optional warnings
- **Edge**: Connects nodes via ports
- **Port**: Input or output connection point
- **ParseResult**: Contains workflow or errors/warnings

## 4. Adapter Pattern

Adapters implement format detection and parsing. The interface is in `src/adapters/registry.ts`:
- `detect()`: Returns confidence score (0-1) or boolean
- `parse()`: Converts raw text to canonical format
- `serialize()`: Optional - converts back to original format

The registry system is already implemented.

## 5. Key User Flows

1. **Basic flow**: Paste workflow → see it as a graph → drag nodes → export → verify positions saved
2. **Error handling**: Import invalid data → see helpful error message
3. **Platform choice**: Support at least one workflow platform thoroughly

Focus on making these core flows work well for your chosen platform.

## 6. Architecture Guidelines

Organize your code with clear separation:
- **Adapters**: Pure logic, no React imports
- **Graph components**: React Flow visualization with generic nodes
- **UI components**: Inspector, layout, etc.
- **Services**: Utilities, validation, telemetry
- **Tests**: Unit and integration tests

Key principles:
- UI layer only accesses data through adapter outputs, never raw text
- Use generic node rendering - don't implement specific node types
- All nodes can look the same, just display different labels/properties

## 7. Tech Constraints & Libraries

- **Core**: TypeScript, React, Vite
- **Graph visualization**: React Flow (unless strong justification for alternative)
- **Styling**: Tailwind CSS (preferred)
- **Testing**: Vitest (unit/logic) + React Testing Library (component smoke tests)
- **State management**: React Context/local state (no Redux/MobX unless justified)
- **Code quality**: ESLint + Prettier + strict TypeScript
- **Dependencies**: Keep lean, avoid heavyweight libraries

## 8. Suggested Milestones

| Milestone | Goal |
|-----------|------|
| M1: Setup | Get the starter code running locally |
| M2: Format Detection | Implement detection logic for each format |
| M3: Basic Parsing | Parse n8n JSON into canonical format |
| M4: Graph Display | Show workflow as interactive graph |
| M5: Node Interaction | Drag nodes and update positions |
| M6: Export | Export modified workflow back to JSON |
| M7: Polish | Error handling and basic documentation |

## 9. Starter Code

The starter repository at https://github.com/ShimmerAI/shimmer-assessment provides:
- Basic project setup (Vite, TypeScript, React, Tailwind)
- Canonical schema definitions
- Adapter registration system
- Minimal UI scaffold
- Sample workflow file

### Research & Reference

A sample n8n workflow is provided, but for deeper understanding of the formats:
- Research workflow structures through documentation
- Use your professional judgment to find appropriate references
- Demonstrate your ability to work with unfamiliar data formats

**Important Note on Node Types**: You are NOT expected to implement specific node types. Use generic node rendering that displays the node's type, label, and basic properties. For example, all nodes can be rendered the same way visually, just showing different labels and metadata.

## What You Need to Build

1. **Choose a workflow platform** - Pick any automation platform (n8n, Make, Zapier, etc.)
2. **Implement adapter** - Parse workflows from your chosen platform into the canonical format
3. **Generic graph display** - Use React Flow with generic nodes (all nodes can look the same)
4. **Drag functionality** - Update node positions when dragged
5. **Export** - Save the modified workflow back to original format

Important: Use generic node rendering. Don't try to implement specific node types - just show node type/label/properties in a consistent way.

Optional enhancements:
- Support multiple platforms
- Format auto-detection
- Node inspector for details
- Error handling

## 10. Deliverables Checklist

### Required
- [ ] Working app that runs locally
- [ ] Import workflows from your chosen platform
- [ ] Display workflow as interactive graph
- [ ] Drag nodes to reposition them
- [ ] Export modified workflow back to original format
- [ ] Document which platform you chose and why

### Bonus Points
- [ ] Support multiple workflow platforms
- [ ] Auto-detect workflow format
- [ ] Node inspector (click for details)
- [ ] Clean, extensible architecture

## 11. Documentation

Keep it simple - just include:
- How to run the app
- Brief explanation of your approach
- Any important decisions you made

## 12. Submission Instructions

Since this is a public repository:

1. **Fork** this repository to your own GitHub account
2. Complete the implementation in your fork
3. **Do not** submit a pull request to the original repo
4. Share your fork's URL when submitting your work
5. Make sure your repository is public so we can review it

Alternative: You can also clone the repo and host your solution in a new private repository, then invite us as collaborators.