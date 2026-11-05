export interface CategoryMeta {
  name: string;
  iconName: string;
  description: string;
}

export const CATEGORY_METADATA: CategoryMeta[] = [
  { name: 'Fresh Home Bakes & Meals', iconName: 'UtensilsCrossed', description: 'Freshly baked breads and home meals' },
  { name: 'Pre-loved Electronics', iconName: 'Laptop', description: 'Gadgets, speakers, monitors' },
  { name: 'Home & Furniture', iconName: 'Armchair', description: 'Chairs, desks, lamps' },
  { name: 'Kids & Toys', iconName: 'Gamepad2', description: 'Games, cycles, baby essentials' },
  { name: 'Skill Exchange & Services', iconName: 'Sparkles', description: 'Tutoring, car wash, pet care' },
  { name: 'Garden & Plants', iconName: 'Sprout', description: 'Potted greens, seeds, planters' },
  { name: 'Books & Hobbies', iconName: 'BookOpen', description: 'Novels, board games, musical gear' },
  { name: 'Tools & Utilities', iconName: 'Wrench', description: 'Power drills, ladders, toolkits' }
];
