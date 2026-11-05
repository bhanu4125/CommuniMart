export type UserRole = 'resident' | 'verified_seller' | 'committee_admin';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  phase: string;            // e.g. "Phase 1 - Green Meadows"
  block: string;            // e.g. "Tower A", "Tower B", "Villa Grove"
  flatNumber: string;       // e.g. "A-402", "B-101", "V-12"
  hideFlatNumber: boolean;  // Privacy toggle: mask flat publicly until order
  verificationStatus: VerificationStatus;
  verificationCode?: string;
  badges: string[];         // e.g. "Punctual Neighbor", "Trusted Baker", "Prompt Handover"
  rating: number;
  ratingCount: number;
  upiId?: string;           // For direct UPI QR payments
  joinedDate: Date;
  bio?: string;
}

export type ListingMode = 'sell' | 'rent' | 'giveaway';
export type ItemCondition = 'Brand New' | 'Like New' | 'Good' | 'Fair';
export type ItemCategory = 
  | 'Fresh Home Bakes & Meals'
  | 'Pre-loved Electronics'
  | 'Home & Furniture'
  | 'Kids & Toys'
  | 'Skill Exchange & Services'
  | 'Garden & Plants'
  | 'Books & Hobbies'
  | 'Tools & Utilities';

export type HandoverOption = 
  | 'Doorstep Delivery' 
  | 'Club House / Security Gate Drop-box' 
  | 'Direct Pickup from Seller Flat';

export type PaymentMethod = 'direct_upi' | 'cash_on_handover' | 'society_escrow';

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  category: ItemCategory;
  listingMode: ListingMode;
  price: number;                    // 0 for giveaway
  rentDuration?: 'hour' | 'day' | 'week';
  rentDeposit?: number;
  condition?: ItemCondition;
  images: string[];
  seller: IUser;
  handoverOptions: HandoverOption[];
  available: boolean;
  block: string;                    // Seller's block for quick filtering
  tags: string[];
  views: number;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'Requested' 
  | 'Accepted by Neighbor' 
  | 'Ready for Handover' 
  | 'Completed' 
  | 'Cancelled';

export interface IOrder {
  _id: string;
  product: IProduct;
  buyer: IUser;
  seller: IUser;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'verified';
  handoverOption: HandoverOption;
  handoverNote?: string;
  totalAmount: number;
  upiReference?: string;
  requestedDates?: {
    startDate?: Date;
    endDate?: Date;
  };
  review?: {
    rating: number;
    comment: string;
    badgesAwarded: string[];
    createdAt: Date;
  };
  timeline: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: string;
  sender: IUser;
  recipient: IUser;
  product?: string;                 // Product ID context if linked
  order?: string;                   // Order ID context if linked
  text: string;
  isQuickReply?: boolean;
  read: boolean;
  createdAt: Date;
}

export interface INotice {
  _id: string;
  author: IUser;
  title: string;
  description: string;
  category: 'Request / Borrow' | 'Flash Sale / Treat' | 'Notice / Alert' | 'Skill Offer';
  urgency: 'normal' | 'urgent';
  resolved: boolean;
  repliesCount: number;
  createdAt: Date;
}

