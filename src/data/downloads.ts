/**
 * THE single source of truth for app download pages.
 *
 * To add a download page for an app:
 *  1. Add ONE entry to `downloads` below (keyed by the app slug from src/data/apps.ts).
 *  2. npm run build — these pages appear automatically (no .astro file needed):
 *       /apps/<slug>/download                     (all platforms)
 *       /apps/<slug>/download/<platform>           (per-platform detail:
 *                                                   install steps, system
 *                                                   requirements, SEO meta)
 *     ...plus the /hi/ variants. All are in the sitemap, all are indexed.
 *
 * To add a new platform to an existing app: append one object to its
 * `platforms` array. To add a brand-new platform type (e.g. 'harmonyos'):
 * extend `PlatformSlug` + `platformMeta` below.
 *
 * Files served for download live in public/downloads/ and are referenced as
 * absolute paths, e.g. downloadUrl: '/downloads/shrinkit-chrome-1.0.0.zip'.
 */

export type Lang = 'en' | 'hi';

export type PlatformSlug =
  | 'windows'
  | 'macos'
  | 'linux'
  | 'android'
  | 'ios'
  | 'chrome';

/** Every user-facing string carries both locales — no i18n file edits needed. */
export interface LText {
  en: string;
  hi: string;
}

export interface InstallStep {
  title: LText;
  body: LText;
}

export interface PlatformDownload {
  platform: PlatformSlug;
  /** e.g. '1.0.0' */
  version: string;
  /** e.g. '18.4 MB' */
  fileSize: string;
  /** ISO date of this build, e.g. '2026-10-20' */
  updated: string;
  /** e.g. 'ShrinkIt-1.0.0-setup.exe' (used as the download attribute) */
  fileName: string;
  /** Absolute https URL or /downloads/... path */
  downloadUrl: string;
  /** One-line OS line, e.g. 'Windows 10 (64-bit) or later' */
  os: LText;
  /** System-requirement bullets */
  requirements: LText[];
  /** Numbered install guide */
  steps: InstallStep[];
  /** Extra callouts (store links, beta notes, …) */
  notes: LText[];
}

export interface AppDownloadPage {
  /** Must match a slug in src/data/apps.ts */
  slug: string;
  tagline: LText;
  platforms: PlatformDownload[];
}

const t = (en: string, hi: string): LText => ({ en, hi });

export const downloads: AppDownloadPage[] = [
  {
    slug: 'shrinkit',
    tagline: t(
      'Get ShrinkIt on your device — free, private, no signup.',
      'ShrinkIt अपने डिवाइस पर पाएं — मुफ्त, प्राइवेट, कोई साइनअप नहीं।',
    ),
    platforms: [
      {
        platform: 'chrome',
        version: '1.0.0',
        fileSize: '407 KB',
        updated: '2026-10-20',
        fileName: 'shrinkit-chrome-1.0.0.zip',
        downloadUrl: '/downloads/shrinkit-chrome-1.0.0.zip',
        os: t(
          'Chrome, Edge or Brave (Manifest V3 supported)',
          'क्रोम, एज या ब्रेव (Manifest V3 supported)',
        ),
        requirements: [
          t(
            'A Chromium-based browser — Chrome 88+, Edge 88+ or Brave',
            'क्रोमियम-आधारित ब्राउज़र — क्रोम 88+, एज 88+ या ब्रेव',
          ),
          t('About 2 MB of free disk space', 'लगभग 2 MB खाली डिस्क स्पेस'),
        ],
        steps: [
          {
            title: t('Download and unzip', 'डाउनलोड करें और अनज़िप करें'),
            body: t(
              'Click the download button above and extract the ZIP to a folder on your computer.',
              'ऊपर डाउनलोड बटन पर क्लिक करें और ZIP को अपने कंप्यूटर के किसी फोल्डर में एक्सट्रैक्ट करें।',
            ),
          },
          {
            title: t('Open the extensions page', 'एक्सटेंशन पेज खोलें'),
            body: t(
              'In your browser address bar, type chrome://extensions and press Enter.',
              'अपने ब्राउज़र के एड्रेस बार में chrome://extensions लिखें और Enter दबाएं।',
            ),
          },
          {
            title: t('Enable Developer mode', 'Developer mode चालू करें'),
            body: t(
              'Turn on the "Developer mode" toggle in the top-right corner.',
              'ऊपर-दाईं ओर "Developer mode" टॉगल चालू करें।',
            ),
          },
          {
            title: t('Load the extension', 'एक्सटेंशन लोड करें'),
            body: t(
              'Click "Load unpacked" and select the folder you extracted in step 1.',
              '"Load unpacked" पर क्लिक करें और step 1 में एक्सट्रैक्ट किया हुआ फोल्डर चुनें।',
            ),
          },
          {
            title: t('Pin it to the toolbar', 'टूलबार में पिन करें'),
            body: t(
              'Click the puzzle-piece icon in the browser toolbar and pin ShrinkIt so it is always one click away.',
              'ब्राउज़र टूलबार में पज़ल-पीस आइकन पर क्लिक करें और ShrinkIt को पिन करें।',
            ),
          },
        ],
        notes: [
          t(
            'Prefer automatic updates? ShrinkIt is coming to the Chrome Web Store soon — the store version will update itself.',
            'ऑटोमैटिक अपडेट चाहिए? ShrinkIt जल्द ही Chrome Web Store पर आ रहा है — स्टोर वर्शन खुद अपडेट होगा।',
          ),
        ],
      },
    ],
  },
];

/** Lookup helpers for templates. */
export const downloadsFor = (slug: string): AppDownloadPage | undefined =>
  downloads.find((d) => d.slug === slug);

export const platformDownloadFor = (
  slug: string,
  platform: string,
): PlatformDownload | undefined =>
  downloadsFor(slug)?.platforms.find((p) => p.platform === platform);

/** Display label + glyph per platform (labels are localized). */
export const platformMeta: Record<
  PlatformSlug,
  { label: LText; glyph: string }
> = {
  windows: {
    label: t('Windows', 'विंडोज़'),
    glyph: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8" aria-hidden="true"><path d="M3 5.5 10.5 4.4v7.1H3zM11.9 4.2 21 3v8.5h-9.1zM3 12.7h7.5v7.1L3 18.7zM11.9 12.7H21V21l-9.1-1.2z"/></svg>`,
  },
  macos: {
    label: t('macOS', 'macOS'),
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" aria-hidden="true"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  },
  linux: {
    label: t('Linux', 'लिनक्स'),
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" aria-hidden="true"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="m9 9 2 2 4-4"/></svg>`,
  },
  android: {
    label: t('Android', 'एंड्रॉयड'),
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18.5h2"/></svg>`,
  },
  ios: {
    label: t('iOS', 'iOS'),
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18.5h2"/></svg>`,
  },
  chrome: {
    label: t('Chrome extension', 'क्रोम एक्सटेंशन'),
    glyph: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8" aria-hidden="true"><path d="M15 4h5v5"/><path d="M20 4 12 12"/><path d="M20 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>`,
  },
};

export const pick = (text: LText, lang: Lang): string =>
  lang === 'hi' ? text.hi : text.en;
