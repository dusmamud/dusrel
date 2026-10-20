/**
 * THE single source of truth for Dusrel apps.
 *
 * To add a new app:
 *  1. Add one line below: { slug: 'my-app', url: 'https://...', status: 'live' }
 *     (use status: 'soon' for unreleased apps — they appear in Roadmap/Waitlist automatically)
 *  2. Add its name/description/features to src/i18n/en.ts + hi.ts under `appContent['my-app']`
 *  3. Add its detail-page content to src/i18n/en.ts + hi.ts under `appPages['my-app']`
 *     (metaTitle, metaDesc, name, tagline, heroSub, openApp, bullets,
 *      featuresTitle, features[], privacyTitle, privacyBody,
 *      moreTitle, ctaTitle, ctaSub, ctaButton)
 *  4. Add 6 feature icons to src/data/feature-icons.ts under 'my-app'
 *  5. Drop `public/icons/my-app.svg` and `public/images/showcase-my-app.jpg` into public/
 *  6. npm run build — hero orbit, ecosystem grid, showcase, roadmap, waitlist,
 *     apps hub, footer AND the /apps/<slug> detail page all pick it up
 *     automatically (via src/pages/apps/[slug].astro). No new .astro file needed.
 *
 * Asset convention (do not rename — components derive these paths from the slug):
 *  icon           -> /icons/<slug>.svg
 *  showcase image -> /images/showcase-<slug>.jpg
 *  detail page    -> /apps/<slug>  (or /hi/apps/<slug>)
 */

export type AppStatus = 'live' | 'soon';
export type Lang = 'en' | 'hi';

export interface AppEntry {
  /** URL-safe id. Must match the detail page src/pages/apps/<slug>.astro (if one exists). */
  slug: string;
  /** Public URL of the live app. Empty string for unreleased ('soon') apps. */
  url: string;
  status: AppStatus;
}

export const apps: AppEntry[] = [
  // --- Live ---
  { slug: 'shrinkit', url: 'https://shrinkit.dusrel.com', status: 'live' },
  {
    slug: 'ricsline',
    url: 'https://dusmamud.github.io/ricsline/',
    status: 'live',
  },
  {
    slug: 'resumeforge',
    url: 'https://dusmamud.github.io/resumeforge/',
    status: 'live',
  },
  {
    slug: 'pdf-tools',
    url: 'https://dusmamud.github.io/pdf-tools/',
    status: 'live',
  },
  // --- Coming soon (order matters: first 4 -> "Coming next", rest -> "On the horizon") ---
  { slug: 'drive', url: '', status: 'soon' },
  { slug: 'chat', url: '', status: 'soon' },
  { slug: 'docs', url: '', status: 'soon' },
  { slug: 'sheets', url: '', status: 'soon' },
  { slug: 'notes', url: '', status: 'soon' },
  { slug: 'mail', url: '', status: 'soon' },
  { slug: 'meet', url: '', status: 'soon' },
  { slug: 'calendar', url: '', status: 'soon' },
];

export const liveApps: AppEntry[] = apps.filter((a) => a.status === 'live');
export const soonApps: AppEntry[] = apps.filter((a) => a.status === 'soon');

/** /icons/<slug>.svg — drop the file in public/icons/, no code change needed. */
export const appIcon = (slug: string): string => `/icons/${slug}.svg`;

/** /images/showcase-<slug>.jpg — drop the file in public/images/, no code change needed. */
export const appShowcaseImage = (slug: string): string =>
  `/images/showcase-${slug}.jpg`;

/** Locale-aware link to the app's detail page: /apps/<slug>/ or /hi/apps/<slug>/.
 *  Trailing slash matches the canonical URL form (Cloudflare 308s no-slash). */
export const appDetailHref = (slug: string, lang: Lang): string =>
  `${lang === 'hi' ? '/hi' : ''}/apps/${slug}/`;

/**
 * Localized per-app content lives in src/i18n/{locale}.ts under `appContent[slug]`.
 * This type documents the fields components may use. `name` is required for every
 * app; the rest are only needed for live apps (showcase/ecosystem cards).
 */
export interface AppContent {
  name: string;
  desc?: string;
  tagline?: string;
  features?: string[];
}

/**
 * Safe localized lookup: content[slug], falling back to the slug as the name
 * so a missing i18n entry renders something readable instead of crashing.
 * (A literal-sounding fallback also makes the gap obvious during review.)
 */
export function appContentFor(
  all: Record<string, AppContent>,
  slug: string,
): AppContent {
  return all[slug] ?? { name: slug };
}
