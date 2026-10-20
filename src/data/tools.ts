/**
 * THE single source of truth for Dusrel's free tools (the /pass section).
 *
 * To add a tool:
 *  1. Add ONE entry below.
 *  2. Build its component in src/components/tools/.
 *  3. Add its pages: src/pages/pass/<slug>.astro + src/pages/hi/pass/<slug>.astro
 *  4. npm run build — the footer Tools column and the /pass hub pick it up
 *     automatically from this file.
 */

export interface ToolEntry {
  /** URL slug under /pass/, e.g. 'password-generator' */
  slug: string;
  name: { en: string; hi: string };
  /** One-line description for cards and the hub */
  blurb: { en: string; hi: string };
}

export const tools: ToolEntry[] = [
  {
    slug: 'password-generator',
    name: { en: 'Password Generator', hi: 'पासवर्ड जेनरेटर' },
    blurb: {
      en: 'Strong, random passwords generated locally in your browser — nothing is ever sent to a server.',
      hi: 'मज़बूत, रैंडम पासवर्ड आपके ब्राउज़र में ही बनते हैं — कुछ भी किसी सर्वर पर कभी नहीं जाता।',
    },
  },
  {
    slug: 'username-generator',
    name: { en: 'Username Generator', hi: 'यूज़रनेम जेनरेटर' },
    blurb: {
      en: 'Catchy username ideas for social media, gaming and more — pick a style and click to copy.',
      hi: 'सोशल मीडिया, गेमिंग और भी बहुत कुछ के लिए आकर्षक यूज़रनेम आइडिया — स्टाइल चुनें और क्लिक करके कॉपी करें।',
    },
  },
];

export const toolHref = (slug: string, lang: 'en' | 'hi'): string =>
  `${lang === 'hi' ? '/hi' : ''}/pass/${slug}/`;

export const toolsHubHref = (lang: 'en' | 'hi'): string =>
  `${lang === 'hi' ? '/hi' : ''}/pass/`;
