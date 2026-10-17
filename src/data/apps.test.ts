import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  appContentFor,
  appDetailHref,
  appIcon,
  appShowcaseImage,
  apps,
  liveApps,
  soonApps,
} from './apps.js';
import { dict } from '../i18n/index.js';
import { featureIcons } from './feature-icons.js';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const publicFile = (p: string) => join(repoRoot, 'public', p);

describe('app registry', () => {
  it('has unique slugs', () => {
    const slugs = apps.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('live apps have a public URL, soon apps do not', () => {
    for (const a of liveApps) {
      expect(a.status).toBe('live');
      expect(a.url.startsWith('https://')).toBe(true);
    }
    for (const a of soonApps) {
      expect(a.status).toBe('soon');
      expect(a.url).toBe('');
    }
  });

  it('derives asset paths from the slug by convention', () => {
    expect(appIcon('image-quill')).toBe('/icons/image-quill.svg');
    expect(appShowcaseImage('pdf-tools')).toBe('/images/showcase-pdf-tools.jpg');
  });

  it('builds locale-aware detail hrefs', () => {
    expect(appDetailHref('ricsline', 'en')).toBe('/apps/ricsline');
    expect(appDetailHref('ricsline', 'hi')).toBe('/hi/apps/ricsline');
  });

  it('ships icon + showcase assets for every live app', () => {
    for (const a of liveApps) {
      expect(existsSync(publicFile(appIcon(a.slug))), `${a.slug} icon`).toBe(true);
      expect(existsSync(publicFile(appShowcaseImage(a.slug))), `${a.slug} showcase`).toBe(true);
    }
  });

  it('has feature icons for every live app', () => {
    for (const a of liveApps) {
      const icons = featureIcons[a.slug];
      expect(Array.isArray(icons) && icons.length > 0, `${a.slug} icons`).toBe(true);
      for (const icon of icons!) expect(icon).toContain('<svg');
    }
  });
});

describe('localized app content', () => {
  for (const lang of ['en', 'hi'] as const) {
    it(`[${lang}] every live app has appContent with a name`, () => {
      const content = dict[lang].appContent;
      for (const a of liveApps) {
        const c = appContentFor(content, a.slug);
        expect(c.name.length, `${a.slug} name`).toBeGreaterThan(0);
      }
    });

    it(`[${lang}] every live app has a complete appPages entry`, () => {
      const pages = dict[lang].appPages as Record<string, Record<string, unknown>>;
      for (const a of liveApps) {
        const p = pages[a.slug];
        expect(p, `${a.slug} appPages`).toBeDefined();
        for (const field of [
          'metaTitle',
          'metaDesc',
          'name',
          'tagline',
          'heroSub',
          'openApp',
          'bullets',
          'featuresTitle',
          'features',
          'privacyTitle',
          'privacyBody',
          'moreTitle',
          'ctaTitle',
          'ctaSub',
          'ctaButton',
        ]) {
          expect(p[field], `${a.slug}.${field}`).toBeDefined();
        }
        expect((p['features'] as unknown[]).length, `${a.slug} features`).toBeGreaterThan(0);
        expect((p['bullets'] as unknown[]).length, `${a.slug} bullets`).toBeGreaterThan(0);
      }
    });
  }

  it('falls back to the slug when content is missing', () => {
    expect(appContentFor({}, 'nope')).toEqual({ name: 'nope' });
  });
});
