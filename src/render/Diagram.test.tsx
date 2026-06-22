import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Diagram } from './Diagram';
import { layout } from '../layout/layout';
import { sampleInstallation } from '../model/sample';

describe('<Diagram>', () => {
  const svg = renderToStaticMarkup(
    createElement(Diagram, { layout: layout(sampleInstallation) }),
  );

  it('renders deterministic SVG markup for the sample installation', () => {
    expect(svg).toMatchSnapshot();
  });

  it('contains every node label from the model', () => {
    for (const label of [
      'Einspeisung',
      'Hauptschalter',
      'FI',
      'Klemmleiste X1',
      'Steckdosen',
      'Licht',
      'Herd',
      'Klingeltrafo',
      'Heizung',
    ]) {
      expect(svg).toContain(label);
    }
  });
});
