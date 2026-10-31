import QRCode from 'qrcode';
import { describe, expect, it } from 'vitest';
import {
  buildQrSvg,
  QR_CELL,
  QR_QUIET_MODULES,
  QR_TEMPLATES,
  qrLogoLimitPct,
  qrLuminanceDiff,
} from './qrRender';

/** Same local cast as qrRender.ts (@types/qrcode omits `create`). */
interface QrMatrix {
  readonly size: number;
  get: (row: number, col: number) => number;
}
type QrCreate = (
  text: string,
  opts: { errorCorrectionLevel: string },
) => { modules: QrMatrix };
const createQr = (QRCode as unknown as { create: QrCreate }).create;

const SAMPLE = 'https://dusrel.com';

function count(svg: string, tag: string): number {
  return svg.split(tag).length - 1;
}

/** Unwrap a nullable build result, failing the test with a clear message. */
function must<T>(value: T | null | undefined): T {
  if (value === null || value === undefined)
    throw new Error('unexpected null result');
  return value;
}

/** Dark modules excluding the three 7x7 finder zones (what the body loop draws). */
function darkBodyCount(text: string, ec: string): number {
  const qr = createQr(text, { errorCorrectionLevel: ec });
  const n = qr.modules.size;
  let total = 0;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const inEye =
        (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
      if (!inEye && qr.modules.get(r, c) === 1) total++;
    }
  }
  return total;
}

describe('buildQrSvg', () => {
  it('classic square: viewBox fits the code + quiet zone, body rects match the matrix', () => {
    const result = must(
      buildQrSvg(SAMPLE, {
        moduleShape: 'square',
        eyeStyle: 'square',
        frame: 'none',
        moduleColor: '#0f172a',
        bgColor: '#ffffff',
        ec: 'M',
        frameText: 'SCAN ME',
        ariaLabel: 'QR code',
      }),
    );
    expect(result).not.toBeNull();
    const expectedModules = createQr(SAMPLE, { errorCorrectionLevel: 'M' })
      .modules.size;
    expect(result.modules).toBe(expectedModules);
    expect(result.vbW).toBe((expectedModules + 2 * QR_QUIET_MODULES) * QR_CELL);
    expect(result.vbH).toBe(result.vbW);
    // 1 background rect + 9 eye rects + one rect per dark body module.
    expect(count(result.svg, '<rect')).toBe(1 + 9 + darkBodyCount(SAMPLE, 'M'));
  });

  it('dots: one circle per dark body module plus 9 solid eye circles', () => {
    const result = must(
      buildQrSvg(SAMPLE, {
        moduleShape: 'dots',
        eyeStyle: 'circle',
        frame: 'none',
        moduleColor: '#0f172a',
        bgColor: '#ffffff',
        ec: 'M',
        frameText: 'SCAN ME',
        ariaLabel: 'QR code',
      }),
    );
    expect(result).not.toBeNull();
    expect(count(result.svg, '<circle')).toBe(9 + darkBodyCount(SAMPLE, 'M'));
  });

  it('rounded: body modules carry a corner radius', () => {
    const result = must(
      buildQrSvg(SAMPLE, {
        moduleShape: 'rounded',
        eyeStyle: 'rounded',
        frame: 'none',
        moduleColor: '#0f172a',
        bgColor: '#ffffff',
        ec: 'M',
        frameText: 'SCAN ME',
        ariaLabel: 'QR code',
      }),
    );
    expect(result.svg).toContain(`rx="${QR_CELL * 0.3}"`);
  });

  it('logo: knockout clears modules and the image is embedded', () => {
    const plain = must(
      buildQrSvg(SAMPLE, {
        moduleShape: 'square',
        eyeStyle: 'square',
        frame: 'none',
        moduleColor: '#0f172a',
        bgColor: '#ffffff',
        ec: 'H',
        frameText: 'SCAN ME',
        ariaLabel: 'QR code',
      }),
    );
    const withLogo = must(
      buildQrSvg(SAMPLE, {
        moduleShape: 'square',
        eyeStyle: 'square',
        frame: 'none',
        moduleColor: '#0f172a',
        bgColor: '#ffffff',
        ec: 'H',
        frameText: 'SCAN ME',
        ariaLabel: 'QR code',
        logo: { dataUrl: 'data:image/png;base64,AAAA', pct: 22 },
      }),
    );
    expect(withLogo).not.toBeNull();
    expect(withLogo.logoPct).toBe(22);
    expect(withLogo.logoClamped).toBe(false);
    expect(withLogo.svg).toContain('<image');
    // Knockout rect + clip rect add 2 rects, but cleared modules remove more.
    expect(count(withLogo.svg, '<rect')).toBeLessThan(
      count(plain.svg, '<rect'),
    );
  });

  it('logo: a 30% logo on a 21-module code is clamped to 19% so finders survive', () => {
    const result = must(
      buildQrSvg('Hi', {
        moduleShape: 'square',
        eyeStyle: 'square',
        frame: 'none',
        moduleColor: '#0f172a',
        bgColor: '#ffffff',
        ec: 'M',
        frameText: 'SCAN ME',
        ariaLabel: 'QR code',
        logo: { dataUrl: 'data:image/png;base64,AAAA', pct: 30 },
      }),
    );
    expect(result.modules).toBe(21);
    expect(result.logoPct).toBe(19);
    expect(result.logoClamped).toBe(true);
  });

  it('scan frame: band sits below the quiet zone and carries the label', () => {
    const result = must(
      buildQrSvg(SAMPLE, {
        moduleShape: 'rounded',
        eyeStyle: 'rounded',
        frame: 'scan',
        moduleColor: '#0f172a',
        bgColor: '#ffffff',
        ec: 'M',
        frameText: 'SCAN ME',
        ariaLabel: 'QR code',
      }),
    );
    expect(result.vbH).toBe(result.vbW + 4 * QR_CELL);
    expect(result.svg).toContain('SCAN ME');
  });

  it('circle frame: viewBox grows around the code and a ring is drawn', () => {
    const result = must(
      buildQrSvg(SAMPLE, {
        moduleShape: 'rounded',
        eyeStyle: 'circle',
        frame: 'circle',
        moduleColor: '#0f172a',
        bgColor: '#ffffff',
        ec: 'M',
        frameText: 'SCAN ME',
        ariaLabel: 'QR code',
      }),
    );
    expect(result.vbW).toBeGreaterThan(
      (result.modules + 2 * QR_QUIET_MODULES) * QR_CELL,
    );
    expect(result.svg).toContain('stroke-width');
  });

  it('aperture frame: dashed ring is drawn', () => {
    const result = must(
      buildQrSvg(SAMPLE, {
        moduleShape: 'square',
        eyeStyle: 'circle',
        frame: 'aperture',
        moduleColor: '#0f172a',
        bgColor: '#ffffff',
        ec: 'M',
        frameText: 'SCAN ME',
        ariaLabel: 'QR code',
      }),
    );
    expect(result.svg).toContain('stroke-dasharray');
  });

  it('every template builds a valid SVG', () => {
    for (const tpl of QR_TEMPLATES) {
      const result = must(
        buildQrSvg(SAMPLE, {
          ...tpl,
          ec: 'M',
          frameText: 'SCAN ME',
          ariaLabel: 'QR code',
        }),
      );
      expect(result, tpl.id).not.toBeNull();
      expect(result.svg.startsWith('<svg')).toBe(true);
    }
  });

  it('over-capacity text returns null instead of throwing', () => {
    const result = buildQrSvg('A'.repeat(4000), {
      moduleShape: 'square',
      eyeStyle: 'square',
      frame: 'none',
      moduleColor: '#0f172a',
      bgColor: '#ffffff',
      ec: 'H',
      frameText: 'SCAN ME',
      ariaLabel: 'QR code',
    });
    expect(result).toBeNull();
  });
});

describe('qrLuminanceDiff', () => {
  it('dark on white passes, light grey on white fails the 40-point rule', () => {
    expect(qrLuminanceDiff('#0f172a', '#ffffff')).toBeGreaterThan(40);
    expect(qrLuminanceDiff('#e2e8f0', '#ffffff')).toBeLessThan(40);
  });
});

describe('qrLogoLimitPct', () => {
  it('clamps small codes, caps at 30% for larger ones', () => {
    expect(qrLogoLimitPct(21)).toBe(19);
    expect(qrLogoLimitPct(25)).toBe(30);
    expect(qrLogoLimitPct(29)).toBe(30);
    expect(qrLogoLimitPct(41)).toBe(30);
  });
});
