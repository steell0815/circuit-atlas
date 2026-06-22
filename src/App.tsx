import { useMemo, useRef, useState } from 'react';
import { sampleInstallation } from './model/sample';
import { layout } from './layout/layout';
import { Diagram } from './render/Diagram';
import { exportPdf } from './export/pdf';

export default function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [busy, setBusy] = useState(false);

  const computed = useMemo(() => layout(sampleInstallation), []);

  async function onExport() {
    if (!svgRef.current) return;
    setBusy(true);
    try {
      await exportPdf(svgRef.current);
    } catch (err) {
      console.error(err);
      alert('PDF-Export fehlgeschlagen — siehe Konsole.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app">
      <header className="toolbar">
        <h1>Circuit Atlas</h1>
        <span className="subtitle">Render slice — Stromlaufplan aus Datenmodell</span>
        <button onClick={onExport} disabled={busy}>
          {busy ? 'Exportiere…' : 'PDF exportieren'}
        </button>
      </header>
      <main className="canvas">
        <Diagram ref={svgRef} layout={computed} />
      </main>
    </div>
  );
}
