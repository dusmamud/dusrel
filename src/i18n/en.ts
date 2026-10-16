export const en = {
  meta: {
    title: 'Dusrel — Free, privacy-first apps',
    description:
      'Dusrel crafts free apps that truly respect your privacy. Your data stays yours — we never sell it.',
  },
  nav: {
    apps: 'Apps',
    why: 'Why Dusrel',
    privacy: 'Privacy',
    contact: 'Contact',
    cta: 'Explore apps',
  },
  hero: {
    eyebrow: 'YOUR PRIVACY MATTERS',
    titleAccent: 'One company.',
    title: 'Every app you will ever need.',
    sub: 'Dusrel crafts free apps that truly respect your privacy. Your data stays yours — we never sell it.',
    ctaApps: 'Explore the apps',
    ctaPrivacy: 'Our privacy promise',
    stats: [
      { value: '4', label: 'apps live today' },
      { value: '8', label: 'apps coming soon' },
      { value: '2', label: 'languages' },
      { value: '100%', label: 'free core' },
    ],
  },
  ecosystem: {
    title: 'The Dusrel ecosystem',
    sub: 'Live today. More on the way.',
    liveLabel: 'Live',
    soonLabel: 'Coming soon',
    visit: 'Open app',
    apps: [
      {
        name: 'Image Quill',
        desc: 'Free online image tools — compress, convert, resize and edit images right in your browser.',
        url: 'https://imagequill.dusrel.com',
      },
      {
        name: 'Ricsline',
        desc: 'Make LRC lyrics files with tap-to-sync precision and a built-in library.',
        url: 'https://dusmamud.github.io/ricsline/',
      },
      {
        name: 'ResumeForge',
        desc: 'Build a beautiful resume and download a print-ready PDF — free.',
        url: 'https://dusmamud.github.io/resumeforge/',
      },
      {
        name: 'PDF Tools',
        desc: 'Merge, split, compress and edit PDFs — 100% free, fully client-side.',
        url: 'https://dusmamud.github.io/pdf-tools/',
      },
    ],
    soon: [
      'Dusrel Drive',
      'Dusrel Chat',
      'Dusrel Docs',
      'Dusrel Sheets',
      'Dusrel Notes',
      'Dusrel Mail',
      'Dusrel Meet',
      'Dusrel Calendar',
    ],
  },
  why: {
    title: 'Why Dusrel?',
    sub: 'Big-tech features. Indie soul.',
    points: [
      {
        title: 'Free forever core',
        desc: 'Every app’s core is free. No sign-up walls for the basics.',
      },
      {
        title: 'Privacy by default',
        desc: 'No creepy tracking. Your data stays yours — we never sell it.',
      },
      {
        title: 'Fast & lightweight',
        desc: 'No bloat. Apps that open instantly and respect your device.',
      },
      {
        title: 'One account, everything',
        desc: 'A single Dusrel account across the whole ecosystem.',
      },
    ],
  },
  privacy: {
    title: 'Our privacy promise',
    quote: 'Your data stays yours — we never sell it.',
    body: 'Dusrel exists because your privacy matters. Our apps are built to work without harvesting your life: no data brokers, no creepy profiles, nothing sold that was never ours to sell.',
  },
  footer: {
    tagline: 'Free, privacy-first apps for everyone.',
    rights: '© 2026 Dusrel. All rights reserved.',
  },
};

export type Dict = typeof en;
