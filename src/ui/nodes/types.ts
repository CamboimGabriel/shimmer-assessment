export interface NodeData {
  label: string;
  type: string;
  config?: Record<string, any>;
  raw?: any;
  width: number;
  height: number;
}

export interface NodeProps {
  data: NodeData;
  selected: boolean;
}
