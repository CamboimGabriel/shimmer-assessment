import { ChatTriggerNode } from "./ChatTriggerNode";
import { AgentNode } from "./AgentNode";
import { OpenAIModelNode } from "./OpenAIModelNode";
import { StickyNoteNode } from "./StickyNoteNode";
import { GenericNode } from "./GenericNode";

// Re-export all components
export { ChatTriggerNode } from "./ChatTriggerNode";
export { AgentNode } from "./AgentNode";
export { OpenAIModelNode } from "./OpenAIModelNode";
export { StickyNoteNode } from "./StickyNoteNode";
export { GenericNode } from "./GenericNode";

// Node types configuration for React Flow
export const nodeTypes = {
  chatTrigger: ChatTriggerNode,
  agent: AgentNode,
  openaiModel: OpenAIModelNode,
  stickyNote: StickyNoteNode,
  generic: GenericNode,
};
