import { WorkflowAdapter } from "./registry";
import { Workflow, ParseResult, Node, Edge, Port } from "../schema/canonical";

export const n8nAdapter: WorkflowAdapter = {
  id: "n8n-json",

  detect(raw) {
    try {
      if (!raw.trim().startsWith("{")) return false;
      const data = JSON.parse(raw);

      // Check for n8n-specific structure markers
      if (data.nodes && Array.isArray(data.nodes) && data.connections) {
        // Look for n8n node types (both legacy and modern formats)
        const hasN8nNodeTypes = data.nodes.some(
          (node: Node) =>
            node.type &&
            (node.type.startsWith("n8n-nodes-base.") ||
              node.type.startsWith("@n8n/") ||
              node.type.includes("n8n-nodes-"))
        );
        return hasN8nNodeTypes ? 0.9 : 0.7;
      }
      return 0.1;
    } catch {
      return false;
    }
  },

  parse(raw): ParseResult {
    try {
      const data = JSON.parse(raw);

      if (!data.nodes || !Array.isArray(data.nodes)) {
        return {
          errors: [
            { message: "Invalid n8n format: missing or invalid nodes array" },
          ],
        };
      }

      // Parse nodes
      const nodes: Node[] = data.nodes.map((n8nNode: Node) => {
        const position =
          Array.isArray(n8nNode.position) && n8nNode.position.length >= 2
            ? { x: n8nNode.position[0], y: n8nNode.position[1] }
            : { x: 0, y: 0 };

        // Create ports based on node type
        const ports: Port[] = [];

        // Add input ports (most nodes except triggers have main input)
        if (
          !n8nNode.type?.includes("trigger") &&
          !n8nNode.type?.includes("start")
        ) {
          ports.push({
            id: `${n8nNode.id}-in-main`,
            name: "main",
            direction: "in",
          });
        }

        // Add output ports (most nodes have main output)
        ports.push({
          id: `${n8nNode.id}-out-main`,
          name: "main",
          direction: "out",
        });

        // Add special ports for LangChain nodes
        if (n8nNode.type?.includes("langchain")) {
          if (n8nNode.type?.includes("lm") || n8nNode.type?.includes("model")) {
            ports.push({
              id: `${n8nNode.id}-out-ai_languageModel`,
              name: "ai_languageModel",
              direction: "out",
            });
          }
          if (n8nNode.type?.includes("agent")) {
            ports.push({
              id: `${n8nNode.id}-in-ai_languageModel`,
              name: "ai_languageModel",
              direction: "in",
            });
          }
        }

        return {
          id: n8nNode.id || n8nNode.name,
          type: n8nNode.type || "unknown",
          label: n8nNode.name || n8nNode.id || "Unnamed Node",
          ports,
          position,
          config: n8nNode.parameters || {},
          raw: n8nNode,
        };
      });

      // Parse connections to create edges
      const edges: Edge[] = [];
      let edgeCounter = 0;

      if (data.connections) {
        Object.entries(data.connections).forEach(
          ([sourceNodeName, connectionData]: [string, any]) => {
            Object.entries(connectionData).forEach(
              ([connectionType, connectionGroups]: [string, any]) => {
                if (Array.isArray(connectionGroups)) {
                  connectionGroups.forEach((connectionGroup: any[]) => {
                    if (Array.isArray(connectionGroup)) {
                      connectionGroup.forEach((connection: any) => {
                        const sourceNode = nodes.find(
                          (n) => n.label === sourceNodeName
                        );
                        const targetNode = nodes.find(
                          (n) => n.label === connection.node
                        );

                        if (sourceNode && targetNode) {
                          edges.push({
                            id: `edge-${edgeCounter++}`,
                            from: {
                              nodeId: sourceNode.id,
                              portId: `${sourceNode.id}-out-${connectionType}`,
                            },
                            to: {
                              nodeId: targetNode.id,
                              portId: `${targetNode.id}-in-${
                                connection.type || connectionType
                              }`,
                            },
                          });
                        }
                      });
                    }
                  });
                }
              }
            );
          }
        );
      }

      const workflow: Workflow = {
        id: data.id || `workflow-${Date.now()}`,
        name: data.name || "Imported n8n Workflow",
        nodes,
        edges,
        metadata: {
          source: "n8n",
          originalData: data,
        },
      };

      return { workflow };
    } catch (e: any) {
      return {
        errors: [
          {
            message: `Failed to parse n8n workflow: ${e.message}`,
          },
        ],
      };
    }
  },

  serialize(wf) {
    try {
      // Create n8n format from canonical workflow
      const n8nData = {
        name: wf.name,
        nodes: wf.nodes.map((node) => ({
          id: node.id,
          name: node.label,
          type: node.type,
          position: node.position ? [node.position.x, node.position.y] : [0, 0],
          parameters: node.config || {},
        })),
        connections: {} as any,
      };

      // Rebuild connections object
      wf.edges.forEach((edge) => {
        const sourceNode = wf.nodes.find((n) => n.id === edge.from.nodeId);
        const targetNode = wf.nodes.find((n) => n.id === edge.to.nodeId);

        if (sourceNode && targetNode) {
          const sourceNodeName = sourceNode.label;

          // Extract connection type from port ID
          const connectionType = edge.from.portId?.split("-out-")[1] || "main";
          const targetConnectionType =
            edge.to.portId?.split("-in-")[1] || connectionType;

          if (!n8nData.connections[sourceNodeName]) {
            n8nData.connections[sourceNodeName] = {};
          }

          if (!n8nData.connections[sourceNodeName][connectionType]) {
            n8nData.connections[sourceNodeName][connectionType] = [[]];
          }

          if (!n8nData.connections[sourceNodeName][connectionType][0]) {
            n8nData.connections[sourceNodeName][connectionType][0] = [];
          }

          n8nData.connections[sourceNodeName][connectionType][0].push({
            node: targetNode.label,
            type: targetConnectionType,
            index: 0,
          });
        }
      });

      return JSON.stringify(n8nData, null, 2);
    } catch (e: any) {
      throw new Error(`Failed to serialize workflow: ${e.message}`);
    }
  },
};
