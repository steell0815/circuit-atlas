/**
 * Domain model — the single source of truth.
 *
 * The circuit diagram is a pure function of this tree: ports, placement and
 * wiring are all *derived* (via templates + layout), never hand-edited.
 */

export type NodeType =
  | 'supply' // Einspeisung
  | 'main-switch' // Hauptschalter
  | 'rcd' // FI / Fehlerstromschutzschalter
  | 'breaker' // Leitungsschutzschalter (LS)
  | 'terminal-block' // Klemmleiste
  | 'load'; // Verbraucher

export interface CircuitNode {
  id: string;
  type: NodeType;
  label: string;
  /** Free-form display annotations, e.g. { rating: 'B16', current: '40A' }. */
  meta?: Record<string, string>;
  children: CircuitNode[];
}
