import { describe, it, expect } from 'vitest';
import { layout } from './layout';
import { sampleInstallation } from '../model/sample';
import type { CircuitNode } from '../model/types';

describe('layout()', () => {
  it('is a pure function — same input yields byte-identical output', () => {
    const a = JSON.stringify(layout(sampleInstallation));
    const b = JSON.stringify(layout(sampleInstallation));
    expect(a).toBe(b);
  });

  it('matches the snapshot for the sample installation', () => {
    expect(layout(sampleInstallation)).toMatchSnapshot();
  });

  it('reserves max(ownWidth, children band) — wide parent over narrow leaf stays centered', () => {
    // A terminal-block (w=160, fanOut) over a single narrow load (w=96):
    // the parent's own width dominates, and the child centers under it.
    const tree: CircuitNode = {
      id: 'tb',
      type: 'terminal-block',
      label: 'X1',
      children: [{ id: 'l', type: 'load', label: 'L', children: [] }],
    };
    const out = layout(tree);
    const parent = out.nodes.find((n) => n.node.id === 'tb')!;
    const child = out.nodes.find((n) => n.node.id === 'l')!;
    const parentCenter = parent.x + parent.width / 2;
    const childCenter = child.x + child.width / 2;
    expect(childCenter).toBeCloseTo(parentCenter, 6);
  });

  it('emits a shared busbar wire for fanOut:false parents with >1 child', () => {
    // main-switch is fanOut:false; give it two children → expect a bus segment.
    const tree: CircuitNode = {
      id: 'm',
      type: 'main-switch',
      label: 'HS',
      children: [
        { id: 'a', type: 'load', label: 'A', children: [] },
        { id: 'b', type: 'load', label: 'B', children: [] },
      ],
    };
    const out = layout(tree);
    expect(out.wires.some((w) => w.bus)).toBe(true);
  });

  it('does NOT emit a busbar for fanOut:true parents (distinct terminals)', () => {
    const tree: CircuitNode = {
      id: 'fi',
      type: 'rcd',
      label: 'FI',
      children: [
        { id: 'a', type: 'load', label: 'A', children: [] },
        { id: 'b', type: 'load', label: 'B', children: [] },
      ],
    };
    const out = layout(tree);
    expect(out.wires.some((w) => w.bus)).toBe(false);
  });
});
