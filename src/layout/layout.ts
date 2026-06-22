import type { CircuitNode } from '../model/types';
import { template } from '../model/templates';

/** Horizontal gap between sibling subtrees. */
const HGAP = 44;
/** Vertical gap between a parent row and the routing bus / child row. */
const VGAP = 70;
/** Outer padding around the whole drawing. */
const PADDING = 32;

export interface Point {
  x: number;
  y: number;
}

export interface PlacedNode {
  node: CircuitNode;
  /** Top-left corner of the footprint box. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Wire {
  /** Polyline in diagram coordinates. */
  points: Point[];
  /** A shared busbar segment (drawn slightly heavier). */
  bus?: boolean;
}

export interface Layout {
  nodes: PlacedNode[];
  wires: Wire[];
  width: number;
  height: number;
}

interface Sized {
  node: CircuitNode;
  /** Reserved horizontal band: max(ownWidth, packed children width). */
  subtreeWidth: number;
  own: { width: number; height: number };
  children: Sized[];
}

/** Bottom-up pass: reserve a horizontal band for every subtree. */
function measure(node: CircuitNode): Sized {
  const t = template(node.type);
  const children = node.children.map(measure);
  const childrenWidth =
    children.reduce((sum, c) => sum + c.subtreeWidth, 0) +
    Math.max(0, children.length - 1) * HGAP;
  return {
    node,
    own: { width: t.width, height: t.height },
    subtreeWidth: Math.max(t.width, childrenWidth),
    children,
  };
}

/** Top-down pass: assign absolute positions; center each parent over its band. */
function place(
  sized: Sized,
  bandLeft: number,
  top: number,
  out: PlacedNode[],
): PlacedNode {
  const centerX = bandLeft + sized.subtreeWidth / 2;
  const placed: PlacedNode = {
    node: sized.node,
    x: centerX - sized.own.width / 2,
    y: top,
    width: sized.own.width,
    height: sized.own.height,
  };
  out.push(placed);

  if (sized.children.length > 0) {
    const childTop = top + sized.own.height + VGAP;
    const childrenWidth =
      sized.children.reduce((sum, c) => sum + c.subtreeWidth, 0) +
      (sized.children.length - 1) * HGAP;
    // Center the child group within this node's band.
    let cursor = bandLeft + (sized.subtreeWidth - childrenWidth) / 2;
    for (const child of sized.children) {
      place(child, cursor, childTop, out);
      cursor += child.subtreeWidth + HGAP;
    }
  }
  return placed;
}

const centerX = (n: PlacedNode) => n.x + n.width / 2;

/** Orthogonal routing: down → across a mid-level bus → down into each child. */
function route(node: PlacedNode, children: PlacedNode[]): Wire[] {
  if (children.length === 0) return [];

  const fanOut = template(node.node.type).fanOut;
  const parentBottom = node.y + node.height;
  const childTop = children[0].y; // all siblings share a row
  const busY = (parentBottom + childTop) / 2;
  const wires: Wire[] = [];

  if (fanOut) {
    // Distinct output terminal per child, spaced along the node's bottom edge.
    children.forEach((child, i) => {
      const termX = node.x + (node.width * (i + 0.5)) / children.length;
      const cx = centerX(child);
      wires.push({
        points: [
          { x: termX, y: parentBottom },
          { x: termX, y: busY },
          { x: cx, y: busY },
          { x: cx, y: child.y },
        ],
      });
    });
  } else {
    // Single shared terminal feeding a common busbar.
    const px = centerX(node);
    wires.push({ points: [{ x: px, y: parentBottom }, { x: px, y: busY }] });
    if (children.length > 1) {
      const xs = children.map(centerX);
      wires.push({
        bus: true,
        points: [
          { x: Math.min(px, ...xs), y: busY },
          { x: Math.max(px, ...xs), y: busY },
        ],
      });
    }
    for (const child of children) {
      const cx = centerX(child);
      wires.push({ points: [{ x: cx, y: busY }, { x: cx, y: child.y }] });
    }
  }
  return wires;
}

/** Pure: model tree → fully positioned diagram. */
export function layout(root: CircuitNode): Layout {
  const sized = measure(root);
  const placed: PlacedNode[] = [];
  place(sized, 0, 0, placed);

  const byId = new Map(placed.map((p) => [p.node.id, p]));
  const wires: Wire[] = [];
  for (const p of placed) {
    if (p.node.children.length > 0) {
      const kids = p.node.children
        .map((c) => byId.get(c.id))
        .filter((c): c is PlacedNode => c !== undefined);
      wires.push(...route(p, kids));
    }
  }

  const maxX = Math.max(...placed.map((p) => p.x + p.width));
  const maxY = Math.max(...placed.map((p) => p.y + p.height));

  // Shift everything by PADDING.
  for (const p of placed) {
    p.x += PADDING;
    p.y += PADDING;
  }
  for (const w of wires) {
    for (const pt of w.points) {
      pt.x += PADDING;
      pt.y += PADDING;
    }
  }

  return {
    nodes: placed,
    wires,
    width: maxX + PADDING * 2,
    height: maxY + PADDING * 2,
  };
}
