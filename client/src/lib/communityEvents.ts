export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
}

export const UPCOMING_SOCIETY_EVENTS: CommunityEvent[] = [
  { id: '1', title: 'Sunday Morning Resident Flea Market', date: 'This Sunday, 9am - 1pm', venue: 'Clubhouse Central Lawn' },
  { id: '2', title: 'Pre-Loved Book & Toy Swap Meet', date: 'Next Saturday, 4pm - 7pm', venue: 'Tower B Amphitheatre' }
];
