import type { NodeType } from './types';

/**
 * Per-type footprint. The layout engine treats every node as an opaque box of
 * `width` x `height`; the renderer draws the type-specific symbol inside it.
 *
 * `fanOut` is the key wiring flag:
 *   - true  → each child connects to its own output terminal on this node
 *             (RCD, terminal block: distinct outgoing ways).
 *   - false → all children share a single output terminal / busbar
 *             (main switch: one common downstream rail).
 */
export interface Template {
  width: number;
  height: number;
  fanOut: boolean;
}

export const templates: Record<NodeType, Template> = {
  supply: { width: 130, height: 70, fanOut: false },
  'main-switch': { width: 120, height: 70, fanOut: false },
  rcd: { width: 140, height: 70, fanOut: true },
  breaker: { width: 96, height: 70, fanOut: false },
  'terminal-block': { width: 160, height: 70, fanOut: true },
  load: { width: 96, height: 70, fanOut: false },
};

export const template = (type: NodeType): Template => templates[type];
