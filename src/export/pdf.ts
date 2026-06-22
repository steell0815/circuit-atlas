import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

/**
 * Fit-to-page A4 (landscape) vector PDF. svg2pdf.js walks the live SVG DOM and
 * emits real PDF vector ops (no rasterization), so the export stays crisp.
 */
export async function exportPdf(svg: SVGSVGElement, filename = 'circuit-atlas.pdf') {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 10;

  const vbW = svg.viewBox.baseVal.width || svg.clientWidth;
  const vbH = svg.viewBox.baseVal.height || svg.clientHeight;

  const scale = Math.min((pageW - 2 * margin) / vbW, (pageH - 2 * margin) / vbH);
  const w = vbW * scale;
  const h = vbH * scale;
  const x = (pageW - w) / 2;
  const y = (pageH - h) / 2;

  await pdf.svg(svg, { x, y, width: w, height: h });
  pdf.save(filename);
}
