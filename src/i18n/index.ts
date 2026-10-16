import { en } from './en';
import { hi } from './hi';

export const dict = { en, hi } as const;
export type Lang = keyof typeof dict;
