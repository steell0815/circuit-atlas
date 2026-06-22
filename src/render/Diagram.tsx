import { forwardRef } from 'react';
import type { Layout } from '../layout/layout';
import { Symbol } from './symbols';

const WIRE = '#1a2b3c';

function metaLine(meta?: Record<string, string>): string {
  if (!meta) return '';
  return Object.values(meta).join(' · ');
}

/**
 * Assembles the full SVG from a computed Layout. Forwards a ref to the <svg>
 * element so the PDF exporter can rasterize/vectorize it directly.
 */
export const Diagram = forwardRef<SVGSVGElement, { layout: Layout }>(
  function Diagram({ layout }, ref) {
    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        width={layout.width}
        height={layout.height}
        xmlns="http://www.w3.org/2000/svg"
        fontFamily="system-ui, sans-serif"
      >
        <rect x={0} y={0} width={layout.width} height={layout.height} fill="#fff" />

        {/* Wires first, so symbols sit on top. */}
        {layout.wires.map((wire, i) => (
          <polyline
            key={`w${i}`}
            points={wire.points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke={WIRE}
            strokeWidth={wire.bus ? 3 : 1.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* Nodes. */}
        {layout.nodes.map((n) => {
          const sub = metaLine(n.node.meta);
          return (
            <g key={n.node.id} transform={`translate(${n.x}, ${n.y})`}>
              <Symbol type={n.node.type} w={n.width} h={n.height} />
              <text
                x={n.width / 2}
                y={n.height + 16}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill={WIRE}
              >
                {n.node.label}
              </text>
              {sub && (
                <text
                  x={n.width / 2}
                  y={n.height + 30}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#5a6b7c"
                >
                  {sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  },
);
