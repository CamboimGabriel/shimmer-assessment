import { WorkflowAdapter } from './registry';
import { ParseResult } from '../schema/canonical';

export const xmlLegacyAdapter: WorkflowAdapter = {
  id: 'legacy-xml',
  
  detect(raw) {
    // TODO: Detect XML format
    return false;
  },
  
  parse(raw): ParseResult {
    // TODO: Parse legacy XML workflow format
    return { errors: [{ message: 'Not implemented' }] };
  }
};