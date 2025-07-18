import { Workflow, ParseResult } from '../schema/canonical';

export interface WorkflowAdapter {
  id: string;
  detect(raw: string): boolean | number;
  parse(raw: string): ParseResult;
  serialize?(wf: Workflow): string;
}

const adapters: WorkflowAdapter[] = [];

export function registerAdapter(a: WorkflowAdapter) {
  adapters.push(a);
}

export function getAdapters() {
  return adapters.slice();
}

export function detectFormat(raw: string): WorkflowAdapter | null {
  let best: { adapter: WorkflowAdapter; score: number } | null = null;
  for (const a of adapters) {
    const res = a.detect(raw);
    const score = typeof res === 'number' ? res : (res ? 1 : 0);
    if (score > 0 && (!best || score > best.score)) best = { adapter: a, score };
  }
  return best?.adapter || null;
}