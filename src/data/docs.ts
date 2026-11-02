// Public docs registry — one line per published doc, in display order.
// Titles and descriptions come from each .md file's frontmatter (never
// duplicated here), categories come from frontmatter too.
// To publish a doc: write src/content/docs/en/<slug>.md and add its slug below.
// To unpublish: remove the line — the .md file stays, nothing is deleted.
// Prev/next links and landing order both follow this list within a category.
export const docOrder = [
  'getting-started',
  'password-generator',
  'username-generator',
  'word-counter',
  'qr-code-generator',
  'age-calculator',
  'password-strength-checker',
  'shrinkit-web',
  'ricsline-lrc-maker',
  'resumeforge',
  'pdf-tools',
  'dusrel-mail-preview',
  'dusrel-apps-overview',
  'privacy-on-device',
  'about-dusrel',
];

export const docCategories = [
  { id: 'guides', en: 'Guides', hi: 'गाइड्स' },
  { id: 'tools', en: 'Tools', hi: 'टूल्स' },
  { id: 'apps', en: 'Apps', hi: 'ऐप्स' },
  { id: 'concepts', en: 'Concepts', hi: 'कॉन्सेप्ट्स' },
] as const;

export const docTypeLabels: Record<string, { en: string; hi: string }> = {
  tutorial: { en: 'Tutorial', hi: 'ट्यूटोरियल' },
  'how-to': { en: 'How-to guide', hi: 'कैसे करें' },
  reference: { en: 'Reference', hi: 'रेफ़रेंस' },
  explanation: { en: 'Explanation', hi: 'व्याख्या' },
};

export const docHref = (slug: string, lang: 'en' | 'hi') =>
  `${lang === 'hi' ? '/hi' : ''}/docs/${slug}/`;
