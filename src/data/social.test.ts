import { describe, expect, it } from 'vitest';
import { socials, socialSvg } from './social.js';

describe('footer socials', () => {
  it('every entry has a label, https url and an svg glyph', () => {
    expect(socials.length).toBeGreaterThan(0);
    for (const s of socials) {
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.url.startsWith('https://'), s.name).toBe(true);
      expect(s.icon).toContain('<path');
    }
  });

  it('renders theme-adaptive svg (currentColor, no brand colors)', () => {
    const svg = socialSvg(socials[0].icon);
    expect(svg).toContain('viewBox="0 0 24 24"');
    expect(svg).toContain('fill="currentColor"');
    expect(svg).not.toMatch(/fill="#[0-9a-fA-F]{6}"/);
    expect(svg).toContain(socials[0].icon);
  });
});
