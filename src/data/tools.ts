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
  {
    slug: 'word-counter',
    name: { en: 'Word Counter', hi: 'वर्ड काउंटर' },
    blurb: {
      en: 'Count words, characters, sentences and reading time — live, as you type or paste.',
      hi: 'शब्द, अक्षर, वाक्य और पढ़ने का समय गिनें — लिखते या पेस्ट करते ही लाइव।',
    },
  },
  {
    slug: 'qr-code-generator',
    name: { en: 'QR Code Generator', hi: 'QR कोड जेनरेटर' },
    blurb: {
      en: 'Turn any link or text into a QR code and download it as a PNG — free, no watermark.',
      hi: 'किसी भी लिंक या टेक्स्ट को QR कोड में बदलें और PNG डाउनलोड करें — मुफ्त, बिना वॉटरमार्क।',
    },
  },
  {
    slug: 'age-calculator',
    name: { en: 'Age Calculator', hi: 'आयु कैलकुलेटर' },
    blurb: {
      en: 'Your exact age in years, months and days — plus total days and your next birthday.',
      hi: 'आपकी exact उम्र साल, महीने और दिनों में — साथ में कुल दिन और अगला जन्मदिन।',
    },
  },
  {
    slug: 'password-strength-checker',
    name: { en: 'Password Strength Checker', hi: 'पासवर्ड स्ट्रेंथ चेकर' },
    blurb: {
      en: 'See how strong your password really is — entropy, crack time and honest feedback, all local.',
      hi: 'देखें आपका पासवर्ड असल में कितना मज़बूत है — एंट्रॉपी, क्रैक टाइम और ईमानदार फीडबैक, सब लोकल।',
    },
  },
];

export const toolHref = (slug: string, lang: 'en' | 'hi'): string =>
  `${lang === 'hi' ? '/hi' : ''}/pass/${slug}/`;

export const toolsHubHref = (lang: 'en' | 'hi'): string =>
  `${lang === 'hi' ? '/hi' : ''}/pass/`;
