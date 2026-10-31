/**
 * Pure QR SVG renderer — 100% client-side, no new dependencies.
 *
 * The `qrcode` package builds the module matrix (QRCode.create); this module
 * draws it as styled SVG so templates, eye shapes, frames and a centre logo
 * are possible without a heavy styling library.
 *
 * Scannability rules baked in (cross-verified via Exa, 2026-10-31):
 * - Quiet zone is always 4 modules on every side; frames and labels sit
 *   OUTSIDE it, never inside it.
 * - Finder patterns keep their 1:1:3:1:1 dark-light-dark structure: solid
 *   ring + solid ball, light ring untouched. Only square / rounded / circle
 *   eyes are offered — leaf / diamond shapes break the ratio off-centre.
 * - Dots body modules are circles at 84% of the cell width, but the eyes
 *   always stay solid (dotted eyes fragment the finder ratio).
 * - A centre logo forces error correction H and its knockout (logo + 1
 *   module of padding, modules fully cleared, never a translucent overlay)
 *   is clamped so it can never reach the finder patterns — even on the
 *   smallest 21x21 codes, where a 30% logo would already overlap a finder.
 * - Dark modules on a light background only; the caller warns when the
 *   luminance difference drops below QR_MIN_LUMINANCE_DIFF or when the
 *   code is inverted (light on dark), which most scanners cannot read.
 * - No gradients: a gradient stop that fades toward the background kills
 *   contrast at the edges of the code.
 */
import QRCode from 'qrcode';

export type QrModuleShape = 'square' | 'rounded' | 'dots';
export type QrEyeStyle = 'square' | 'rounded' | 'circle';
export type QrFrameStyle = 'none' | 'scan' | 'circle' | 'aperture';
export type QrECLevel = 'M' | 'Q' | 'H';

export interface QrStyle {
  moduleShape: QrModuleShape;
  eyeStyle: QrEyeStyle;
  frame: QrFrameStyle;
  moduleColor: string;
  bgColor: string;
}

export interface QrTemplate extends QrStyle {
  id: string;
  /** Style names stay English in every locale (design names, like "Classic"). */
  label: string;
}

export interface QrLogo {
  dataUrl: string;
  /** Requested width as % of the code area (excluding the quiet zone). */
  pct: number;
}

export interface QrRenderOptions extends QrStyle {
  ec: QrECLevel;
  frameText: string;
  ariaLabel: string;
  logo?: QrLogo | null;
  /** 'responsive' = width 100% (preview), 'fill' = 100%x100% (thumbnails), 'absolute' = real units (downloads). */
  sizing?: 'responsive' | 'fill' | 'absolute';
}

export interface QrSvgResult {
  svg: string;
  /** viewBox width/height in svg units (needed to rasterise PNGs). */
  vbW: number;
  vbH: number;
  /** Modules per side of the code itself (without quiet zone). */
  modules: number;
  /** Logo % actually rendered, or null when there is no logo. */
  logoPct: number | null;
  /** True when the requested logo % was clamped down to protect the finders. */
  logoClamped: boolean;
}

export const QR_QUIET_MODULES = 4;
export const QR_CELL = 10;
export const QR_LOGO_MIN_PCT = 10;
export const QR_LOGO_MAX_PCT = 30;
export const QR_LOGO_DEFAULT_PCT = 22;
/** Minimum safe luminance difference (0-100 scale) between modules and background. */
export const QR_MIN_LUMINANCE_DIFF = 40;

export const QR_TEMPLATES: QrTemplate[] = [
  {
    id: 'classic',
    label: 'Classic',
    moduleShape: 'square',
    eyeStyle: 'square',
    frame: 'none',
    moduleColor: '#0f172a',
    bgColor: '#ffffff',
  },
  {
    id: 'rounded',
    label: 'Rounded',
    moduleShape: 'rounded',
    eyeStyle: 'rounded',
    frame: 'none',
    moduleColor: '#0f172a',
    bgColor: '#ffffff',
  },
  {
    id: 'dots',
    label: 'Dots',
    moduleShape: 'dots',
    eyeStyle: 'circle',
    frame: 'none',
    moduleColor: '#0f172a',
    bgColor: '#ffffff',
  },
  {
    id: 'scan',
    label: 'Scan Me',
    moduleShape: 'rounded',
    eyeStyle: 'rounded',
    frame: 'scan',
    moduleColor: '#0f172a',
    bgColor: '#ffffff',
  },
  {
    id: 'circle',
    label: 'Circle',
    moduleShape: 'rounded',
    eyeStyle: 'circle',
    frame: 'circle',
    moduleColor: '#0f172a',
    bgColor: '#ffffff',
  },
  {
    id: 'aperture',
    label: 'Aperture',
    moduleShape: 'square',
    eyeStyle: 'circle',
    frame: 'aperture',
    moduleColor: '#0f172a',
    bgColor: '#ffffff',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    moduleShape: 'rounded',
    eyeStyle: 'rounded',
    frame: 'none',
    moduleColor: '#0b4f9c',
    bgColor: '#ffffff',
  },
  {
    id: 'rose',
    label: 'Rose',
    moduleShape: 'dots',
    eyeStyle: 'circle',
    frame: 'none',
    moduleColor: '#9d174d',
    bgColor: '#ffffff',
  },
];

/** @types/qrcode does not declare `create`, so it is typed locally. */
interface QrMatrix {
  readonly size: number;
  get: (row: number, col: number) => number;
}
interface QrCodeObject {
  readonly version: number;
  readonly modules: QrMatrix;
}
type QrCreate = (
  text: string,
  opts: { errorCorrectionLevel: string },
) => QrCodeObject;
const createQr = (QRCode as unknown as { create: QrCreate }).create;

function escAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Relative luminance (WCAG, 0-1) of a #rgb / #rrggbb hex color. */
export function hexLuminance(hex: string): number {
  let h = hex.replace('#', '');
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return 0;
  const channel = (i: number): number => {
    const s = Number.parseInt(h.slice(i, i + 2), 16) / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

/** Luminance difference on a 0-100 scale (40+ is the safe minimum). */
export function qrLuminanceDiff(fg: string, bg: string): number {
  return Math.abs(hexLuminance(fg) - hexLuminance(bg)) * 100;
}

/**
 * Largest logo % whose knockout (logo + 1 module padding per side) stays
 * clear of the finder patterns. For a 21-module code that is 19%, not 30%.
 */
export function qrLogoLimitPct(modules: number): number {
  const limit = Math.floor((100 * (modules - 17)) / modules);
  return Math.max(QR_LOGO_MIN_PCT, Math.min(QR_LOGO_MAX_PCT, limit));
}

export function buildQrSvg(
  text: string,
  opts: QrRenderOptions,
): QrSvgResult | null {
  let qr: QrCodeObject;
  try {
    qr = createQr(text, { errorCorrectionLevel: opts.ec });
  } catch {
    return null;
  }
  const n = qr.modules.size;
  const fg = escAttr(opts.moduleColor);
  const bg = escAttr(opts.bgColor);
  const Q = QR_QUIET_MODULES;
  const C = QR_CELL;
  const codePx = n * C;
  const quietPx = (n + 2 * Q) * C;

  // Logo knockout: centred square, logo + 1 module of padding per side.
  let logoPct: number | null = null;
  let logoClamped = false;
  let koStart = 0;
  let koModules = 0;
  if (opts.logo) {
    const requested = Math.max(
      QR_LOGO_MIN_PCT,
      Math.min(QR_LOGO_MAX_PCT, opts.logo.pct),
    );
    const limit = qrLogoLimitPct(n);
    logoPct = Math.min(requested, limit);
    logoClamped = logoPct < requested;
    koModules = (logoPct / 100) * n + 2;
    koStart = (n - koModules) / 2;
  }
  const inKnockout = (r: number, c: number): boolean => {
    if (!opts.logo) return false;
    const cy = r + 0.5;
    const cx = c + 0.5;
    return (
      cx >= koStart &&
      cx < koStart + koModules &&
      cy >= koStart &&
      cy < koStart + koModules
    );
  };
  const inEye = (r: number, c: number): boolean =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const isDark = (r: number, c: number): boolean => qr.modules.get(r, c) === 1;

  // Frame geometry: scan adds a band below the quiet zone; circle/aperture
  // draw a decorative ring around (never inside) the quiet zone.
  let vbW = quietPx;
  let vbH = quietPx;
  let bandH = 0;
  let ringR = 0;
  let ringWidth = 0;
  let ringDash = '';
  if (opts.frame === 'scan') {
    bandH = 4 * C;
    vbH = quietPx + bandH;
  } else if (opts.frame === 'circle') {
    ringWidth = 0.8 * C;
    ringR = (quietPx / 2) * Math.SQRT2 + 1.5 * C;
    const total = 2 * (ringR + ringWidth / 2 + 0.5 * C);
    vbW = total;
    vbH = total;
  } else if (opts.frame === 'aperture') {
    ringWidth = 2 * C;
    ringR = (quietPx / 2) * Math.SQRT2 + 2 * C;
    const circumference = 2 * Math.PI * ringR;
    ringDash = `${((circumference / 6) * 0.72).toFixed(1)} ${((circumference / 6) * 0.28).toFixed(1)}`;
    const total = 2 * (ringR + ringWidth / 2 + 0.5 * C);
    vbW = total;
    vbH = total;
  }
  // Origin offset: centres the code (quiet zone + modules) in a larger frame
  // viewBox. Scan keeps the code at the top with the band below it.
  const ox = (vbW - quietPx) / 2;
  const oy = opts.frame === 'scan' ? 0 : (vbH - quietPx) / 2;
  const X = (c: number): number => ox + (c + Q) * C;
  const Y = (r: number): number => oy + (r + Q) * C;

  const parts: string[] = [];
  parts.push(`<rect x="0" y="0" width="${vbW}" height="${vbH}" fill="${bg}"/>`);

  // Body modules (finder zones drawn separately below).
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!isDark(r, c) || inEye(r, c) || inKnockout(r, c)) continue;
      const x = X(c);
      const y = Y(r);
      if (opts.moduleShape === 'dots') {
        parts.push(
          `<circle cx="${x + C / 2}" cy="${y + C / 2}" r="${C * 0.42}" fill="${fg}"/>`,
        );
      } else if (opts.moduleShape === 'rounded') {
        parts.push(
          `<rect x="${x}" y="${y}" width="${C}" height="${C}" rx="${C * 0.3}" fill="${fg}"/>`,
        );
      } else {
        parts.push(
          `<rect x="${x}" y="${y}" width="${C}" height="${C}" fill="${fg}"/>`,
        );
      }
    }
  }

  // Finder eyes: solid concentric ring + ball, light ring untouched (1:1:3:1:1).
  const eyeOrigins: Array<[number, number]> = [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ];
  for (const [ec, er] of eyeOrigins) {
    const ex = X(ec);
    const ey = Y(er);
    if (opts.eyeStyle === 'circle') {
      const cx = ex + 3.5 * C;
      const cy = ey + 3.5 * C;
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${3.5 * C}" fill="${fg}"/>`);
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${2.5 * C}" fill="${bg}"/>`);
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${1.5 * C}" fill="${fg}"/>`);
    } else if (opts.eyeStyle === 'rounded') {
      parts.push(
        `<rect x="${ex}" y="${ey}" width="${7 * C}" height="${7 * C}" rx="${2.2 * C}" fill="${fg}"/>`,
      );
      parts.push(
        `<rect x="${ex + C}" y="${ey + C}" width="${5 * C}" height="${5 * C}" rx="${1.2 * C}" fill="${bg}"/>`,
      );
      parts.push(
        `<rect x="${ex + 2 * C}" y="${ey + 2 * C}" width="${3 * C}" height="${3 * C}" rx="${C}" fill="${fg}"/>`,
      );
    } else {
      parts.push(
        `<rect x="${ex}" y="${ey}" width="${7 * C}" height="${7 * C}" fill="${fg}"/>`,
      );
      parts.push(
        `<rect x="${ex + C}" y="${ey + C}" width="${5 * C}" height="${5 * C}" fill="${bg}"/>`,
      );
      parts.push(
        `<rect x="${ex + 2 * C}" y="${ey + 2 * C}" width="${3 * C}" height="${3 * C}" fill="${fg}"/>`,
      );
    }
  }

  // Centre logo: white knockout first, then the image clipped to a rounded rect.
  // Only one logo-bearing SVG exists per page, so this clip id is unique.
  if (opts.logo && logoPct !== null) {
    const logoPx = (logoPct / 100) * codePx;
    const koPx = koModules * C;
    const koX = ox + (Q + koStart) * C;
    const koY = oy + (Q + koStart) * C;
    const lx = ox + (Q + (n - (logoPct / 100) * n) / 2) * C;
    const ly = oy + (Q + (n - (logoPct / 100) * n) / 2) * C;
    const href = escAttr(opts.logo.dataUrl);
    parts.push(
      `<rect x="${koX}" y="${koY}" width="${koPx}" height="${koPx}" rx="${C * 0.8}" fill="#ffffff"/>`,
    );
    parts.push(
      `<clipPath id="qr-logo-clip"><rect x="${lx}" y="${ly}" width="${logoPx}" height="${logoPx}" rx="${C * 0.5}"/></clipPath>`,
    );
    parts.push(
      `<image href="${href}" xlink:href="${href}" x="${lx}" y="${ly}" width="${logoPx}" height="${logoPx}" preserveAspectRatio="xMidYMid slice" clip-path="url(#qr-logo-clip)"/>`,
    );
  }

  // Frames (always outside the quiet zone).
  if (opts.frame === 'scan') {
    const bandY = quietPx;
    parts.push(
      `<rect x="0" y="${bandY}" width="${vbW}" height="${bandH}" fill="${fg}"/>`,
    );
    parts.push(
      `<text x="${vbW / 2}" y="${bandY + bandH * 0.7}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${2.2 * C}" font-weight="700" letter-spacing="3" fill="${bg}">${escAttr(opts.frameText)}</text>`,
    );
  } else if (opts.frame === 'circle') {
    parts.push(
      `<circle cx="${vbW / 2}" cy="${vbH / 2}" r="${ringR}" fill="none" stroke="${fg}" stroke-width="${ringWidth}"/>`,
    );
  } else if (opts.frame === 'aperture') {
    parts.push(
      `<circle cx="${vbW / 2}" cy="${vbH / 2}" r="${ringR}" fill="none" stroke="${fg}" stroke-width="${ringWidth}" stroke-dasharray="${ringDash}" transform="rotate(-90 ${vbW / 2} ${vbH / 2})"/>`,
    );
  }

  const sizing = opts.sizing ?? 'responsive';
  const sizeAttrs =
    sizing === 'fill'
      ? 'width="100%" height="100%" preserveAspectRatio="xMidYMid meet"'
      : sizing === 'absolute'
        ? `width="${vbW}" height="${vbH}"`
        : 'width="100%" style="display:block;height:auto"';
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${vbW} ${vbH}" ${sizeAttrs} role="img" aria-label="${escAttr(opts.ariaLabel)}">` +
    parts.join('') +
    '</svg>';
  return { svg, vbW, vbH, modules: n, logoPct, logoClamped };
}
