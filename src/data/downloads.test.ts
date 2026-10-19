import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { apps } from './apps.js';
import {
  downloads,
  platformDownloadFor,
  platformMeta,
  type PlatformSlug,
} from './downloads.js';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const publicFile = (p: string) => join(repoRoot, 'public', p.replace(/^\//, ''));

const slugs = new Set(apps.map((a) => a.slug));

describe('download registry', () => {
  it('references only known app slugs', () => {
    for (const d of downloads) {
      expect(slugs.has(d.slug), `unknown slug ${d.slug}`).toBe(true);
    }
  });

  it('has at least one platform per app', () => {
    for (const d of downloads) {
      expect(d.platforms.length, d.slug).toBeGreaterThan(0);
    }
  });

  it('every platform has complete metadata', () => {
    for (const d of downloads) {
      for (const p of d.platforms) {
        expect(p.version, `${d.slug}/${p.platform} version`).toBeTruthy();
        expect(p.fileSize, `${d.slug}/${p.platform} fileSize`).toBeTruthy();
        expect(p.updated, `${d.slug}/${p.platform} updated`).toMatch(
          /^\d{4}-\d{2}-\d{2}$/,
        );
        expect(p.fileName, `${d.slug}/${p.platform} fileName`).toBeTruthy();
        expect(p.downloadUrl, `${d.slug}/${p.platform} url`).toBeTruthy();
        expect(p.os.en && p.os.hi, `${d.slug}/${p.platform} os`).toBeTruthy();
        expect(
          p.requirements.length,
          `${d.slug}/${p.platform} requirements`,
        ).toBeGreaterThan(0);
        for (const r of p.requirements)
          expect(r.en && r.hi, `${d.slug}/${p.platform} requirement`).toBeTruthy();
        expect(p.steps.length, `${d.slug}/${p.platform} steps`).toBeGreaterThan(0);
        for (const s of p.steps)
          expect(
            s.title.en && s.title.hi && s.body.en && s.body.hi,
            `${d.slug}/${p.platform} step`,
          ).toBeTruthy();
        for (const n of p.notes)
          expect(n.en && n.hi, `${d.slug}/${p.platform} note`).toBeTruthy();
        expect(
          (Object.keys(platformMeta) as PlatformSlug[]).includes(p.platform),
          `${d.slug}/${p.platform} meta`,
        ).toBe(true);
      }
    }
  });

  it('local download files exist in public/downloads', () => {
    for (const d of downloads) {
      for (const p of d.platforms) {
        if (p.downloadUrl.startsWith('/downloads/')) {
          expect(
            existsSync(publicFile(p.downloadUrl)),
            `${d.slug}/${p.platform} file`,
          ).toBe(true);
        }
      }
    }
  });

  it('platformDownloadFor resolves every registered platform', () => {
    for (const d of downloads) {
      for (const p of d.platforms) {
        expect(platformDownloadFor(d.slug, p.platform)).toBeDefined();
      }
    }
    expect(platformDownloadFor('nope', 'windows')).toBeUndefined();
  });
});
