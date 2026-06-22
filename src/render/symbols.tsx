import type { NodeType } from '../model/types';

/**
 * Schematic (not yet DIN EN 60617-grade) symbols. Each symbol draws inside a
 * local box of `w` x `h` with origin at top-left; the Diagram positions it.
 */
interface SymbolProps {
  w: number;
  h: number;
}

const stroke = '#1a2b3c';

function Frame({ w, h }: SymbolProps) {
  return (
    <rect
      x={0}
      y={0}
      width={w}
      height={h}
      rx={6}
      fill="#fff"
      stroke={stroke}
      strokeWidth={1.5}
    />
  );
}

function Supply({ w, h }: SymbolProps) {
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 12;
  return (
    <>
      <Frame w={w} h={h} />
      <circle cx={w / 2} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth={1.5} />
      <path
        d={`M ${w / 2 - r * 0.6} ${cy} q ${r * 0.3} ${-r * 0.5} ${r * 0.6} 0 q ${r * 0.3} ${r * 0.5} ${r * 0.6} 0`}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
      />
    </>
  );
}

function MainSwitch({ w, h }: SymbolProps) {
  const cy = h / 2;
  return (
    <>
      <Frame w={w} h={h} />
      <line x1={w * 0.3} y1={cy} x2={w * 0.45} y2={cy} stroke={stroke} strokeWidth={2} />
      <line x1={w * 0.45} y1={cy} x2={w * 0.66} y2={cy - 14} stroke={stroke} strokeWidth={2} />
      <line x1={w * 0.66} y1={cy} x2={w * 0.7} y2={cy} stroke={stroke} strokeWidth={2} />
      <circle cx={w * 0.45} cy={cy} r={2.5} fill={stroke} />
      <circle cx={w * 0.66} cy={cy} r={2.5} fill={stroke} />
    </>
  );
}

function Rcd({ w, h }: SymbolProps) {
  const cy = h / 2;
  return (
    <>
      <Frame w={w} h={h} />
      {/* two-pole switch hint */}
      <line x1={w * 0.28} y1={cy} x2={w * 0.4} y2={cy - 12} stroke={stroke} strokeWidth={2} />
      <line x1={w * 0.52} y1={cy} x2={w * 0.64} y2={cy - 12} stroke={stroke} strokeWidth={2} />
      <circle cx={w * 0.28} cy={cy} r={2.5} fill={stroke} />
      <circle cx={w * 0.52} cy={cy} r={2.5} fill={stroke} />
      <rect x={w * 0.72} y={cy - 10} width={20} height={20} fill="none" stroke={stroke} strokeWidth={1.5} />
      <text x={w * 0.72 + 10} y={cy + 4} textAnchor="middle" fontSize={9} fill={stroke}>
        Δ
      </text>
    </>
  );
}

function Breaker({ w, h }: SymbolProps) {
  const cy = h / 2;
  return (
    <>
      <Frame w={w} h={h} />
      <line x1={w * 0.35} y1={cy} x2={w * 0.5} y2={cy - 14} stroke={stroke} strokeWidth={2} />
      <circle cx={w * 0.35} cy={cy} r={2.5} fill={stroke} />
      <rect x={w * 0.55} y={cy - 8} width={16} height={16} fill="none" stroke={stroke} strokeWidth={1.5} />
    </>
  );
}

function TerminalBlock({ w, h }: SymbolProps) {
  const cy = h / 2;
  const n = 5;
  const slot = w / (n + 1);
  return (
    <>
      <Frame w={w} h={h} />
      {Array.from({ length: n }, (_, i) => (
        <circle
          key={i}
          cx={slot * (i + 1)}
          cy={cy}
          r={4}
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
        />
      ))}
    </>
  );
}

function Load({ w, h }: SymbolProps) {
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 14;
  return (
    <>
      <Frame w={w} h={h} />
      <circle cx={w / 2} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth={1.5} />
      <line x1={w / 2 - r * 0.6} y1={cy - r * 0.6} x2={w / 2 + r * 0.6} y2={cy + r * 0.6} stroke={stroke} strokeWidth={1.5} />
      <line x1={w / 2 - r * 0.6} y1={cy + r * 0.6} x2={w / 2 + r * 0.6} y2={cy - r * 0.6} stroke={stroke} strokeWidth={1.5} />
    </>
  );
}

const symbols: Record<NodeType, (p: SymbolProps) => JSX.Element> = {
  supply: Supply,
  'main-switch': MainSwitch,
  rcd: Rcd,
  breaker: Breaker,
  'terminal-block': TerminalBlock,
  load: Load,
};

export function Symbol({ type, w, h }: { type: NodeType } & SymbolProps) {
  const C = symbols[type];
  return <C w={w} h={h} />;
}
