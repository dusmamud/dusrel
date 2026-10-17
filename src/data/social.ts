/**
 * Footer social links — single source of truth.
 *
 * To add/remove a network:
 *  1. Add/remove one line below (all use the "dusrel" handle).
 *  2. Drop its 24x24 brand SVG into public/icons/social/<id>.svg
 *     (exact brand glyphs from simple-icons).
 *  3. npm run build — the footer picks it up automatically.
 *
 * Icon convention: /icons/social/<id>.svg
 */

export interface SocialEntry {
  /** Icon file id -> /icons/social/<id>.svg */
  id: string;
  /** Accessible label, e.g. "Dusrel on X" */
  name: string;
  /** Full profile URL (all use the dusrel handle) */
  url: string;
}

export const socials: SocialEntry[] = [
  { id: 'x', name: 'Dusrel on X', url: 'https://x.com/dusrel' },
  { id: 'instagram', name: 'Dusrel on Instagram', url: 'https://instagram.com/dusrel' },
  { id: 'facebook', name: 'Dusrel on Facebook', url: 'https://facebook.com/dusrel' },
  { id: 'youtube', name: 'Dusrel on YouTube', url: 'https://youtube.com/@dusrel' },
  { id: 'linkedin', name: 'Dusrel on LinkedIn', url: 'https://linkedin.com/company/dusrel' },
  { id: 'github', name: 'Dusrel on GitHub', url: 'https://github.com/dusrel' },
  { id: 'tiktok', name: 'Dusrel on TikTok', url: 'https://tiktok.com/@dusrel' },
  { id: 'discord', name: 'Dusrel on Discord', url: 'https://discord.gg/dusrel' },
  { id: 'telegram', name: 'Dusrel on Telegram', url: 'https://t.me/dusrel' },
  { id: 'reddit', name: 'Dusrel on Reddit', url: 'https://www.reddit.com/r/dusrel/' },
  { id: 'pinterest', name: 'Dusrel on Pinterest', url: 'https://pinterest.com/dusrel' },
  { id: 'twitch', name: 'Dusrel on Twitch', url: 'https://twitch.tv/dusrel' },
  { id: 'mastodon', name: 'Dusrel on Mastodon', url: 'https://mastodon.social/@dusrel' },
  { id: 'bluesky', name: 'Dusrel on Bluesky', url: 'https://bsky.app/profile/dusrel' },
  { id: 'threads', name: 'Dusrel on Threads', url: 'https://threads.com/@dusrel' },
  { id: 'snapchat', name: 'Dusrel on Snapchat', url: 'https://snapchat.com/add/dusrel' },
];

/** /icons/social/<id>.svg */
export const socialIcon = (id: string): string => `/icons/social/${id}.svg`;
