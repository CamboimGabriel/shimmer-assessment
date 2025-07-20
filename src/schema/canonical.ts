export interface Workflow {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  metadata?: Record<string, any>;
}

export interface Node {
  id: string;
  type: string;
  label: string;
  name?: string;
  ports: Port[];
  parameters?: Record<string, any>;
  position?: { x: number; y: number };
  config?: Record<string, any>;
  raw?: any; // source fragment
  warnings?: string[];
}

export interface Port {
  id: string;
  name: string;
  direction: PortDirection;
}

export type PortDirection = "in" | "out";

export interface Edge {
  id: string;
  from: { nodeId: string; portId?: string };
  to: { nodeId: string; portId?: string };
}

export interface ParseError {
  message: string;
  line?: number;
  column?: number;
}

export interface ParseResult {
  workflow?: Workflow;
  errors?: ParseError[];
  warnings?: string[];
}
