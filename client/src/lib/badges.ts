export interface BadgeConfig {
  name: string;
  color: string;
  description: string;
}

export const COMMUNITY_BADGES: Record<string, BadgeConfig> = {
  'Punctual Neighbor': {
    name: 'Punctual Neighbor',
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Always hands over items at the agreed upon time'
  },
  'Trusted Baker': {
    name: 'Trusted Baker',
    color: 'bg-amber-100 text-amber-800',
    description: 'Verified home chef with top hygiene ratings'
  },
  'Prompt Handover': {
    name: 'Prompt Handover',
    color: 'bg-teal-100 text-teal-800',
    description: 'Quick drop-box security gate placement'
  }
};
