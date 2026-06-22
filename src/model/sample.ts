import type { CircuitNode } from './types';

/**
 * Hardcoded sample installation for the render slice:
 *
 *   Einspeisung 3~ 400V
 *     → Hauptschalter
 *         → FI 40A/30mA → { LS B16 → Steckdosen, LS B16 → Licht, LS B10 → Herd }
 *         → Klemmleiste X1 → { Klingeltrafo, Heizung }
 */
export const sampleInstallation: CircuitNode = {
  id: 'supply',
  type: 'supply',
  label: 'Einspeisung',
  meta: { system: '3~ 400V' },
  children: [
    {
      id: 'main',
      type: 'main-switch',
      label: 'Hauptschalter',
      meta: { rating: '63A' },
      children: [
        {
          id: 'fi1',
          type: 'rcd',
          label: 'FI',
          meta: { rating: '40A', trip: '30mA' },
          children: [
            {
              id: 'ls1',
              type: 'breaker',
              label: 'LS',
              meta: { rating: 'B16' },
              children: [
                { id: 'load1', type: 'load', label: 'Steckdosen', children: [] },
              ],
            },
            {
              id: 'ls2',
              type: 'breaker',
              label: 'LS',
              meta: { rating: 'B16' },
              children: [{ id: 'load2', type: 'load', label: 'Licht', children: [] }],
            },
            {
              id: 'ls3',
              type: 'breaker',
              label: 'LS',
              meta: { rating: 'B10' },
              children: [{ id: 'load3', type: 'load', label: 'Herd', children: [] }],
            },
          ],
        },
        {
          id: 'x1',
          type: 'terminal-block',
          label: 'Klemmleiste X1',
          children: [
            { id: 'trafo', type: 'load', label: 'Klingeltrafo', children: [] },
            { id: 'heizung', type: 'load', label: 'Heizung', children: [] },
          ],
        },
      ],
    },
  ],
};
